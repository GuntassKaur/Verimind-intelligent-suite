import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    print("--- STARTING SEARCH ---")
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"DEBUG: Found {m.name}")
                try:
                    model = genai.GenerativeModel(m.name)
                    response = model.generate_content("Hi", generation_config={"max_output_tokens": 5})
                    print(f"WORKING_MODEL: {m.name}")
                    # Stop at the first working model
                except Exception as e:
                    print(f"NOT_WORKING: {m.name} - {str(e)[:50]}")
    except Exception as e:
        print(f"LIST_ERROR: {e}")
    print("--- END SEARCH ---")
else:
    print("NO_API_KEY")
