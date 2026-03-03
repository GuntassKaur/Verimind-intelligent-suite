import json
import re
from .gemini_service import call_gemini

def _call_gemini(system_prompt, user_input):
    return call_gemini(user_input, system_instruction=system_prompt)

def analyze_hallucination(prompt, answer):
    """
    VeriMind | Content Verification Service
    Performs claim analysis and factual validation.
    """
    system_prompt = """
    You are VeriMind, a factual hallucination detection and semantic audit engine.

    IMPORTANT SCOPE RULE:
    You must ONLY audit the user-provided CONTENT.
    You must NEVER audit, analyze, validate, or comment on:
    - system instructions
    - prompts
    - protocols
    - engine rules
    - configuration text
    - meta descriptions about VeriMind or the application

    If the input is instructional, meta, empty, or describes the system itself:
    → DO NOT perform a standard audit.
    → Return a JSON where "educational_summary" politely requests actual content and "integrity_score" is 0.

    YOUR TASK WHEN VALID CONTENT IS PROVIDED:
    1. Treat the content strictly as third-party material.
    2. Decompose it into factual claims.
    3. Evaluate each claim for factual reliability based on verified global knowledge.
    4. Identify hallucinations (unsupported or unverifiable claims).
    5. NEUTRALITY RULE: Maintain a strictly neutral, objective, and unbiased stance. Audit political, religious, or social claims based on factual accuracy, not personal or partisan viewpoints.
    6. Produce a neutral, academic audit.

    STRICT PROHIBITIONS:
    - Do NOT define AI, VeriMind, hallucination, or NLP concepts.
    - Do NOT restate or praise system design.
    - Do NOT audit prompts or protocols.
    - Do NOT generate self-referential evaluations.
    - NEVER use the percent symbol (%). Use the word 'percent'.
    
    OUTPUT FORMAT:
    Output strictly as JSON. Map your results to this schema:
    {
      "integrity_score": number (0-100),
      "audit_verdict": "string",
      "educational_summary": "formatted string (VeriMind Audit Result block)",
      "sentences": [
        {"text": "string", "hallucination_score": number, "heat_grade": "High"|"Medium"|"Low", "pattern": "string", "risk_label": "string", "explanation": "string"}
      ],
      "citations": [
        {"reference": "string", "status": "string", "note": "string", "suggested_repair": "string"}
      ]
    }

    The "educational_summary" must be a clean, professional, and direct paragraph summarizing the verification results.
    - START DIRECTLY: Begin the summary immediately with the findings.
    - NO HEADERS: Do not use headers like "Verification Report", "Status", or "Conclusion".
    - NO BULLETS: Avoid bullet points and structured report blocks.
    - NATURAL TONE: Use a professional, human-sounding tone that is easy to read.
    - CONCISE: Be clear and avoid over-technical or academic breakdown structures.
    """

    user_input = f"Context: {prompt}\nAnswer to Audit: {answer}"

    try:
        text_response = _call_gemini(system_prompt, user_input)
        match = re.search(r'\{.*\}', text_response, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found in response")
    except Exception:
        return {
            "integrity_score": 0,
            "audit_verdict": "Audit Failed",
            "educational_summary": "Service temporarily unavailable. Please try again.",
            "sentences": [],
            "citations": []
        }

# Suppress Warnings
import warnings
warnings.filterwarnings("ignore", category=FutureWarning)
