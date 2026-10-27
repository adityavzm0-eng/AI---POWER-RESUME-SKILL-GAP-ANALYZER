"""
Advanced NLP and rule-based skill extraction engine with context snippet detection.
"""
import re
from typing import Dict, List, Any, Set, Tuple
from backend.app.nlp.skills_db import SKILL_TAXONOMY, CANONICAL_LOOKUP, resolve_skill
from backend.app.nlp.cleaner import split_into_sentences

def extract_skills_from_text(text: str, sections_dict: Dict[str, str] = None) -> List[Dict[str, Any]]:
    """
    Extracts all recognized skills from the given text with evidence snippets.
    Returns:
        List of {
            "name": canonical_name,
            "category": category,
            "raw_term": term,
            "count": int,
            "evidence": List[str],  # snippet lines containing the skill
            "sections": List[str]   # sections where it was detected
        }
    """
    if not text:
        return []

    sentences = split_into_sentences(text)
    lower_text = text.lower()
    
    # Store findings: canonical_name -> {category, raw_terms: set, count, evidence: set, sections: set}
    found_skills: Dict[str, Dict[str, Any]] = {}

    # Sort all known terms by length descending to match multi-word phrases first
    # e.g., "natural language processing" before "processing" or "nlp"
    sorted_terms = sorted(CANONICAL_LOOKUP.keys(), key=lambda t: len(t), reverse=True)

    for term in sorted_terms:
        # Match using word boundaries. For terms with special characters like c++, c#, .net, escape properly
        escaped_term = re.escape(term)
        
        # Word boundary handling:
        # If term starts/ends with alphanumeric, enforce \b; otherwise loose match
        prefix_boundary = r"\b" if term[0].isalnum() else r"(?:^|\s)"
        suffix_boundary = r"\b" if term[-1].isalnum() else r"(?:$|\s|[,.;:\)])"
        pattern = re.compile(rf"{prefix_boundary}{escaped_term}{suffix_boundary}", re.IGNORECASE)

        matches = list(pattern.finditer(text))
        if matches:
            canonical_name, category = CANONICAL_LOOKUP[term]
            
            if canonical_name not in found_skills:
                found_skills[canonical_name] = {
                    "name": canonical_name,
                    "category": category,
                    "raw_terms": set(),
                    "count": 0,
                    "evidence": set(),
                    "sections": set()
                }

            found_skills[canonical_name]["raw_terms"].add(term)
            found_skills[canonical_name]["count"] += len(matches)

            # Find snippet evidence
            for sentence in sentences:
                if pattern.search(sentence):
                    if len(sentence) <= 220:
                        found_skills[canonical_name]["evidence"].add(sentence)
                    else:
                        # Extract excerpt around match
                        m = pattern.search(sentence)
                        if m:
                            start = max(0, m.start() - 60)
                            end = min(len(sentence), m.end() + 60)
                            found_skills[canonical_name]["evidence"].add(f"...{sentence[start:end]}...")
                    if len(found_skills[canonical_name]["evidence"]) >= 3:
                        break

            # Section identification
            if sections_dict:
                for sec_name, sec_text in sections_dict.items():
                    if pattern.search(sec_text):
                        found_skills[canonical_name]["sections"].add(sec_name)

    # Format return list
    results = []
    for skill_info in found_skills.values():
        results.append({
            "name": skill_info["name"],
            "category": skill_info["category"],
            "raw_terms": sorted(list(skill_info["raw_terms"])),
            "count": skill_info["count"],
            "evidence": list(skill_info["evidence"])[:3],
            "sections": sorted(list(skill_info["sections"])) if skill_info["sections"] else ["general"]
        })

    # Sort by count and category
    results.sort(key=lambda s: (s["category"], -s["count"], s["name"]))
    return results
