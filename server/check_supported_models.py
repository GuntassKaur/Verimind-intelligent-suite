import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    try:
        print("Checking models...")
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"MODEL: {m.name} (Methods: {m.supported_generation_methods})")
    except Exception as e:
        print(f"ERROR: {e}")
else:
    print("NO_KEY")
