from .gemini_service import call_gemini

def _call_gemini(system_prompt, user_prompt):
    return call_gemini(user_prompt, system_instruction=system_prompt)


def generate_answer(prompt, domain="General", response_type="Brief"):
    """
    VeriMind | Content Generation Service
    Categorizes research findings and provides structured summaries.
    """

    # Mode-specific rules
    if response_type == "Research":
        style_rules = """
        STRICT STYLE RULES:
        1. RESEARCH MODE: Provide a comprehensive, in-depth, and multi-faceted analysis.
        2. STRUCTURE: Use clear hierarchy (Major Headings, Subheadings) to organize the findings.
        3. TONE: Expert researcher tone—objective, detailed, and analytical.
        4. CONTENT: Include historical context, current trends, core principles, and technical specifics where applicable.
        5. ACCURACY: Prioritize the latest verified data and clear conceptual definitions.
        """
    else:  # Default: Brief (General is removed due to inaccuracies)
        style_rules = """
        STRICT STYLE RULES:
        1. BRIEF MODE: Provide a concise and accurate answer.
        2. LENGTH: Keep it under 5 lines.
        3. NO HEADINGS: Output only the answer text.
        4. DIRECT START: Start immediately with the relevant information.
        5. ACCURACY: Ensure the answer directly addresses the User Inquiry.
        """

    system_prompt = f"""
    You are VeriMind, a professional content generation and research assistant.
    Topic Category: {domain}
    Response Mode: {response_type}

    TASK: Provide a technically accurate, neutral, and direct answer to the user's inquiry.
    
    {style_rules}

    CONSTRAINTS:
    - NEUTRALITY: Maintain a strictly neutral, balanced, and objective tone. For political or social inquiries, present factual information without partisan bias or opinion.
    - ACCURACY: Never provide "placeholders" or generic templates. Provide factual, verified information only. If a fact is unverified or ambiguous, state that clearly.
    - AMBIGUITY RULE: If the user inquiry is extremely short (under 3 chars) and not a known abbreviation, politely ask for more context or provide the literal definition.
    - NO HALLUCINATION: Do not make up facts, statistics, or historical events.
    - SPEED & EFFICIENCY: Prioritize direct answers to minimize generation time.
    - NO PERCENT SYMBOL: NEVER use the symbol (%). Always use the word 'percent'.
    - NO BRANDING: NEVER mention "Gemini", "Google", "OpenAI", or any AI model names.
    - VERSATILITY: Provide high-quality analysis for any type of information requested, from technical to historical to general knowledge.
    """

    try:
        return _call_gemini(system_prompt, prompt)
    except Exception:
        return "Service temporarily unavailable. Please try again."

def generate_answer_stream(prompt, domain="General", response_type="Brief"):
    """
    Generator for real-time streaming of content generation.
    """
    from .gemini_service import stream_gemini
    
    # Mode-specific rules (duplicated for stream logic)
    if response_type == "Research":
        style_rules = "RESEARCH MODE: Provide a comprehensive, in-depth analysis."
    else:
        style_rules = "BRIEF MODE: Provide a concise and accurate answer under 5 lines."

    system_prompt = f"You are VeriMind, a professional content assistant. Domain: {domain}. {style_rules}. Use strictly neutral tone. No model names."

    try:
        return stream_gemini(prompt, system_instruction=system_prompt)
    except Exception:
        # Yielding error message instead of returning
        def error_gen(): yield "Neural link failed. Please retry."
        return error_gen()
