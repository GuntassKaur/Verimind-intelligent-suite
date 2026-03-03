import os
from dotenv import load_dotenv
from google import genai
import sys

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("NO_API_KEY")
    sys.exit(1)

client = genai.Client(api_key=api_key)

# The user mentioned gemini-1.5-flash was failing.
# Let's try gemini-2.0-flash which was in the list.
try:
    print("Testing gemini-2.0-flash...")
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents="Ping"
    )
    print(f"SUCCESS (gemini-2.0-flash): {response.text}")
except Exception as e:
    print(f"FAILED (gemini-2.0-flash): {e}")

try:
    print("\nTesting gemini-2.0-flash-lite...")
    response = client.models.generate_content(
        model="gemini-2.0-flash-lite",
        contents="Ping"
    )
    print(f"SUCCESS (gemini-2.0-flash-lite): {response.text}")
except Exception as e:
    print(f"FAILED (gemini-2.0-flash-lite): {e}")

try:
    print("\nTesting gemini-1.5-flash...")
    response = client.models.generate_content(
        model="gemini-1.5-flash",
        contents="Ping"
    )
    print(f"SUCCESS (gemini-1.5-flash): {response.text}")
except Exception as e:
    print(f"FAILED (gemini-1.5-flash): {e}")
