import json
import re
from .gemini_service import call_gemini

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

    import re
    try:
        text_response = _call_gemini(prompt)
        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found in response")
    except Exception:
        return {
            "humanized_text": text,
            "confidence_score": 0,
            "improvements": ["Service temporarily unavailable. Please try again."]
        }
