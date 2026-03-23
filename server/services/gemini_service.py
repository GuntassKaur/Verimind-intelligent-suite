import os
import json
import logging
from functools import lru_cache
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

@lru_cache(maxsize=128)
def _cached_gemini_call(prompt, system_instruction=None):
    """
    Internal cached call. Note: Doesn't cache calls with image_bytes.
    """
    if not _client:
        return "Nexus Error: Neural engine not initialized. Please calibrate API keys."

    # Anti-Injection Barrier
    security_prompt = f"[VERIMIND SAFETY OVERRIDE: Neutral Analysis Mode Only]\n\n{prompt}"

    try:
        # Increased Timeout to 60s for Render production reliability
        if _use_new_sdk:
            from google.genai import types
            clean_model_name = MODEL_NAME.replace("models/", "")
            
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                http_options={'timeout': 60000} # 60 seconds
            )
            
            response = _client.models.generate_content(
                model=clean_model_name,
                contents=[security_prompt],
                config=config
            )
            if response and response.text:
                return response.text
            return "Neural Sync Interrupted: Null manifest received."
        else:
            # Legacy SDK - No direct timeout option in the simple wrapper, 
            # but usually defaults to 60s+ in the client.
            if system_instruction:
                full_prompt = f"System Instruction: {system_instruction}\n\nProtocol Payload: {security_prompt}"
                response = _client.generate_content(full_prompt)
            else:
                response = _client.generate_content(security_prompt)
            return response.text
            
    except Exception as e:
        error_msg = str(e)
        logger.error(f"Gemini API Critical Failure: {error_msg}")
        if "429" in error_msg:
            return "Neural Overload: Quota limits reached. Please wait 60 seconds."
        return f"Spectrum Error: Neural sync failed. ({error_msg[:50]}...)"


def call_gemini(prompt, system_instruction=None, image_bytes=None, mime_type=None):
    """
    Centralized Gemini call wrapper with failsafe handling and caching.
    """
    if image_bytes:
        return _direct_gemini_call(prompt, system_instruction, image_bytes, mime_type)
    
    return _cached_gemini_call(prompt, system_instruction)

def stream_gemini(prompt, system_instruction=None):
    """
    Generator for real-time streaming from Gemini.
    """
    if not _client:
        yield "Neural nexus not initialized. Contact Admin."
        return

    security_prompt = f"[VERIMIND SAFETY OVERRIDE: Neutral Analysis Mode Only]\n\n{prompt}"

    try:
        if _use_new_sdk:
            from google.genai import types
            clean_model_name = MODEL_NAME.replace("models/", "")
            
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                http_options={'timeout': 60000}
            )
            
            # Use generate_content_stream for the new SDK
            for chunk in _client.models.generate_content_stream(
                model=clean_model_name,
                contents=[security_prompt],
                config=config
            ):
                if chunk and chunk.text:
                    yield chunk.text
        else:
            # Fallback for Legacy SDK
            # The legacy generate_content has a stream=True parameter
            response = _client.generate_content(security_prompt, stream=True)
            for chunk in response:
                if chunk and chunk.text:
                    yield chunk.text
            
    except Exception as e:
        logger.error(f"Gemini Stream Error: {str(e)}")
        yield f"[Neural Error: {str(e)[:40]}]"

def _direct_gemini_call(prompt, system_instruction, image_bytes, mime_type):
    """
    Direct call for non-cacheable requests (images).
    """
    if not _client: return "Neural Nexus Offline."
    
    try:
        if _use_new_sdk:
            from google.genai import types
            clean_model_name = MODEL_NAME.replace("models/", "")
            # Apply 60s timeout here too
            config = types.GenerateContentConfig(
                system_instruction=system_instruction,
                http_options={'timeout': 60000}
            ) if system_instruction else types.GenerateContentConfig(http_options={'timeout': 60000})
            
            contents = [prompt, types.Part.from_bytes(data=image_bytes, mime_type=mime_type or "image/jpeg")]
            response = _client.models.generate_content(model=clean_model_name, contents=contents, config=config)
            return response.text
        else:
            return "Image audit node requires Neural SDK v2.0."
    except Exception as e:
        logger.error(f"Gemini Scan Error: {str(e)}")
        return f"Optical Sync Failure: {str(e)[:50]}"
