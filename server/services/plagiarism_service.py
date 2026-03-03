import json
import re
from .gemini_service import call_gemini

def _call_gemini(prompt):
    return call_gemini(prompt)


def check_plagiarism(text):
    """
    VeriMind v4.6 | Semantic & AI Plagiarism Scanner
    Detects paraphrasing, structural theft, and probabilistic AI patterns.
    """
    prompt_template = """
    Act as the VeriMind Semantic Plagiarism Scanner.
    Analyze the provided content for semantic similarity, non-original structural patterns, and AI-generated linguistic markers.

    STRICT ANALYSIS RULES:
    1. Look for 'mosaic plagiarism' (mixed borrowed and original content).
    2. Detect 'synonym-swapping' (paraphrased content that retains semantic structure).
    3. Identify sentences with extremely high probabilistic similarity to known corpus or AI models.

    TEXT TO ANALYZE:
    \"\"\"{{TEXT_PLACEHOLDER}}\"\"\"

    Output the result STRICTLY as a JSON object:
    - score: (0-100)
    - verdict: "Low", "Medium", or "High"
    - suspicious_segments: [
        {
          "sentence": "string",
          "reason": "Short explanation of overlap",
          "risk": "High"
        }
      ]
    - explanation: "A clean, professional, and direct paragraph summarizing the scan results. Do not use headers, section blocks, or bullet points. Start directly with the results in a natural, human tone."
    """
    
    prompt = prompt_template.replace("{{TEXT_PLACEHOLDER}}", text)

    try:
        text_response = _call_gemini(prompt)
        
        # FIND JSON: Look for the first { and last }
        start_index = text_response.find('{')
        end_index = text_response.rfind('}')
        
        if start_index != -1 and end_index != -1:
            clean_text = text_response[start_index:end_index+1]
            return json.loads(clean_text)
        else:
            raise ValueError("The AI did not provide a valid audit record.")
            
    except Exception:
        return {
            "score": 0,
            "verdict": "Error",
            "suspicious_segments": [],
            "explanation": "Service temporarily unavailable. Please try again."
        }
