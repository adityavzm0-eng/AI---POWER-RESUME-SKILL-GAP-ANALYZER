"""
Automated Unit and Integration Tests for SkillSync AI Backend.
Tests:
- PDF text extraction
- Skill extraction
- Skill normalization
- Skill matching
- Score calculation
- Missing-skill identification
- Invalid file handling
- API error handling
"""
import pytest
from fastapi.testclient import TestClient

from backend.main import app
from backend.app.nlp.skills_db import resolve_skill, CANONICAL_LOOKUP
from backend.app.nlp.cleaner import clean_text, detect_sections, extract_contact_info, extract_education_level
from backend.app.nlp.skill_extractor import extract_skills_from_text
from backend.app.matching.jd_analyzer import analyze_job_description
from backend.app.matching.matching_engine import compare_skills, compute_tfidf_similarity
from backend.app.scoring.scorer import calculate_compatibility_score
from backend.app.recommendations.roadmap_generator import generate_personalized_roadmap
from backend.app.nlp.pdf_extractor import extract_text_from_pdf_bytes

client = TestClient(app)

# 1. Test Skill Normalization and Aliases
def test_skill_normalization():
    # Verify variations resolve to canonical names
    skill, category = resolve_skill("sklearn")
    assert skill == "Scikit-learn"
    assert "Machine Learning" in category

    skill, category = resolve_skill("postgres")
    assert skill == "PostgreSQL"

    skill, category = resolve_skill("k8s")
    assert skill == "Kubernetes"

    skill, category = resolve_skill("nlp")
    assert skill == "Natural Language Processing (NLP)"

    skill, category = resolve_skill("golang")
    assert skill == "Go"

# 2. Test Skill Extraction & Snippets
def test_skill_extraction_and_evidence():
    text = """
    Software Engineer with strong background in Python and FastAPI.
    Engineered computer vision models using PyTorch and OpenCV.
    Designed PostgreSQL database schemas and deployed containerized apps using Docker.
    """
    skills = extract_skills_from_text(text)
    skill_names = [s["name"] for s in skills]

    assert "Python" in skill_names
    assert "FastAPI" in skill_names
    assert "PyTorch" in skill_names
    assert "PostgreSQL" in skill_names
    assert "Docker" in skill_names

    # Check evidence snippet attached
    docker_skill = next(s for s in skills if s["name"] == "Docker")
    assert len(docker_skill["evidence"]) > 0
    assert any("Docker" in ev or "docker" in ev.lower() for ev in docker_skill["evidence"])

# 3. Test Text Cleaner & Section Identification
def test_cleaner_and_section_detection():
    sample_resume = """
    Jane Doe
    jane.doe@example.com | (555) 123-4567 | github.com/janedoe

    PROFESSIONAL SUMMARY
    Dedicated Data Scientist with 4 years of experience.

    TECHNICAL SKILLS
    Python, SQL, PyTorch, Scikit-learn, Tableau

    EXPERIENCE
    Data Scientist at Tech Corp
    2020 - 2024
    • Built predictive models using Scikit-learn.

    EDUCATION
    Master of Science in Data Science, Stanford University
    """
    cleaned = clean_text(sample_resume)
    sections = detect_sections(cleaned)
    contact = extract_contact_info(cleaned)
    edu = extract_education_level(cleaned)

    assert "summary" in sections
    assert "skills" in sections
    assert "experience" in sections
    assert "education" in sections
    assert contact["email"] == "jane.doe@example.com"
    assert "janedoe" in contact["github"]
    assert "Master" in edu

# 4. Test Job Description Intelligence & Matching
def test_job_description_intelligence_and_matching():
    jd = """
    Role: AI Engineer
    Required Skills:
    • Must have strong experience in Python and PyTorch.
    • Proven background in Natural Language Processing (NLP) and Large Language Models (LLMs).
    • Minimum 3+ years experience with Docker and Kubernetes.

    Preferred Skills:
    • Nice to have familiarity with PostgreSQL, Redis, and LangChain.
    """
    jd_analysis = analyze_job_description(jd, "AI Engineer")
    req_names = [s["name"] for s in jd_analysis["required_skills"]]

    assert "Python" in req_names
    assert "PyTorch" in req_names

    # Resume with some matching, partial, and missing
    resume_text = "Proficient in Python, TensorFlow, and Docker. Experience with SQL."
    resume_skills = extract_skills_from_text(resume_text)

    comparison = compare_skills(resume_skills, jd_analysis, resume_text, jd)

    matched_names = [s["skill"] for s in comparison["matched_skills"]]
    missing_names = [s["skill"] for s in comparison["missing_skills"]]
    partial_names = [s["skill"] for s in comparison["partially_matched_skills"]]

    # Python & Docker are exact matches
    assert "Python" in matched_names
    assert "Docker" in matched_names

    # PyTorch is partially satisfied via TensorFlow
    assert "PyTorch" in partial_names

    # Kubernetes is either partially satisfied via Docker or missing, and LLMs is missing
    assert "Large Language Models (LLMs)" in missing_names
    assert ("Kubernetes" in missing_names or "Kubernetes" in partial_names)

# 5. Test Scoring Formula and Explainability
def test_scoring_formula():
    comparison_data = {
        "matched_skills": [{"skill": "Python", "tier": "required"}, {"skill": "Docker", "tier": "required"}],
        "partially_matched_skills": [{"skill": "PyTorch", "tier": "required", "match_confidence": 0.85}],
        "missing_skills": [{"skill": "Kubernetes", "tier": "required"}],
        "total_required_jd_skills": 4,
        "total_preferred_jd_skills": 2,
        "semantic_similarity": 45.0,
        "additional_skills": []
    }
    resume_meta = {"sections": {"projects": "Built 2 projects", "certifications": "AWS"}, "experience_years": 4.0}
    jd_analysis = {"min_experience_years": 3.0}

    score_result = calculate_compatibility_score(comparison_data, resume_meta, jd_analysis)
    
    assert 0 <= score_result["overall_score"] <= 100
    assert "score_tier" in score_result
    assert "breakdown" in score_result
    assert len(score_result["strengths"]) > 0
    assert len(score_result["improvement_priorities"]) > 0

# 6. Test Personalized Roadmap Generation
def test_roadmap_generation():
    comparison_data = {
        "missing_skills": [{"skill": "Kubernetes", "tier": "required", "category": "Cloud & DevOps"}],
        "partially_matched_skills": [{"skill": "PyTorch", "tier": "required", "category": "Deep Learning", "related_skill_found": "TensorFlow"}],
        "matched_skills": [{"skill": "Python"}]
    }
    roadmap = generate_personalized_roadmap(comparison_data, "ML Engineer", "Senior")
    
    assert len(roadmap["essential_skills"]) >= 1
    assert len(roadmap["timeline"]) == 4  # 4-week timeline
    assert roadmap["timeline"][0]["week"] == "Week 1"
    assert roadmap["timeline"][3]["week"] == "Week 4"

# 7. Test PDF Extractor with Empty/Invalid Bytes
def test_pdf_extractor_edge_cases():
    # Empty bytes should return graceful warning, not crash
    result = extract_text_from_pdf_bytes(b"", "empty.pdf")
    assert result["text"] == ""
    assert result["char_count"] == 0

# 8. Test API Endpoints & Error Handling
def test_api_endpoints():
    # Root check
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["status"] == "online"

    # Health check
    res = client.get("/health")
    assert res.status_code == 200

    # Sample data check
    res = client.get("/api/sample-data")
    assert res.status_code == 200
    assert len(res.json()) >= 2

    # Extract skills endpoint
    res = client.post("/api/extract-skills", json={"text": "Proficient in React, Next.js, and TypeScript."})
    assert res.status_code == 200
    skills = [s["name"] for s in res.json()["skills"]]
    assert "React" in skills
    assert "TypeScript" in skills

    # Error handling: Empty job description
    res = client.post("/api/analyze-resume", data={
        "resume_text": "Experienced Python developer",
        "job_description": "Short",
        "target_role": "Backend Engineer"
    })
    assert res.status_code == 400
    assert "too short" in res.json()["detail"].lower()
