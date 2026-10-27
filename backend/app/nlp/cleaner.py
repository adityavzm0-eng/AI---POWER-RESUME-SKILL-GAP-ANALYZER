"""
Text cleaning, section identification, and resume metadata extraction.
"""
import re
from typing import Dict, Any, List, Optional, Tuple

SECTION_HEADERS = {
    "summary": [
        "summary", "professional summary", "career objective", "objective",
        "profile", "about me", "executive profile", "personal statement"
    ],
    "skills": [
        "skills", "technical skills", "core competencies", "key skills",
        "technologies", "tools & technologies", "skills & expertise",
        "programming skills", "technical proficiencies", "technical expertise"
    ],
    "experience": [
        "experience", "work experience", "professional experience", "employment history",
        "work history", "career history", "internships", "relevant experience"
    ],
    "education": [
        "education", "academic background", "academic qualifications",
        "educational qualifications", "academics", "degrees"
    ],
    "projects": [
        "projects", "academic projects", "personal projects", "key projects",
        "portfolio", "technical projects", "open source contributions"
    ],
    "certifications": [
        "certifications", "licenses", "certificates", "credentials",
        "professional certifications", "online courses"
    ],
    "awards": [
        "awards", "honors", "achievements", "publications", "patents"
    ]
}

DEGREE_PATTERNS = [
    (r"\b(ph\.?d|doctor of philosophy|doctorate)\b", "Doctorate / Ph.D."),
    (r"\b(master of science|m\.?s\.?|m\.?tech|master's|mba|m\.?eng)\b", "Master's Degree"),
    (r"\b(bachelor of science|b\.?s\.?|b\.?tech|bachelor's|b\.?e\.?|b\.?a\.?)\b", "Bachelor's Degree"),
    (r"\b(associate degree|associate's|diploma)\b", "Associate / Diploma")
]

def split_into_sentences(text: str) -> List[str]:
    """Splits text into readable sentences / bullet points."""
    lines = text.splitlines()
    sentences: List[str] = []
    for line in lines:
        line = line.strip()
        if not line:
            continue
        parts = re.split(r"[•*;\t|]|\.\s+", line)
        for part in parts:
            part = part.strip()
            if len(part) >= 3:
                sentences.append(part)
    return sentences

def clean_text(text: str) -> str:
    """Standardizes whitespace, normalizes bullet points and quotes."""
    if not text:
        return ""
    # Standardize bullet characters
    cleaned = re.sub(r"[\u2022\u2023\u25E6\u2043\u2219\u25AA\u25CF]", "\n* ", text)
    # Standardize quotation marks & dashes
    cleaned = re.sub(r"[\u2018\u2019]", "'", cleaned)
    cleaned = re.sub(r"[\u201C\u201D]", '"', cleaned)
    cleaned = re.sub(r"[\u2013\u2014]", "-", cleaned)
    # Collapse 3+ newlines into 2
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    # Strip trailing whitespace on each line
    lines = [line.strip() for line in cleaned.splitlines()]
    return "\n".join(lines).strip()

def extract_contact_info(text: str) -> Dict[str, Any]:
    """Extracts email, phone, and professional links from resume text."""
    email_match = re.search(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", text)
    phone_match = re.search(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}\b", text)
    linkedin_match = re.search(r"(linkedin\.com/in/[a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    github_match = re.search(r"(github\.com/[a-zA-Z0-9_-]+)", text, re.IGNORECASE)
    portfolio_match = re.search(r"(https?://(?:www\.)?[a-zA-Z0-9-]+\.(?:io|me|dev|com|org)/?[a-zA-Z0-9/_-]*)", text, re.IGNORECASE)

    return {
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin": linkedin_match.group(0) if linkedin_match else None,
        "github": github_match.group(0) if github_match else None,
        "portfolio": portfolio_match.group(0) if portfolio_match else None
    }

def detect_sections(text: str) -> Dict[str, str]:
    """
    Identifies resume sections and separates their text content.
    Returns a dict mapping section_name -> section_text.
    """
    lines = text.splitlines()
    detected_sections: Dict[str, List[str]] = {}
    current_section = "header"
    detected_sections[current_section] = []

    for line in lines:
        stripped = line.strip().lower()
        # Clean line from punctuation for heading check
        clean_heading = re.sub(r"[:\-_#=*]", "", stripped).strip()

        matched_section = None
        if len(clean_heading) < 40:
            for sec, variants in SECTION_HEADERS.items():
                if clean_heading in variants or any(clean_heading.startswith(v) and len(clean_heading) <= len(v) + 4 for v in variants):
                    matched_section = sec
                    break

        if matched_section:
            current_section = matched_section
            if current_section not in detected_sections:
                detected_sections[current_section] = []
        else:
            detected_sections[current_section].append(line)

    return {sec: "\n".join(content).strip() for sec, content in detected_sections.items() if content}

def extract_education_level(text: str) -> Optional[str]:
    """Detects highest indicated education level."""
    for pattern, label in DEGREE_PATTERNS:
        if re.search(pattern, text, re.IGNORECASE):
            return label
    return "Not explicitly specified"

def estimate_experience_years(text: str) -> float:
    """
    Heuristic estimation of total years of experience from year ranges like '2019 - 2023' or '2021 - Present'.
    """
    current_year = 2026
    year_ranges = re.findall(r"\b(20[0-2][0-9]|199[0-9])\s*(?:-|–|to)\s*(20[0-2][0-9]|present|current|now)\b", text, re.IGNORECASE)
    
    total_months = 0
    spans: List[Tuple[int, int]] = []
    
    for start_str, end_str in year_ranges:
        try:
            start_yr = int(start_str)
            if end_str.lower() in ["present", "current", "now"]:
                end_yr = current_year
            else:
                end_yr = int(end_str)
            if 1990 <= start_yr <= current_year and start_yr <= end_yr <= current_year + 1:
                spans.append((start_yr, end_yr))
        except ValueError:
            continue
            
    # Simple overlap merging
    if spans:
        spans.sort()
        merged = []
        cur_start, cur_end = spans[0]
        for s, e in spans[1:]:
            if s <= cur_end:
                cur_end = max(cur_end, e)
            else:
                merged.append((cur_start, cur_end))
                cur_start, cur_end = s, e
        merged.append((cur_start, cur_end))
        years = sum(e - s for s, e in merged)
        return min(max(float(years), 0.5), 35.0)

    # Secondary check: "X+ years of experience"
    exp_phrase = re.search(r"(\d+(?:\.\d+)?)\+?\s*years?(?:\s*of)?\s*(?:relevant|professional|software|industry)?\s*experience", text, re.IGNORECASE)
    if exp_phrase:
        try:
            return float(exp_phrase.group(1))
        except ValueError:
            pass

    return 2.0  # default reasonable fallback
