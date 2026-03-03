import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("Error: GEMINI_API_KEY not found in .env file")
else:
    genai.configure(api_key=api_key)

    # Initialize Model
    model = genai.GenerativeModel(
        model_name="gemini-1.5-flash"
    )

    try:
        # Generate Content
        response = model.generate_content(
            "Who is the Prime Minister of India?"
        )
        print("--- Gemini API Response ---")
        print(response.text)
        print("---------------------------")
    except Exception as e:
        print(f"API Error: {e}")
