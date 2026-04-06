import json
import re
import logging
from .gemini_service import call_gemini
from utils.response_formatter import format_ai_response

logger = logging.getLogger(__name__)

def _call_gemini(prompt):
    return call_gemini(prompt)


def humanize_text(text, tone="Professional"):
    """
    VeriMind v4.6 | Humanization & Engagement Service
    Rewrites text to sound more human and less robotic.
    """
    prompt = f"""
    Act as a professional writer. Rewrite the following text to make it sound 100% human, natural, and engaging. 
    Avoid robotic patterns, overly complex jargon, or repetitive sentence structures.
    
    TONE: {tone}
    
    TEXT TO HUMANIZE:
    \"\"\"{text}\"\"\"
    
    Provide the humanized version and an estimated 'Human Likeness' confidence score (0-100).
    
    Output the result STRICTLY as a JSON object with these keys:
    - humanized_text (the rewritten version)
    - confidence_score (number)
    - improvements (list of what was changed, e.g., "Varying sentence length")
    """

    try:
        text_response = _call_gemini(prompt)
        
        # Check for error strings
        if "Spectrum Error" in text_response or "Nexus Error" in text_response:
             return format_ai_response({"humanized_text": text_response}, fallback_text="Neural synchronization failure.")

        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            return format_ai_response(data)
        else:
            return format_ai_response({"humanized_text": text_response})
            
    except Exception as e:
        logger.error(f"Humanization Failure: {str(e)}")
        return format_ai_response({}, fallback_text=f"Neural sync failed: {str(e)[:50]}")
