"""
Optional LLM Service: provides contextual explanations and recommendations
via Gemini / OpenAI when an API key is configured, with graceful offline heuristic fallbacks.
"""
import os
import json
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger("skillsync.llm")

def get_llm_status() -> Dict[str, Any]:
    """Returns current LLM integration status without leaking secret keys."""
    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")
    
    # Auto-detect provider if key starts with sk-
    default_provider = "openai" if (api_key and api_key.startswith("sk-")) else "gemini"
    provider = os.environ.get("LLM_PROVIDER", default_provider).lower()
    default_model = "gpt-4o-mini" if provider == "openai" else "gemini-1.5-flash"
    model = os.environ.get("LLM_MODEL", default_model)

    return {
        "enabled": bool(api_key and len(api_key) > 5),
        "provider": provider if api_key else "offline_rule_engine",
        "model": model if api_key else "NLP_Rule_Engine_v1",
        "has_key": bool(api_key and len(api_key) > 5)
    }

def call_openai_api(prompt: str, api_key: str, model_name: str = "gpt-4o-mini") -> Optional[str]:
    """Direct HTTPS REST call to OpenAI API."""
    import requests
    url = "https://api.openai.com/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    payload = {
        "model": model_name,
        "messages": [
            {"role": "system", "content": "You are a Senior Technical Recruiter and Career Coach providing concise, high-value candidate guidance."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 500
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=12)
        if response.status_code == 200:
            data = response.json()
            choices = data.get("choices", [])
            if choices:
                return choices[0].get("message", {}).get("content", "").strip()
        else:
            logger.warning(f"OpenAI API returned status {response.status_code}: {response.text[:200]}")
    except Exception as e:
        logger.warning(f"OpenAI API request failed: {e}")
    return None

def call_gemini_api(prompt: str, api_key: str, model_name: str = "gemini-1.5-flash") -> Optional[str]:
    """Direct HTTPS REST call to Google Gemini API."""
    import requests
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    payload = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.4, "maxOutputTokens": 1000}
    }
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=12)
        if response.status_code == 200:
            data = response.json()
            candidates = data.get("candidates", [])
            if candidates:
                parts = candidates[0].get("content", {}).get("parts", [])
                if parts:
                    return parts[0].get("text", "").strip()
        else:
            logger.warning(f"Gemini API returned status {response.status_code}: {response.text[:200]}")
    except Exception as e:
        logger.warning(f"Gemini API request failed: {e}")
    return None

def enhance_recommendations_with_llm(
    role_title: str,
    matched_skills: list,
    missing_skills: list,
    original_summary: str
) -> Dict[str, Any]:
    """
    Attempts to call LLM if configured; otherwise returns structured heuristic insights.
    """
    status = get_llm_status()
    api_key = os.environ.get("LLM_API_KEY") or os.environ.get("OPENAI_API_KEY") or os.environ.get("GEMINI_API_KEY")

    if status["enabled"] and api_key:
        missing_names = [s.get("skill", "") for s in missing_skills[:4]]
        matched_names = [s.get("skill", "") for s in matched_skills[:4]]
        
        prompt = (
            f"A candidate is applying for the position of: {role_title}. "
            f"Their verified skills: {', '.join(matched_names)}. "
            f"Their identified missing skills: {', '.join(missing_names)}. "
            f"Provide a concise 3-sentence executive strategic summary advising how they can position themselves "
            f"and bridge these gaps effectively."
        )

        llm_text = None
        if status["provider"] == "openai" or api_key.startswith("sk-"):
            llm_text = call_openai_api(prompt, api_key, status["model"])
        elif status["provider"] == "gemini":
            llm_text = call_gemini_api(prompt, api_key, status["model"])

        if llm_text:
            return {
                "ai_generated": True,
                "provider": status["provider"],
                "executive_advice": llm_text
            }

    # Deterministic offline heuristic advice
    missing_names = [s.get("skill", "") for s in missing_skills[:3]]
    matched_names = [s.get("skill", "") for s in matched_skills[:3]]
    
    advice = (
        f"Your background demonstrates valuable strength in {', '.join(matched_names) if matched_names else 'core technologies'}. "
        f"To maximize competitiveness for {role_title}, prioritize demonstrating hands-on project evidence in "
        f"{', '.join(missing_names) if missing_names else 'the required tools'}. "
        f"Focus your resume and interview narrative on measurable business outcomes rather than isolated tool checklists."
    )

    return {
        "ai_generated": False,
        "provider": "offline_nlp_engine",
        "executive_advice": advice
    }
