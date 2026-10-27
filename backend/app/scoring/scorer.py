"""
Explainable Job Compatibility Scorer: calculates a weighted 0-100 score,
breakdown metrics, strengths, and improvement recommendations.
"""
from typing import Dict, Any, List

DEFAULT_WEIGHTS = {
    "required_skills": 0.40,
    "preferred_skills": 0.15,
    "semantic_similarity": 0.20,
    "project_evidence": 0.15,
    "experience_alignment": 0.10
}

def calculate_compatibility_score(
    comparison_results: Dict[str, Any],
    resume_metadata: Dict[str, Any],
    jd_analysis: Dict[str, Any],
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    """
    Computes explainable compatibility score with granular sub-scores.
    """
    weights = DEFAULT_WEIGHTS.copy()
    if custom_weights:
        weights.update(custom_weights)

    # Normalize weights to sum to 1.0
    total_w = sum(weights.values())
    if total_w > 0:
        weights = {k: v / total_w for k, v in weights.items()}

    # 1. Required Skill Coverage
    req_total = comparison_results.get("total_required_jd_skills", 0)
    matched_req = sum(1 for s in comparison_results.get("matched_skills", []) if s.get("tier") == "required")
    partial_req = sum(s.get("match_confidence", 0.5) for s in comparison_results.get("partially_matched_skills", []) if s.get("tier") == "required")
    
    if req_total > 0:
        req_score = min(100.0, ((matched_req + (partial_req * 0.7)) / req_total) * 100.0)
    else:
        req_score = 90.0 if comparison_results.get("matched_skills") else 70.0

    # 2. Preferred Skill Coverage
    pref_total = comparison_results.get("total_preferred_jd_skills", 0)
    matched_pref = sum(1 for s in comparison_results.get("matched_skills", []) if s.get("tier") == "preferred")
    partial_pref = sum(s.get("match_confidence", 0.5) for s in comparison_results.get("partially_matched_skills", []) if s.get("tier") == "preferred")
    
    if pref_total > 0:
        pref_score = min(100.0, ((matched_pref + (partial_pref * 0.7)) / pref_total) * 100.0)
    else:
        pref_score = 80.0

    # 3. Semantic Similarity (Scikit-Learn TF-IDF Cosine Similarity)
    semantic_sim = comparison_results.get("semantic_similarity", 50.0)
    # Scale realistic TF-IDF scores: in natural language, a TF-IDF cosine score of 0.35 - 0.50 is already strong
    # We apply a gentle normalization curve: score = min(100, (sim / 0.45) * 100)
    semantic_score = min(100.0, max(15.0, (semantic_sim / 40.0) * 100.0 if semantic_sim > 0 else 30.0))

    # 4. Project Evidence Relevance
    sections = resume_metadata.get("sections", {})
    has_projects = "projects" in sections and len(sections["projects"]) > 50
    has_certifications = "certifications" in sections and len(sections["certifications"]) > 20
    
    project_score = 50.0
    if has_projects:
        project_score += 35.0
    if has_certifications:
        project_score += 15.0
    project_score = min(100.0, project_score)

    # 5. Experience Alignment
    candidate_years = resume_metadata.get("experience_years", 2.0)
    required_years = jd_analysis.get("min_experience_years", 2.0)
    if required_years > 0:
        ratio = candidate_years / required_years
        if ratio >= 1.0:
            exp_score = min(100.0, 90.0 + min(10.0, (ratio - 1.0) * 5.0))
        else:
            exp_score = max(35.0, ratio * 90.0)
    else:
        exp_score = 85.0

    # Weighted Overall Score
    raw_overall = (
        (req_score * weights["required_skills"]) +
        (pref_score * weights["preferred_skills"]) +
        (semantic_score * weights["semantic_similarity"]) +
        (project_score * weights["project_evidence"]) +
        (exp_score * weights["experience_alignment"])
    )
    overall_score = round(max(5.0, min(99.0, raw_overall)), 1)

    # Classification & Tier
    if overall_score >= 85:
        tier = "Exceptional Match"
        summary_verdict = "Strong direct alignment with core technical requirements, relevant domain evidence, and key competencies."
    elif overall_score >= 70:
        tier = "Strong Match"
        summary_verdict = "Solid alignment with the primary role requirements, with targeted skill areas that can be quickly bridged."
    elif overall_score >= 55:
        tier = "Moderate Match"
        summary_verdict = "Foundational background present with transferable skills, but key essential tools or depth are missing."
    else:
        tier = "Developing Match"
        summary_verdict = "Notable gaps in must-have technical qualifications; intensive targeted upskilling recommended."

    # Identify Key Strengths (evidence-based)
    strengths: List[str] = []
    matched = comparison_results.get("matched_skills", [])
    if matched:
        top_skills = [m["skill"] for m in matched[:4]]
        strengths.append(f"Demonstrated core proficiency in: {', '.join(top_skills)}.")
    if candidate_years >= required_years and required_years > 0:
        strengths.append(f"Meets or exceeds target experience expectation (~{candidate_years:.1f} yrs vs {required_years:.1f} yrs requested).")
    if comparison_results.get("additional_skills"):
        add_skills = [s["skill"] for s in comparison_results["additional_skills"][:3]]
        strengths.append(f"Brings valuable supplementary expertise in {', '.join(add_skills)}.")
    if has_projects:
        strengths.append("Dedicated project portfolio evidence supports practical hands-on application.")

    # Identify Key Improvement Priorities
    improvement_priorities: List[str] = []
    missing_required = [s["skill"] for s in comparison_results.get("missing_skills", []) if s.get("tier") == "required"]
    if missing_required:
        improvement_priorities.append(f"Bridge critical missing core skills: {', '.join(missing_required[:3])}.")
    if comparison_results.get("partially_matched_skills"):
        partials = [s["skill"] for s in comparison_results["partially_matched_skills"][:2]]
        improvement_priorities.append(f"Formalize practical projects around related skills: {', '.join(partials)}.")
    if not has_certifications:
        improvement_priorities.append("Add verified industry certifications or measurable capstone projects.")
    if not has_projects:
        improvement_priorities.append("Incorporate a dedicated 'Projects' section highlighting architecture and measurable metrics.")

    return {
        "overall_score": overall_score,
        "score_tier": tier,
        "verdict": summary_verdict,
        "disclaimer": "Estimated compatibility score based on keyword and semantic analysis. Does not predict or guarantee hiring outcomes.",
        "breakdown": {
            "required_skills_coverage": round(req_score, 1),
            "preferred_skills_coverage": round(pref_score, 1),
            "semantic_similarity": round(semantic_score, 1),
            "project_evidence": round(project_score, 1),
            "experience_alignment": round(exp_score, 1)
        },
        "weights_applied": {k: round(v, 2) for k, v in weights.items()},
        "strengths": strengths,
        "improvement_priorities": improvement_priorities
    }
