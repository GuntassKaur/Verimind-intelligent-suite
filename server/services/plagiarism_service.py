import json
import re
import logging
from .gemini_service import call_gemini

logger = logging.getLogger(__name__)

def _call_gemini(prompt):
    return call_gemini(prompt)

def check_plagiarism(text):
    """
    VeriMind v4.6 | Semantic & AI Plagiarism Scanner
    Detects paraphrasing, structural theft, and probabilistic AI patterns.
    """
    prompt = f"Act as the VeriMind Semantic Plagiarism Scanner. Analyze the following text and output STRICTLY a JSON object with keys: score (0-100), verdict (Low/Medium/High), suspicious_segments (list), and explanation (detailed paragraph).\n\nText: {text}"

    try:
        text_response = _call_gemini(prompt)
        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            # Essential mapping for standardized AI logic
            data['plagiarism_score'] = data.get('score', 0)
            data['analysis_text'] = data.get('explanation', '')
            data['suggestions'] = ["Cite external sources.", "Rewrite flagged segments."]
            return data
        else:
            raise ValueError("No JSON record found.")
    except Exception as e:
        logger.error(f"Plagiarism Service Audit Failed: {str(e)}")
        return {
            "score": 0,
            "plagiarism_score": 0,
            "verdict": "Error",
            "analysis_text": "Unable to generate full report, showing partial analysis.",
            "explanation": "Service temporarily unavailable.",
            "suspicious_segments": [],
            "suggestions": ["Verify your input.", "Sync with backend."]
        }

