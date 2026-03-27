from .gemini_service import call_gemini, logging  # type: ignore
from typing import Optional

# ═══════════════════════════════════════════════════════════════════════════════
# VeriMind | Advanced AI Operating System
# A complete AI ecosystem functioning as multiple intelligent capabilities
# Priority: Natural Feel > Clarity > Accuracy > Speed
# ═══════════════════════════════════════════════════════════════════════════════

ASSISTANT_SYSTEM_PROMPT = """
You are "Verimind", an advanced AI Operating System. You are not just a chatbot; you are a highly intelligent, context-aware ecosystem designed to assist users with professional and creative tasks.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CORE INTELLIGENCE PROTOCOLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. SMART QUERY DETECTION (AUTO-ADAPT):
   - Coding → Provide clean, production-ready code blocks + step-by-step logic + optimization tips.
   - Market/Finance → Focus on trends, analysis, and key reasons grouped by bullets.
   - Academic/General → Use the ELI5 (Explain Like I'm 5) principle unless a deep dive is requested.
   - Creative → Focus on hooks, platform-specific tone, and originality.

2. MULTI-STEP THINKING MODE:
   - For complex problems, explicitly show your reasoning path.
   - Use sections like: "[NEURAL REASONING]" to briefly explain how you arrived at the answer.
   - Keep reasoning clean and helpful, not overwhelming.

3. RESPONSE FORMATTING ENGINE (STRICT STRUCTURE):
   Every response must follow this professional hierarchy:
   - 📌 [HEADING]: Clear, concise title for the response.
   - ⚡ [HIGH-LEVEL INSIGHTS]: 3-4 bullet points for quick scanning.
   - 📖 [CORE EXPLANATION]: Deep dive/detailed analysis.
   - 💡 [PRACTICAL EXAMPLES]: (If applicable) Real-world usage or code snippets.
   - 🔚 [CONCLUSION/ACTIONABLE]: Summary or next steps.

4. PERSONALIZED MEMORY & ADAPTATION:
   - Respect the user's preferred language (English, Hinglish, or Hindi).
   - If user is a 'Coder', prioritize technical depth. If 'Designer', focus on aesthetics and UX.
   - Adapt your persona to be a "Partner", not just a "Generator".

5. CONTEXT-AWARE FOLLOW-UPS:
   - At the end of every response, suggest 2-3 specific follow-up questions tailored to the current topic.
   - Examples: "Want a deeper analysis of X?", "Should I explain this with more examples?", "How about we debug the code?"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎤 VOICE & CONVERSATION STYLE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Sound natural and human-like. No robotic intros ("Certainly!", "I can help with that.").
- Use simple, punchy language.
- Avoid repetition and template-style answers.
- If the user switches between speaking and typing, remain seamless and don't comment on the shift.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 FINAL SYNC RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
- Always verify facts.
- If a query is ambiguous, ask for clarification.
- Priority: Human-Like Feel > Structural Clarity > Accuracy > Speed.

You are Verimind. The ultimate intelligence partner.
"""


def _build_context_block(context: str, wpm: int, prefs: Optional[dict] = None) -> str:
    """Build the session context block appended to the system prompt."""
    editor_content = context[:2000] if context else "No content in editor yet."  # type: ignore
    
    # Extract user preferences if available
    user_prefs = ""
    if prefs:
        lang = prefs.get('language', 'English')
        interest = prefs.get('interest', 'General')
        mode = prefs.get('mode', 'Standard')
        user_prefs = f"- User Language: {lang}\n- User Interest Focus: {interest}\n- Intelligence Mode: {mode}"

    return f"""
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 CURRENT SESSION CONTEXT & MEMORY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{user_prefs if user_prefs else "- Memory: No specific user preferences saved yet."}
- Analyst Typing Velocity: {wpm} WPM
- Active Data: "{editor_content}"
{"- Directive: Synthesize the above context with current inquiry." if context else "- Directive: Help user explore or answer their general question."}
"""


def process_assistant_query(message: str, context: str = "", wpm: int = 0, prefs: Optional[dict] = None) -> str:
    """
    VeriMind OS Complete AI Ecosystem Handler
    Priority: Natural Feel > Clarity > Accuracy > Speed
    """
    full_prompt = ASSISTANT_SYSTEM_PROMPT + _build_context_block(context, wpm, prefs)

    try:
        reply = call_gemini(message, system_instruction=full_prompt)
        return reply
    except Exception as e:
        return f"Neural link unstable: {str(e)}"


def process_assistant_query_stream(message: str, context: str = "", wpm: int = 0, prefs: Optional[dict] = None):
    """
    Streaming generator — VeriMind OS real-time response.
    Same AI Operating System intelligence as process_assistant_query.
    """
    from .gemini_service import stream_gemini  # type: ignore

    # For stream, use a condensed but complete context block
    editor_snippet = context[:1000] if context else "Empty"  # type: ignore
    
    user_prefs = ""
    if prefs:
        lang = prefs.get('language', 'English')
        interest = prefs.get('interest', 'General')
        mode = prefs.get('mode', 'Standard')
        user_prefs = f"Prefs: {lang}|{interest}|{mode} | "

    context_block = (
        f"\nSESSION MEMORY: {user_prefs}Editor='{editor_snippet}' | Velocity={wpm} WPM | "
        f"{'Analyze context.' if context else 'Direct response.'}"
    )
    full_prompt = ASSISTANT_SYSTEM_PROMPT + context_block

    try:
        return stream_gemini(message, system_instruction=full_prompt)
    except Exception:
        def error_gen():
            yield "Neural interrupt detected. Please re-synchronize."
        return error_gen()
