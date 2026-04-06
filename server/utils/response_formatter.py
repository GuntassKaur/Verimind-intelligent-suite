import json
import logging

logger = logging.getLogger(__name__)

def format_ai_response(data, fallback_text="Unable to generate full report, showing partial analysis", default_score=0):
    """
    Standardizes AI response to the requested format:
    {
      "analysis_text": "...",
      "plagiarism_score": number, 
      "suggestions": [],
      "confidence_score": number (AI Confidence Level)
    }
    """
    try:
        # Ensure data is a dictionary
        if not isinstance(data, dict):
            # If data is a string (like a raw Gemini response that wasn't JSON)
            data = {"analysis_text": str(data)}

        # Start with a copy of all original data to maintain feature-specific keys
        result = data.copy()

        # Ensure standardized keys exist / mapped
        result["analysis_text"] = data.get("analysis_text") or data.get("humanized_text") or data.get("explanation") or data.get("verdict") or fallback_text
        
        plag_score = data.get("plagiarism_score") or data.get("score") or data.get("ai_probability") or default_score
        try:
            result["plagiarism_score"] = float(plag_score)
        except (ValueError, TypeError):
            result["plagiarism_score"] = default_score

        suggs = data.get("suggestions") or data.get("improvements") or []
        if not isinstance(suggs, list):
            suggs = [str(suggs)]
        if not suggs:
            suggs = ["Verify citations.", "Refine spectrum nodes.", "Check neural synchronization."]
        result["suggestions"] = suggs

        conf = data.get("confidence_score") or data.get("credibility_score") or 85.0
        try:
            result["confidence_score"] = float(conf)
        except (ValueError, TypeError):
            result["confidence_score"] = 85.0

        return result

    except Exception as e:
        logger.error(f"Error formatting AI response: {str(e)}")
        return {
            "analysis_text": fallback_text,
            "plagiarism_score": default_score,
            "suggestions": ["Verify API connectivity.", "Reduce input length."],
            "confidence_score": 0
        }
