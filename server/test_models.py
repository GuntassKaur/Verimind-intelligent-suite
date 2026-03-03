import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if api_key:
    genai.configure(api_key=api_key)
    models_to_test = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro"]
    for m_name in models_to_test:
        try:
            print(f"Testing {m_name}...")
            model = genai.GenerativeModel(m_name)
            response = model.generate_content("hello")
            print(f"SUCCESS:{m_name}")
            break
        except Exception as e:
            print(f"FAILED:{m_name} - {e}")
else:
    print("NO_API_KEY")
