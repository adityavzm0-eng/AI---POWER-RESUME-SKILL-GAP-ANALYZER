"""
AI Skill Matching Engine: compares resume skills with job description requirements,
computes TF-IDF cosine semantic similarity, and evaluates transferable skill relationships.
"""
from typing import Dict, List, Any, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.app.nlp.skills_db import TRANSFERABLE_SKILLS, resolve_skill

def compute_tfidf_similarity(resume_text: str, jd_text: str) -> float:
    """
    Computes semantic similarity score (0.0 to 1.0) using Scikit-Learn TF-IDF and Cosine Similarity.
    """
    if not resume_text or not jd_text:
        return 0.0
    try:
        vectorizer = TfidfVectorizer(
            stop_words="english",
            ngram_range=(1, 2),
            max_features=5000,
            sublinear_tf=True
        )
        tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
        sim = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        return float(max(0.0, min(1.0, sim)))
    except Exception:
        return 0.0

def compare_skills(
    resume_skills: List[Dict[str, Any]],
    jd_analysis: Dict[str, Any],
    resume_text: str = "",
    jd_text: str = ""
) -> Dict[str, Any]:
    """
    Compares resume skills against the job requirements.
    Categorizes into:
    - matched_skills
    - missing_skills
    - partially_matched_skills
    - additional_skills
    """
    # Build lookup of resume skills by canonical name
    resume_skill_map: Dict[str, Dict[str, Any]] = {
        s["name"]: s for s in resume_skills
    }
    resume_skill_names: Set[str] = set(resume_skill_map.keys())

    # Build required and preferred skill sets from JD
    required_jd_skills = jd_analysis.get("required_skills", [])
    preferred_jd_skills = jd_analysis.get("preferred_skills", [])
    all_jd_skills = required_jd_skills + preferred_jd_skills
    
    jd_skill_names: Set[str] = {s["name"] for s in all_jd_skills}
    required_names: Set[str] = {s["name"] for s in required_jd_skills}
    preferred_names: Set[str] = {s["name"] for s in preferred_jd_skills}

    matched_skills: List[Dict[str, Any]] = []
    missing_skills: List[Dict[str, Any]] = []
    partially_matched_skills: List[Dict[str, Any]] = []
    accounted_resume_skills: Set[str] = set()

    # 1. Exact and Canonical Matches
    for jd_item in all_jd_skills:
        name = jd_item["name"]
        cat = jd_item["category"]
        tier = "required" if name in required_names else "preferred"
        priority = "High" if tier == "required" else "Medium"

        if name in resume_skill_map:
            # Exact Match
            accounted_resume_skills.add(name)
            res_item = resume_skill_map[name]
            matched_skills.append({
                "skill": name,
                "category": cat,
                "status": "matched",
                "tier": tier,
                "priority": priority,
                "resume_evidence": res_item["evidence"] if res_item["evidence"] else ["Mentioned in resume profile"],
                "jd_evidence": jd_item.get("evidence", []),
                "match_confidence": 1.0,
                "transferable_note": None
            })
        else:
            # 2. Check for transferable / partially matched skill in resume
            transfer_match = None
            if name in TRANSFERABLE_SKILLS:
                for candidate_skill, score in TRANSFERABLE_SKILLS[name].items():
                    if candidate_skill in resume_skill_map:
                        transfer_match = (candidate_skill, score)
                        break

            if transfer_match:
                candidate_skill, score = transfer_match
                accounted_resume_skills.add(candidate_skill)
                res_item = resume_skill_map[candidate_skill]
                partially_matched_skills.append({
                    "skill": name,
                    "category": cat,
                    "status": "partially_matched",
                    "tier": tier,
                    "priority": "Medium" if tier == "required" else "Low",
                    "resume_evidence": res_item["evidence"],
                    "related_skill_found": candidate_skill,
                    "transferable_note": f"Candidate demonstrates proficiency in '{candidate_skill}', providing strong transferable foundation for '{name}'.",
                    "match_confidence": score
                })
            else:
                # 3. Missing Skill
                missing_skills.append({
                    "skill": name,
                    "category": cat,
                    "status": "missing",
                    "tier": tier,
                    "priority": "High" if tier == "required" else "Medium",
                    "resume_evidence": [],
                    "jd_evidence": jd_item.get("evidence", []),
                    "match_confidence": 0.0,
                    "why_it_matters": f"Key {tier} competency for {jd_analysis.get('role_title', 'the role')}"
                })

    # 4. Additional Skills (In Resume but not explicitly demanded in JD)
    additional_skills: List[Dict[str, Any]] = []
    for s_name, s_data in resume_skill_map.items():
        if s_name not in jd_skill_names and s_name not in accounted_resume_skills:
            additional_skills.append({
                "skill": s_name,
                "category": s_data["category"],
                "status": "additional",
                "resume_evidence": s_data["evidence"][:2] if s_data["evidence"] else ["Found in resume skills"],
                "value_add": f"Supplementary strength in {s_data['category']}"
            })

    # Compute TF-IDF Semantic Similarity
    semantic_sim = compute_tfidf_similarity(resume_text, jd_text)

    # Build Matrix for Skill Gap Matrix Table
    # Rows: skill, job_requirement, resume_evidence, status, priority
    skill_gap_matrix: List[Dict[str, Any]] = []
    for item in matched_skills:
        skill_gap_matrix.append({
            "skill": item["skill"],
            "category": item["category"],
            "job_requirement": "Must-Have" if item["tier"] == "required" else "Preferred",
            "resume_evidence": item["resume_evidence"][0] if item["resume_evidence"] else "Demonstrated in resume",
            "status": "Matched",
            "priority": "Satisfied"
        })
    for item in partially_matched_skills:
        skill_gap_matrix.append({
            "skill": item["skill"],
            "category": item["category"],
            "job_requirement": "Must-Have" if item["tier"] == "required" else "Preferred",
            "resume_evidence": f"Transferable via {item['related_skill_found']}: {item['resume_evidence'][0] if item['resume_evidence'] else ''}",
            "status": "Partially Matched",
            "priority": "Medium"
        })
    for item in missing_skills:
        skill_gap_matrix.append({
            "skill": item["skill"],
            "category": item["category"],
            "job_requirement": "Must-Have" if item["tier"] == "required" else "Preferred",
            "resume_evidence": "No explicit evidence detected in resume",
            "status": "Missing",
            "priority": item["priority"]
        })

    # Sort matrix: Missing (High priority first), then Partial, then Matched
    priority_order = {"High": 0, "Medium": 1, "Low": 2, "Satisfied": 3}
    skill_gap_matrix.sort(key=lambda x: priority_order.get(x["priority"], 9))

    return {
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "partially_matched_skills": partially_matched_skills,
        "additional_skills": additional_skills,
        "skill_gap_matrix": skill_gap_matrix,
        "semantic_similarity": round(semantic_sim * 100, 1),
        "total_required_jd_skills": len(required_names),
        "total_preferred_jd_skills": len(preferred_names),
        "total_matched_count": len(matched_skills),
        "total_missing_count": len(missing_skills),
        "total_partial_count": len(partially_matched_skills),
        "total_additional_count": len(additional_skills)
    }
