import os
import json
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

api_key = os.getenv("GEMINI_API_KEY")
MODEL_NAME = os.getenv("GEMINI_MODEL_NAME", "gemini-flash-latest")

_client = None
_use_new_sdk = False

try:
    from google import genai
    if api_key and api_key != "your_gemini_key_here":
        _client = genai.Client(api_key=api_key)
        _use_new_sdk = True
        logger.info(f"Gemini Service: google-genai SDK ({MODEL_NAME}) initialized.")
except Exception as e:
    logger.warning(f"Gemini Service: Could not initialize new google-genai SDK: {e}")

if not _use_new_sdk:
    try:
        import google.generativeai as legacy_genai
        if api_key and api_key != "your_gemini_key_here":
            legacy_genai.configure(api_key=api_key)
            # Ensure model name has the models/ prefix for legacy SDK
            legacy_model_name = MODEL_NAME if MODEL_NAME.startswith("models/") else f"models/{MODEL_NAME}"
            _client = legacy_genai.GenerativeModel(legacy_model_name)
            logger.info(f"Gemini Service: google-generativeai SDK ({legacy_model_name}) initialized (Fallback).")
    except Exception as e:
        logger.error(f"Gemini Service: Could not initialize legacy google-generativeai SDK: {e}")

def call_gemini(prompt, system_instruction=None, image_bytes=None, mime_type=None):
    """
    Centralized Gemini call wrapper with failsafe handling.
    """
    if not _client:
        logger.error("Gemini Service: Client not initialized.")
        return "Service temporarily unavailable. Please try again."

    try:
        if _use_new_sdk:
            from google.genai import types
            clean_model_name = MODEL_NAME.replace("models/", "")
            
            config = None
            if system_instruction:
                config = types.GenerateContentConfig(
                    system_instruction=system_instruction
                )
            
            contents = [prompt]
            if image_bytes:
                # Add image part
                contents.append(types.Part.from_bytes(data=image_bytes, mime_type=mime_type or "image/jpeg"))
            
            response = _client.models.generate_content(
                model=clean_model_name,
                contents=contents,
                config=config
            )
            return response.text
        else:
            # Legacy SDK
            if system_instruction:
                # Legacy SDK handles system instructions differently depending on version
                # often passed as part of initial initialization or wrapped in prompt
                full_prompt = f"System Instruction: {system_instruction}\n\nClient Prompt: {prompt}"
                response = _client.generate_content(full_prompt)
            else:
                response = _client.generate_content(prompt)
            return response.text
            
    except Exception as e:
        logger.error(f"Gemini API Error: {str(e)}")
        # Check for specific quota errors or 404s
        if "404" in str(e) or "not found" in str(e).lower():
            logger.error(f"Model {MODEL_NAME} not found or version mismatch.")
        
        # Always return the friendly message for users
        return "Service temporarily unavailable. Please try again."
