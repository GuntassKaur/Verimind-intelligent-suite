import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

with open("working_model_report.txt", "w") as f:
    if api_key:
        genai.configure(api_key=api_key)
        f.write("--- STARTING SEARCH ---\n")
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    f.write(f"DEBUG: Found {m.name}\n")
                    try:
                        model = genai.GenerativeModel(m.name)
                        response = model.generate_content("Hi", generation_config={"max_output_tokens": 5})
                        f.write(f"WORKING_MODEL: {m.name}\n")
                        # We don't break, find all working ones
                    except Exception as e:
                        f.write(f"NOT_WORKING: {m.name} - {str(e)}\n")
        except Exception as e:
            f.write(f"LIST_ERROR: {e}\n")
        f.write("--- END SEARCH ---\n")
    else:
        f.write("NO_API_KEY\n")
