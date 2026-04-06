import json
import re
import logging
from .gemini_service import call_gemini
from utils.response_formatter import format_ai_response

logger = logging.getLogger(__name__)

def _call_gemini(prompt):
    return call_gemini(prompt)

def check_plagiarism(text):
    """
    VeriMind v5.2 | High-Fidelity Plagiarism Scanner
    """
    prompt = f"Act as the VeriMind Semantic Plagiarism Scanner. Analyze the following text and output STRICTLY a JSON object with keys: score (0-100), verdict (Low/Medium/High), suspicious_segments (list), and explanation (detailed paragraph).\n\nText: {text}"

    try:
        text_response = _call_gemini(prompt)
        
        # Check for error strings from gemini_service
        if "Spectrum Error" in text_response or "Nexus Error" in text_response:
             return format_ai_response({"explanation": text_response}, fallback_text="Neural record not found in spectrum.")

        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            return format_ai_response(data)
        else:
            return format_ai_response({"explanation": text_response})
            
    except Exception as e:
        logger.error(f"Plagiarism Scan Failure: {str(e)}")
        return format_ai_response({}, fallback_text=f"The neural engine reported an interrupt: {str(e)[:50]}")
