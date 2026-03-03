import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    model_name = "models/gemini-flash-latest"
    try:
        print(f"Testing {model_name}...")
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Ping")
        print(f"SUCCESS: {response.text}")
    except Exception as e:
        print(f"FAILED: {e}")
else:
    print("NO_API_KEY")
