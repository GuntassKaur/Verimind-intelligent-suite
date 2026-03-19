import json
import re
from .gemini_service import call_gemini

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
      "simple_explanation": "A very easy-to-understand summary in simple English (max 2 sentences).",
      "reason_for_score": "Exact reason why this score was assigned.",
      "why_this_result": {
          "problematic_parts": ["list of confusing or risky phrases"],
          "analysis": "In-depth explanation of why the text is considered risky or safe."
      },
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
        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found in response")
    except Exception as e:
        return {
            "credibility_score": 0,
            "risk_level": "High",
            "ai_probability": 0,
            "verdict": "Audit Failed",
            "simple_explanation": "The Truth Engine encountered an error during analysis.",
            "reason_for_score": "Internal system failure.",
            "why_this_result": {"problematic_parts": [], "analysis": "N/A"},
            "suggestions": ["Try again later."],
            "claims": []
        }



def analyze_screenshot(extracted_text):
    """
    Handles Feature 2: Fake News & Screenshot Detector
    Uses the same Truth Engine logic but focuses on conversational/news snippets.
    """
    return verify_claims(extracted_text, context="News/Social Media Snapshot")
