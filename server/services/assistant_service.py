from .gemini_service import call_gemini

def process_assistant_query(message, context="", wpm=0):
    """
    VeriMind | Neural Assistant Service
    Synchronizes user query with editor context and velocity metrics.
    """
    
    system_prompt = f"""
    You are the VeriMind Synaptic Assistant—a high-level neural interface for professional writing and fact-verification.
    
    CURRENT CONTEXT:
    - Editor Content: "{context[:2000]}"
    - Analyst Velocity: {wpm} WPM
    
    TASK:
    - Provide strategic, concise, and technically accurate advice.
    - If the user asks for an improvement, analyze the context and suggest atomic changes.
    - Maintain a "Sovereign AI" tone: objective, elite, and helpful.
    - NEVER mention "Gemini", "Google", "OpenAI", or any model names.
    - Keep replies under 4-5 sentences unless deep analysis is requested.
    
    CORE DIRECTIVES:
    1. If context is empty, guide the user on starting a "Neural Manifest" (analysis).
    2. Suggest stylistic refinements (active voice, clarity) if velocity is high.
    3. Alert on potential factual risks if the context looks suspicious.
    4. Use professional formatting (bullet points if needed).
    """
    
    try:
        reply = call_gemini(message, system_instruction=system_prompt)
        return reply
    except Exception as e:
        return f"Neural link unstable: {str(e)}"

def process_assistant_query_stream(message, context="", wpm=0):
    """
    Generator for real-time assistant responses.
    """
    from .gemini_service import stream_gemini
    
    system_prompt = f"You are the VeriMind Synaptic Assistant. Context: {context[:1000]}. Analyst Velocity: {wpm} WPM. Provide concise, strategic advice in professional tone. No model names."

    try:
        return stream_gemini(message, system_instruction=system_prompt)
    except Exception:
        def error_gen(): yield "Neural interrupt detected. Please re-synchronize."
        return error_gen()
