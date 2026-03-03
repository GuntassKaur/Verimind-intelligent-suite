import google.generativeai as genai
import os
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv(ENV_PATH)
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    try:
        print("Fetching models...")
        # Get list of models and check which ones support content generation
        models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
        
        # Priority: find a working one from a known list if possible
        preferred_models = ["models/gemini-2.0-flash", "models/gemini-flash-latest", "models/gemini-pro-latest"]
        best = None
        for p in preferred_models:
            if p in models:
                best = p
                break
        
        if not best and models:
            best = models[0]
            
        if best:
            # Strip 'models/' prefix for .env consistency
            best_clean = best.replace("models/", "")
            print(f"RECOMMENDED_MODEL: {best_clean}")
            
            # Update .env file
            if os.path.exists(ENV_PATH):
                with open(ENV_PATH, "r") as f:
                    lines = f.readlines()
                
                updated = False
                new_lines = []
                for line in lines:
                    if line.startswith("GEMINI_MODEL_NAME="):
                        new_lines.append(f"GEMINI_MODEL_NAME={best_clean}\n")
                        updated = True
                    else:
                        new_lines.append(line)
                
                if not updated:
                    new_lines.append(f"GEMINI_MODEL_NAME={best_clean}\n")
                
                with open(ENV_PATH, "w") as f:
                    f.writelines(new_lines)
                print(f"Updated GEMINI_MODEL_NAME in .env to: {best_clean}")
            else:
                print(f"Error: .env file not found at {ENV_PATH}")
        else:
            print("No supported models found.")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("No API Key found in .env.")
