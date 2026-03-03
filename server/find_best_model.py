import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    try:
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        print("FOUND_MODELS:", ",".join(models))
        
        # Pick the best one
        best_model = None
        for preferred in ["models/gemini-1.5-flash", "models/gemini-1.5-pro", "models/gemini-pro"]:
            if preferred in models:
                best_model = preferred
                break
        
        if not best_model and models:
            best_model = models[0]
            
        print(f"BEST_MODEL: {best_model}")
    except Exception as e:
        print(f"ERROR: {e}")
else:
    print("NO_KEY")
