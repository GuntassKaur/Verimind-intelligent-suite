import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def list_supported_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("[!] GEMINI_API_KEY not found in .env")
        return

    try:
        genai.configure(api_key=api_key)
        print("\nAvailable Gemini Models:")
        print("-" * 30)
        found = False
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
                found = True
        
        if not found:
            print("No models found supporting generateContent.")
            
    except Exception as e:
        print(f"[ERROR] Could not list models: {e}")

if __name__ == "__main__":
    list_supported_models()
