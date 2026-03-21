import json
import re
import logging
from .gemini_service import call_gemini

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
        # Handle the case where call_gemini returns an error string
        if "Nexus Error" in text_response or "Spectrum Error" in text_response:
             raise ValueError(text_response)

        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            data['plagiarism_score'] = data.get('score', 0)
            data['analysis_text'] = data.get('explanation', '')
            data['suggestions'] = ["Verify external citations.", "Rewrite high-risk spectrum nodes."]
            return data
        else:
            raise ValueError("Neural record not found in spectrum.")
    except Exception as e:
        logger.error(f"Plagiarism Scan Failure: {str(e)}")
        return {
            "score": 0,
            "plagiarism_score": 0,
            "verdict": "Interrupt",
            "analysis_text": f"Spectral Audit Status: {str(e)[:100]}",
            "explanation": f"The neural engine reported an interrupt: {str(e)[:50]}",
            "suspicious_segments": [],
            "suggestions": ["Verify API connectivity.", "Reduce prompt complexity."]
        }
