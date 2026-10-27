"""
FastAPI REST API Routes for SkillSync AI Platform.
"""
import json
import logging
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query
from pydantic import BaseModel

from backend.app.nlp.pdf_extractor import extract_text_from_pdf_bytes
from backend.app.nlp.cleaner import clean_text, detect_sections, extract_contact_info, extract_education_level, estimate_experience_years
from backend.app.nlp.skill_extractor import extract_skills_from_text
from backend.app.matching.jd_analyzer import analyze_job_description
from backend.app.matching.matching_engine import compare_skills
from backend.app.scoring.scorer import calculate_compatibility_score, DEFAULT_WEIGHTS
from backend.app.recommendations.roadmap_generator import generate_personalized_roadmap
from backend.app.recommendations.improvement_studio import generate_resume_improvements
from backend.app.recommendations.project_generator import generate_project_recommendations
from backend.app.recommendations.interview_prep import generate_interview_prep
from backend.app.recommendations.llm_service import get_llm_status, enhance_recommendations_with_llm
from backend.app.storage.database import (
    save_analysis_record, list_analysis_history, get_analysis_by_id,
    delete_analysis_by_id, clear_all_history
)

logger = logging.getLogger("skillsync.api")
router = APIRouter(prefix="/api")

# Pydantic Schemas
class TextAnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    target_role: str = "Target Position"
    experience_level: str = "Mid-Level"
    custom_weights: Optional[Dict[str, float]] = None
    save_history: bool = True

class ExtractSkillsRequest(BaseModel):
    text: str

class JDAnalyzeRequest(BaseModel):
    job_description: str
    role_title: str = "Target Role"

class CompareSkillsRequest(BaseModel):
    resume_skills: List[Dict[str, Any]]
    jd_analysis: Dict[str, Any]
    resume_text: str = ""
    jd_text: str = ""
    target_role: str = "Target Position"
    experience_level: str = "Mid-Level"
    custom_weights: Optional[Dict[str, float]] = None

class MultipleJobCompareRequest(BaseModel):
    resume_text: str
    target_role: str = "Target Candidate"
    jobs: List[Dict[str, str]]  # list of { "title": str, "description": str }

class BeforeAfterRequest(BaseModel):
    original_resume_text: str
    updated_resume_text: str
    job_description: str
    target_role: str = "Target Role"

class SettingsUpdateRequest(BaseModel):
    weights: Optional[Dict[str, float]] = None
    llm_api_key: Optional[str] = None
    llm_provider: Optional[str] = None
    llm_model: Optional[str] = None


@router.post("/analyze-resume")
async def analyze_resume_endpoint(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: str = Form(...),
    target_role: str = Form("Target Position"),
    experience_level: str = Form("Mid-Level"),
    custom_weights: Optional[str] = Form(None),
    save_history: bool = Form(True)
):
    """
    Main resume analysis pipeline:
    Accepts PDF upload or raw text, parses sections, extracts skills,
    analyzes JD, runs semantic comparison, scores compatibility, and generates roadmaps.
    """
    extracted_text = ""
    pdf_meta = {}

    if file:
        filename = file.filename or "resume.pdf"
        if not filename.lower().endswith((".pdf", ".txt")):
            raise HTTPException(status_code=400, detail="Invalid file format. Please upload a .pdf or .txt file.")
        
        content_bytes = await file.read()
        if len(content_bytes) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail="File too large. Maximum supported size is 10MB.")

        if filename.lower().endswith(".pdf"):
            pdf_result = extract_text_from_pdf_bytes(content_bytes, filename)
            extracted_text = pdf_result["text"]
            pdf_meta = {
                "filename": filename,
                "page_count": pdf_result["page_count"],
                "char_count": pdf_result["char_count"],
                "word_count": pdf_result["word_count"],
                "is_scanned": pdf_result["is_scanned"],
                "warning": pdf_result["warning"]
            }
        else:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
            pdf_meta = {"filename": filename, "page_count": 1, "is_scanned": False, "warning": None}

    if not extracted_text and resume_text:
        extracted_text = resume_text.strip()
        pdf_meta = {"filename": "Pasted Resume Text", "page_count": 1, "is_scanned": False, "warning": None}

    if not extracted_text:
        raise HTTPException(status_code=400, detail="No readable text found. Please provide resume text or a valid PDF.")

    if not job_description or len(job_description.strip()) < 20:
        raise HTTPException(status_code=400, detail="Job description is too short. Please provide a detailed job description.")

    # Parse custom weights if supplied
    parsed_weights = None
    if custom_weights:
        try:
            parsed_weights = json.loads(custom_weights)
        except Exception:
            pass

    # Execute full pipeline
    cleaned_resume = clean_text(extracted_text)
    cleaned_jd = clean_text(job_description)

    sections = detect_sections(cleaned_resume)
    contact_info = extract_contact_info(cleaned_resume)
    edu_level = extract_education_level(cleaned_resume)
    exp_years = estimate_experience_years(cleaned_resume)

    resume_metadata = {
        "sections": sections,
        "contact_info": contact_info,
        "education_level": edu_level,
        "experience_years": exp_years,
        "pdf_info": pdf_meta
    }

    # Extract resume skills
    resume_skills = extract_skills_from_text(cleaned_resume, sections)

    # Analyze Job Description
    jd_analysis = analyze_job_description(cleaned_jd, target_role)

    # Semantic Skill Matching
    comparison = compare_skills(resume_skills, jd_analysis, cleaned_resume, cleaned_jd)

    # Calculate Compatibility Score
    scoring = calculate_compatibility_score(comparison, resume_metadata, jd_analysis, parsed_weights)

    # Generate Personalized Roadmap
    roadmap = generate_personalized_roadmap(comparison, target_role, experience_level)

    # Generate Resume Improvement Studio
    improvement_studio = generate_resume_improvements(cleaned_resume, sections, comparison, target_role, experience_level)

    # Generate Portfolio Projects
    project_recommendations = generate_project_recommendations(comparison.get("missing_skills", []), target_role)

    # Generate Interview Questions
    interview_prep = generate_interview_prep(comparison.get("missing_skills", []), target_role)

    # Optional LLM Enhancement
    llm_advice = enhance_recommendations_with_llm(
        target_role,
        comparison.get("matched_skills", []),
        comparison.get("missing_skills", []),
        sections.get("summary", "")
    )

    full_response = {
        "target_role": target_role,
        "experience_level": experience_level,
        "resume_metadata": resume_metadata,
        "resume_skills": resume_skills,
        "jd_analysis": jd_analysis,
        "comparison": comparison,
        "scoring": scoring,
        "roadmap": roadmap,
        "improvement_studio": improvement_studio,
        "project_recommendations": project_recommendations,
        "interview_prep": interview_prep,
        "llm_insights": llm_advice
    }

    # Save to history if requested
    record_id = None
    if save_history:
        try:
            record_id = save_analysis_record(full_response)
        except Exception as e:
            logger.error(f"Failed to save record to database: {e}")
    full_response["id"] = record_id

    return full_response


@router.post("/extract-skills")
def extract_skills_endpoint(req: ExtractSkillsRequest):
    """Extracts skills and category classification from any given text."""
    cleaned = clean_text(req.text)
    skills = extract_skills_from_text(cleaned)
    return {"skills": skills, "total_extracted": len(skills)}


@router.post("/analyze-job-description")
def analyze_jd_endpoint(req: JDAnalyzeRequest):
    """Analyzes a job description and returns editable categorized skills."""
    cleaned = clean_text(req.job_description)
    analysis = analyze_job_description(cleaned, req.role_title)
    return analysis


@router.post("/compare-skills")
def compare_skills_endpoint(req: CompareSkillsRequest):
    """Recalculates match results using edited skills or custom weights."""
    comparison = compare_skills(req.resume_skills, req.jd_analysis, req.resume_text, req.jd_text)
    resume_meta = {
        "sections": {},
        "experience_years": 3.0
    }
    scoring = calculate_compatibility_score(comparison, resume_meta, req.jd_analysis, req.custom_weights)
    roadmap = generate_personalized_roadmap(comparison, req.target_role, req.experience_level)
    return {
        "comparison": comparison,
        "scoring": scoring,
        "roadmap": roadmap
    }


@router.post("/compare-jobs")
def compare_multiple_jobs_endpoint(req: MultipleJobCompareRequest):
    """
    Compares 1 resume against multiple job descriptions simultaneously.
    """
    if not req.jobs:
        raise HTTPException(status_code=400, detail="Please provide at least one job description.")

    cleaned_resume = clean_text(req.resume_text)
    sections = detect_sections(cleaned_resume)
    resume_skills = extract_skills_from_text(cleaned_resume, sections)
    resume_meta = {
        "sections": sections,
        "experience_years": estimate_experience_years(cleaned_resume)
    }

    comparison_results = []
    for job in req.jobs:
        title = job.get("title", "Position")
        desc = job.get("description", "")
        if not desc:
            continue
        cleaned_jd = clean_text(desc)
        jd_analysis = analyze_job_description(cleaned_jd, title)
        comp = compare_skills(resume_skills, jd_analysis, cleaned_resume, cleaned_jd)
        score_data = calculate_compatibility_score(comp, resume_meta, jd_analysis)

        comparison_results.append({
            "job_title": title,
            "overall_score": score_data["overall_score"],
            "score_tier": score_data["score_tier"],
            "matched_skills_count": comp["total_matched_count"],
            "missing_skills_count": comp["total_missing_count"],
            "matched_skills": [s["skill"] for s in comp["matched_skills"][:5]],
            "missing_critical_skills": [s["skill"] for s in comp["missing_skills"] if s.get("tier") == "required"][:4],
            "strengths": score_data["strengths"][:2],
            "key_gaps": score_data["improvement_priorities"][:2]
        })

    # Sort descending by score
    comparison_results.sort(key=lambda x: -x["overall_score"])
    return {
        "total_jobs_evaluated": len(comparison_results),
        "rankings": comparison_results
    }


@router.post("/before-after")
def before_after_endpoint(req: BeforeAfterRequest):
    """
    Compares original resume vs updated resume against the same JD to show alignment gain.
    """
    cleaned_jd = clean_text(req.job_description)
    jd_analysis = analyze_job_description(cleaned_jd, req.target_role)

    # 1. Evaluate Original
    orig_clean = clean_text(req.original_resume_text)
    orig_sections = detect_sections(orig_clean)
    orig_skills = extract_skills_from_text(orig_clean, orig_sections)
    orig_meta = {"sections": orig_sections, "experience_years": estimate_experience_years(orig_clean)}
    orig_comp = compare_skills(orig_skills, jd_analysis, orig_clean, cleaned_jd)
    orig_score = calculate_compatibility_score(orig_comp, orig_meta, jd_analysis)

    # 2. Evaluate Updated
    upd_clean = clean_text(req.updated_resume_text)
    upd_sections = detect_sections(upd_clean)
    upd_skills = extract_skills_from_text(upd_clean, upd_sections)
    upd_meta = {"sections": upd_sections, "experience_years": estimate_experience_years(upd_clean)}
    upd_comp = compare_skills(upd_skills, jd_analysis, upd_clean, cleaned_jd)
    upd_score = calculate_compatibility_score(upd_comp, upd_meta, jd_analysis)

    score_delta = round(upd_score["overall_score"] - orig_score["overall_score"], 1)

    # Newly matched skills
    orig_matched_set = {s["skill"] for s in orig_comp["matched_skills"]}
    newly_matched = [s["skill"] for s in upd_comp["matched_skills"] if s["skill"] not in orig_matched_set]

    return {
        "before": {
            "score": orig_score["overall_score"],
            "score_tier": orig_score["score_tier"],
            "matched_count": orig_comp["total_matched_count"],
            "missing_count": orig_comp["total_missing_count"]
        },
        "after": {
            "score": upd_score["overall_score"],
            "score_tier": upd_score["score_tier"],
            "matched_count": upd_comp["total_matched_count"],
            "missing_count": upd_comp["total_missing_count"]
        },
        "delta": score_delta,
        "newly_matched_skills": newly_matched,
        "impact_summary": (
            f"Resume revisions improved estimated alignment by +{score_delta}% "
            f"by successfully demonstrating evidence for {', '.join(newly_matched) if newly_matched else 'relevant competencies'}."
            if score_delta > 0 else "Scores remained comparable. Ensure newly added skills contain descriptive project context."
        )
    }


@router.get("/history")
def get_history_endpoint():
    """Returns past analysis records."""
    return list_analysis_history()


@router.get("/history/{record_id}")
def get_history_record_endpoint(record_id: str):
    """Retrieves full analysis by ID."""
    record = get_analysis_by_id(record_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return record


@router.delete("/history/{record_id}")
def delete_history_record_endpoint(record_id: str):
    """Deletes an analysis record."""
    success = delete_analysis_by_id(record_id)
    if not success:
        raise HTTPException(status_code=404, detail="Analysis record not found.")
    return {"deleted": True, "id": record_id}


@router.delete("/history")
def clear_history_endpoint():
    """Clears all analysis records for total data privacy."""
    count = clear_all_history()
    return {"deleted_all": True, "count": count}


@router.get("/settings")
def get_settings_endpoint():
    """Retrieves current scoring weights and LLM integration status."""
    llm = get_llm_status()
    return {
        "default_weights": DEFAULT_WEIGHTS,
        "llm_status": llm
    }


@router.get("/sample-data")
def get_sample_data_endpoint():
    """Returns ready-to-run demo resumes and job descriptions for rapid testing."""
    from backend.app.storage.sample_presets import SAMPLE_PRESETS
    return SAMPLE_PRESETS
