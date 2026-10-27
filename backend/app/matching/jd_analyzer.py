"""
Job Description Intelligence: parses job descriptions, determines requirement tiers,
extracts experience & education expectations, and categorizes requirements.
"""
import re
from typing import Dict, Any, List, Set
from backend.app.nlp.skills_db import CANONICAL_LOOKUP, resolve_skill
from backend.app.nlp.cleaner import extract_education_level, split_into_sentences
from backend.app.nlp.skill_extractor import extract_skills_from_text

# Keywords indicating required vs preferred skills
MUST_HAVE_KEYWORDS = [
    "required", "must have", "must possess", "minimum", "essential",
    "core requirement", "mandatory", "need to have", "proficient in",
    "strong experience with", "deep understanding", "proven track record",
    "expertise in", "fluency in"
]

PREFERRED_KEYWORDS = [
    "preferred", "nice to have", "plus", "bonus", "good to have",
    "desired", "advantageous", "beneficial", "optional", "familiarity with",
    "exposure to", "helpful", "would be a plus"
]

def analyze_job_description(jd_text: str, role_title: str = "") -> Dict[str, Any]:
    """
    Parses a job description to extract structured requirements.
    """
    if not jd_text:
        return {
            "role_title": role_title or "Target Role",
            "required_skills": [],
            "preferred_skills": [],
            "all_extracted_skills": [],
            "categorized_skills": {},
            "min_experience_years": 0.0,
            "education_requirement": "Not specified",
            "responsibilities": []
        }

    # Extract all candidate skills found in JD
    raw_skills = extract_skills_from_text(jd_text)

    # Experience requirement detection: e.g. "3+ years of experience", "5-7 years"
    min_exp = 0.0
    exp_matches = re.findall(r"(\d+)(?:\s*(?:-|to)\s*(\d+))?\+?\s*years?(?:\s*of)?\s*(?:relevant|hands-on|industry|software)?\s*experience", jd_text, re.IGNORECASE)
    if exp_matches:
        years_list = []
        for match in exp_matches:
            try:
                years_list.append(float(match[0]))
            except ValueError:
                pass
        if years_list:
            min_exp = max(years_list)

    # Education requirement
    edu_req = extract_education_level(jd_text) or "Bachelor's Degree or equivalent experience"

    # Break JD into sentences to classify required vs preferred
    sentences = split_into_sentences(jd_text)
    
    must_have_set: Set[str] = set()
    preferred_set: Set[str] = set()

    # Track sections like "Requirements:" or "Preferred Qualifications:"
    current_tier = "must_have"  # default assumption for technical jobs

    for sentence in sentences:
        s_lower = sentence.lower()
        
        # Check if heading changes context
        if any(kw in s_lower for kw in ["preferred qualification", "nice to have", "bonus points", "bonus qualifications"]):
            current_tier = "preferred"
        elif any(kw in s_lower for kw in ["required qualification", "minimum qualification", "basic qualification", "what you need", "requirements"]):
            current_tier = "must_have"

        for skill in raw_skills:
            name = skill["name"]
            # Check if this skill appears in this sentence
            if any(term in s_lower for term in skill["raw_terms"]):
                # Evaluate sentence context
                is_preferred = any(kw in s_lower for kw in PREFERRED_KEYWORDS) or current_tier == "preferred"
                is_required = any(kw in s_lower for kw in MUST_HAVE_KEYWORDS) or current_tier == "must_have"

                if is_preferred and not is_required:
                    preferred_set.add(name)
                else:
                    must_have_set.add(name)

    # In case a skill was marked as both, let required take precedence
    for s in must_have_set:
        preferred_set.discard(s)

    # Build final structured lists
    required_skills: List[Dict[str, Any]] = []
    preferred_skills: List[Dict[str, Any]] = []
    
    categorized: Dict[str, List[str]] = {
        "Must-Have Skills": [],
        "Preferred Skills": [],
        "Technical Tools & Frameworks": [],
        "Domain & Data Knowledge": [],
        "Soft Skills & Leadership": []
    }

    for skill in raw_skills:
        name = skill["name"]
        cat = skill["category"]
        is_req = name in must_have_set or (name not in preferred_set)
        
        item = {
            "name": name,
            "category": cat,
            "tier": "required" if is_req else "preferred",
            "count": skill["count"],
            "evidence": skill["evidence"]
        }

        if is_req:
            required_skills.append(item)
            categorized["Must-Have Skills"].append(name)
        else:
            preferred_skills.append(item)
            categorized["Preferred Skills"].append(name)

        # Also add to thematic buckets
        if cat in ["Frameworks & Web Development", "Cloud & DevOps", "Databases & Data Engineering"]:
            categorized["Technical Tools & Frameworks"].append(name)
        elif cat in ["AI, Machine Learning & Data Science", "Deep Learning & Computer Vision", "NLP & Large Language Models", "Data Visualization & BI"]:
            categorized["Domain & Data Knowledge"].append(name)
        elif cat in ["Soft Skills & Leadership", "Software Engineering & Methodologies"]:
            categorized["Soft Skills & Leadership"].append(name)

    # Extract key responsibility bullet points
    responsibilities = []
    for s in sentences:
        s_lower = s.lower()
        if any(s_lower.startswith(verb) for verb in ["develop", "design", "build", "collaborate", "lead", "architect", "create", "implement", "deploy", "manage", "optimize", "work with"]):
            if len(s) >= 20 and len(s) <= 220:
                responsibilities.append(s)
            if len(responsibilities) >= 6:
                break

    return {
        "role_title": role_title or "Target Position",
        "required_skills": required_skills,
        "preferred_skills": preferred_skills,
        "all_extracted_skills": raw_skills,
        "categorized_skills": categorized,
        "min_experience_years": min_exp,
        "education_requirement": edu_req,
        "responsibilities": responsibilities
    }
