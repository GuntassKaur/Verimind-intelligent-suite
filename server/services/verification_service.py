import json
import re
import logging
from .gemini_service import call_gemini
from utils.response_formatter import format_ai_response

logger = logging.getLogger(__name__)

def _call_gemini(system_prompt, user_input):
    return call_gemini(user_input, system_instruction=system_prompt)

def verify_claims(text, context="General"):
    """
    VeriMind v5.0 | Truth Engine (Claim Verification)
    Extracts factual claims and evaluates them against global knowledge.
    """
    system_prompt = """
    You are the VeriMind Truth Engine, a senior AI auditor specializing in high-fidelity factual verification.
    
    TASK:
    1. Extract specific, verifiable claims from the provided text.
    2. Audit each claim for accuracy, vagueness, and supporting evidence.
    3. Identify "hallucinations" or unsupported overconfident language.
    4. Provide a structured risk assessment and actionable suggestions to improve the writing.
    5. Determine "Neural Origin" (AI Probability) based on linguistic patterns.

    STRICT GUIDELINES:
    - Neutrality: Do not take sides in political, religious, or sensitive debates.
    - Factuality: Only verify what can be established by global knowledge.
    - Risk Levels: 
        - Low: Well-supported, specific, and accurate.
        - Medium: Vague, missing context, or partially unsupported.
        - High: Factually incorrect, highly speculative, or potential hallucination.

    OUTPUT SCHEMA (JSON) - YOU MUST RETURN ONLY VALID JSON:
    {
      "credibility_score": number (0-100),
      "risk_level": "Low" | "Medium" | "High",
      "ai_probability": number (0-100),
      "verdict": "string",
      "analysis_text": "In-depth explanation of why the text is considered risky or safe.",
      "simple_explanation": "A very easy-to-understand summary in simple English (max 2 sentences).",
      "reason_for_score": "Exact reason why this score was assigned.",
      "suggestions": ["specific advice like 'Add sources' or 'Be more specific'"],
      "claims": [
        {
          "claim": "The specific statement",
          "verdict": "Verified" | "Uncertain" | "Misleading",
          "confidence": number,
          "reasoning": "Simple explanation of the verdict for this claim."
        }
      ]
    }


    """

    user_input = f"Domain Context: {context}\nText to Audit: {text}"

    try:
        text_response = _call_gemini(system_prompt, user_input)
        
        # Check for non-JSON responses (Spectrum Errors from gemini_service)
        if "Spectrum Error" in text_response or "Nexus Error" in text_response:
            return format_ai_response({"analysis_text": text_response}, fallback_text="Neural synchronization failure.")

        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            data = json.loads(match.group(0))
            return format_ai_response(data)
        else:
            # If no JSON, try formatting the raw response
            return format_ai_response({"analysis_text": text_response})
            
    except Exception as e:
        logger.error(f"Truth Engine Error: {str(e)}")
        return format_ai_response({}, fallback_text=f"Spectral Audit Status: {str(e)[:100]}")


def analyze_screenshot(extracted_text):
    """
    Handles Feature 2: Fake News & Screenshot Detector
    Uses the same Truth Engine logic but focuses on conversational/news snippets.
    """
    return verify_claims(extracted_text, context="News/Social Media Snapshot")
