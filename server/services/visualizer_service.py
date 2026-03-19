import json
import re
from .gemini_service import call_gemini

def generate_visual_intelligence(text, visual_type=None):
    """
    VeriMind v5.0 | Smart Summarizer + Visualizer
    Generates concise summaries and visual knowledge maps (Mermaid.js format).
    """
    focus_instruction = f"FOCUS HEAVILY ON PRODUCING A DETAILED AND LARGE {visual_type} DIAGRAM." if visual_type else ""
    
    system_prompt = f"""
    You are the VeriMind Knowledge Visualizer.
    Your task is to synthesize complex information into a high-level summary and visual diagrams.
    {focus_instruction}

    DIAGRAM TYPES TO PROVIDE (You MUST provide exactly these 3 diagrams):
    1. Mindmap (For hierarchy/concepts)
    2. Flowchart (For processes: Input -> Processing -> Insight -> Result)
    3. Key Point Diagram (Standard graph or hierarchy)

    OUTPUT SCHEMA (JSON):
    {{
      "summary": "Concise 2-3 sentence summary.",
      "key_concepts": ["Concept 1", "Concept 2", "Concept 3"],
      "mermaid_diagrams": [
        {{
          "type": "Mindmap",
          "code": "Mermaid.js compatible code string"
        }},
        {{
          "type": "Flowchart",
          "code": "Mermaid.js flowchart code string (e.g., graph LR or graph TD)"
        }},
        {{
          "type": "Key Concept Diagram",
          "code": "Mermaid.js compatible code string"
        }}
      ],
      "data_insights": "Brief description of numeric or logical patterns found."
    }}

    NOTE: Use proper Mermaid syntax. Diagrams should be large, spanning multiple nodes to ensure readability for complex text.
    For mindmaps specifically, use:
    mindmap
      root((Main Topic))
        Child 1
        Child 2
    """

    try:
        response = call_gemini(text, system_instruction=system_prompt)
        match = re.search(r'\{.*\}', response, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise ValueError("No JSON found")
    except Exception:
        return {
            "summary": "System unable to synthesize content at this time.",
            "key_concepts": [],
            "mermaid_diagrams": [],
            "data_insights": "No insights available."
        }
