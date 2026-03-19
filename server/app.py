import os
import datetime
import jwt
import logging
from functools import wraps
from flask import Flask, request, jsonify, render_template, session, make_response
from flask_cors import CORS
from dotenv import load_dotenv

# Security Middlewares
from flask_talisman import Talisman
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# Services & schemas
import services.auth_service as auth
from utils.schemas import EmailSchema, OTPVerifySchema, RegisterSchema, LoginSchema
from pydantic import ValidationError

from services.verification_service import verify_claims, analyze_screenshot
from services.dna_service import analyze_writing_dna
from services.visualizer_service import generate_visual_intelligence
from services.generation_service import generate_answer
from services.plagiarism_service import check_plagiarism
from services.humanize_service import humanize_text
from services.typing_service import get_typing_text
from utils.processors import extract_text_from_pdf, extract_text_from_url

# Configuration & Validation
from config import config

load_dotenv()

# --- Logging Configuration ---
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
    handlers=[
        logging.FileHandler("server.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.secret_key = os.getenv("SESSION_SECRET", "verimind_session_secret_2026")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024 # 16MB Limit
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = False # Set to True in Production
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Security: Add Talisman for production-grade headers
# Note: Content Security Policy (CSP) might need adjustment if using CDNs
talisman = Talisman(
    app,
    content_security_policy=None, # Set to None for dev flexibility, or define strict policy
    force_https=False # Set to True in production with SSL
)

# 2. Rate Limiting
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["500 per day", "100 per hour"],
    storage_uri="memory://",
)

# 3. CORS Restricted Origins
CORS(app, supports_credentials=True, origins=[
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    os.getenv("FRONTEND_URL", "")
])

# --- Standardized Response Helper ---
def create_response(data, status=200):
    return make_response(jsonify(data), status)

# --- Security Utilities ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('access_token')
        
        # If no token, check if it's a guest-allowed request
        if not token:
            # For simplicity in this demo, we allow guest access but with a special flag
            request.user = {"user_id": f"guest_{request.remote_addr}", "is_guest": True}
            return f(*args, **kwargs)
            
        try:
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            request.user = payload
            request.user['is_guest'] = False
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
        except Exception as e:
            return jsonify({"error": "Session error"}), 401
        return f(*args, **kwargs)
    return decorated_function

# --- Public Routes ---

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "operational", "timestamp": datetime.datetime.utcnow().isoformat()})

# --- Auth Endpoints ---

@app.route("/api/auth/register", methods=["POST"])
@limiter.limit("5 per hour")
def register():
    try:
        data = RegisterSchema(**request.json)
        result = auth.register_user(data.email, data.password, data.name)
        if result.get('success'):
            response = create_response({
                "success": True, 
                "user": result['user']
            }, 201)
            response.set_cookie('access_token', result['access_token'], httponly=True, secure=False, samesite='Lax', max_age=15*60)
            response.set_cookie('refresh_token', result['refresh_token'], httponly=True, secure=False, samesite='Lax', max_age=7*24*60*60)
            return response
        return jsonify(result), result.get('status', 400)
    except ValidationError as e:
        return jsonify({"error": "Invalid registration data format"}), 400

@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("20 per hour")
def login():
    try:
        data = LoginSchema(**request.json)
        result = auth.login_user(data.email, data.password)
        if result.get('success'):
            response = create_response({
                "success": True, 
                "user": result['user']
            })
            response.set_cookie('access_token', result['access_token'], httponly=True, secure=False, samesite='Lax', max_age=15*60)
            response.set_cookie('refresh_token', result['refresh_token'], httponly=True, secure=False, samesite='Lax', max_age=7*24*60*60)
            return response
        return jsonify(result), result.get('status', 401)
    except ValidationError:
        return jsonify({"error": "Invalid credentials format"}), 400

@app.route("/api/auth/send-otp", methods=["POST"])
@limiter.limit("5 per hour")
def send_otp():
    """Endpoint to request a login OTP."""
    try:
        data = EmailSchema(**request.json)
        result = auth.request_login_otp(data.email)
        return jsonify(result), result.get('status', 200)
    except ValidationError:
        return jsonify({"error": "Invalid email format"}), 400
    except Exception as e:
        logger.error(f"OTP Request Error: {str(e)}")
        return jsonify({"error": "Failed to send OTP. Please try again later."}), 500

@app.route("/api/auth/verify-otp", methods=["POST"])
@limiter.limit("10 per hour")
def verify_otp_login():
    """Endpoint to verify OTP and establish session."""
    try:
        data = OTPVerifySchema(**request.json)
        result = auth.verify_login_otp(data.email, data.otp)
        
        if result.get('success'):
            response = create_response({
                "success": True, 
                "user": result['user']
            })
            # Set secure HTTP-only cookies
            response.set_cookie(
                'access_token', 
                result['access_token'], 
                httponly=True, 
                secure=False, # Set to True in production
                samesite='Lax', 
                max_age=3600 # 1 hour
            )
            response.set_cookie(
                'refresh_token', 
                result['refresh_token'], 
                httponly=True, 
                secure=False, # Set to True in production
                samesite='Lax', 
                max_age=7*24*3600 # 7 days
            )
            return response
            
        return jsonify(result), result.get('status', 401)
    except ValidationError:
        return jsonify({"error": "Invalid verification data format"}), 400
    except Exception as e:
        logger.error(f"OTP Verification Error: {str(e)}")
        return jsonify({"error": "Authentication failed"}), 500

@app.route("/api/auth/me", methods=["GET"])
@login_required
def get_me():
    """Fetches currently authenticated user data."""
    user_id = request.user['user_id']
    user_data = auth.get_user_by_id(user_id)
    if user_data:
        return jsonify(user_data)
    return jsonify({"error": "User not found"}), 404

@app.route("/api/auth/otp/request", methods=["POST"])
@limiter.limit("3 per hour")
def request_otp():
    """Legacy endpoint for forgot password OTP."""
    try:
        data = EmailSchema(**request.json)
        result = auth.request_forgot_password_otp(data.email)
        return jsonify(result), result.get('status', 200)
    except ValidationError:
        return jsonify({"error": "Invalid email format"}), 400

@app.route("/api/auth/otp/verify", methods=["POST"])
@limiter.limit("10 per hour")

def verify_otp():
    try:
        req_data = request.json
        email = req_data.get('email')
        otp = req_data.get('otp')
        new_password = req_data.get('password')
        
        if not email or not otp or not new_password:
            return jsonify({"error": "Missing required verification fields"}), 400
            
        result = auth.reset_password_with_otp(email, otp, new_password)
        return jsonify(result), result.get('status', 200)
    except Exception as e:
        logger.error(f"OTP verification error: {str(e)}")
        return jsonify({"error": "Failed to reset password"}), 500

@app.route("/api/auth/refresh", methods=["POST"])
def refresh_token():
    refresh_token = request.cookies.get('refresh_token')
    if not refresh_token: return jsonify({"error": "No refresh token"}), 401
    
    new_access_token = auth.refresh_access_token(refresh_token)
    if new_access_token:
        response = create_response({"success": True})
        response.set_cookie('access_token', new_access_token, httponly=True, secure=False, samesite='Lax', max_age=15*60)
        return response
    return jsonify({"error": "Invalid refresh token"}), 401

@app.route("/api/auth/logout", methods=["POST"])
def logout():
    response = create_response({"success": True})
    response.delete_cookie('access_token')
    response.delete_cookie('refresh_token')
    return response

# --- Protected API Endpoints ---

@app.route("/api/history", methods=["GET"])
@login_required
def get_history():
    user_id = request.user['user_id']
    history = auth.get_user_history(user_id)
    return jsonify(history)

@app.route("/api/generate", methods=["POST"])
@login_required
def generate():
    data = request.json
    prompt = data.get("prompt") or data.get("query")
    if not prompt: return jsonify({"error": "Prompt required"}), 400
    
    result = generate_answer(prompt, data.get("domain", "General"), data.get("response_type", "Brief"))
    auth.save_history(request.user['user_id'], "generation", prompt, result)
    return jsonify({"answer": result})

@app.route("/api/plagiarism", methods=["POST"])
@login_required
def plagiarism():
    data = request.json
    text = data.get("text")
    if not text: return jsonify({"error": "Text required"}), 400
    
    result = check_plagiarism(text)
    auth.save_history(request.user['user_id'], "plagiarism", text[:100], result)
    return jsonify(result)

@app.route("/api/humanize", methods=["POST"])
@login_required
def humanize():
    data = request.json
    text = data.get("text")
    tone = data.get("tone", "Professional")
    if not text: return jsonify({"error": "Text required"}), 400
    
    result = humanize_text(text, tone)
    auth.save_history(request.user['user_id'], "humanization", text[:100], result)
    return jsonify(result)

@app.route("/api/analyze", methods=["POST"])
@login_required
def analyze():
    """Endpoint for Feature 1: Truth Engine"""
    data = request.json
    text = data.get("answer") or data.get("text")
    context = data.get("prompt") or data.get("context", "General")
    if not text: return jsonify({"error": "Content required for analysis"}), 400
    
    result = verify_claims(text, context)
    auth.save_history(request.user['user_id'], "analysis", text[:100], result)
    return jsonify(result)

@app.route("/api/ai/dna", methods=["POST"])
@login_required
def writing_dna():
    """Endpoint for Feature 3: Writing DNA Analyzer"""
    data = request.json
    text = data.get("text")
    if not text: return jsonify({"error": "Text required"}), 400
    
    result = analyze_writing_dna(text)
    auth.save_history(request.user['user_id'], "dna_analysis", text[:100], result)
    return jsonify(result)

@app.route("/api/ai/process", methods=["POST"])
@login_required
def process_intelligence():
    """Generic endpoint for various AI intelligence tasks."""
    data = request.json
    text = data.get("text")
    task = data.get("task")
    if not text or not task:
        return jsonify({"error": "Text and task type required"}), 400

    from services.gemini_service import call_gemini
    
    prompts = {
        "summarize": "Provide a professional, concise executive summary of the following text. Use bullet points for key takeaways.",
        "paraphrase": "Rewrite the following text to convey the same meaning but with completely different phrasing and tone. Maintain accuracy.",
        "email_writer": "Convert the following notes or text into a professional, well-structured email. Include a subject line.",
        "essay_writer": "Expand the following points into a formal, academic-style essay with an introduction, body, and conclusion.",
        "code_explainer": "Analyze the following code snippet. Explain its logic, time complexity, and suggest any potential optimizations.",
        "content_improver": "Analyze the following text. Identify weak phrasing, grammatical issues, and rewrite it for maximum clarity and impact."
    }

    system_instr = "You are VeriMind, a professional AI Intelligence assistant specializing in high-fidelity content transformation."
    user_prompt = f"{prompts.get(task, 'Process the following text:')}\n\nText: {text}"
    
    result = call_gemini(user_prompt, system_instruction=system_instr)
    auth.save_history(request.user['user_id'], f"intel_{task}", text[:100], result)
    return jsonify({"answer": result, "type": task})

@app.route("/api/ai/visualize", methods=["POST"])
@login_required
def visualize():
    """Endpoint for Feature 4: Smart Summarizer + Visualizer"""
    data = request.json
    text = data.get("text")
    visual_type = data.get("type")
    if not text: return jsonify({"error": "Text required"}), 400
    
    result = generate_visual_intelligence(text, visual_type)
    auth.save_history(request.user['user_id'], "visualization", text[:100], result)
    return jsonify(result)

# --- File & Content Processing Endpoints ---

@app.route("/api/process/url", methods=["POST"])
@login_required
def process_url():
    url = request.json.get("url")
    if not url: return jsonify({"error": "URL required"}), 400
    text = extract_text_from_url(url)
    return jsonify({"text": text})

@app.route("/api/process/pdf", methods=["POST"])
@login_required
def process_pdf():
    if 'file' not in request.files: return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if file.filename == '': return jsonify({"error": "No file selected"}), 400
    
    text = extract_text_from_pdf(file.read())
    return jsonify({"text": text})

@app.route("/api/process/image", methods=["POST"])
@login_required
def process_image():
    """Enhanced Feature 2: Fake News & Screenshot Detector"""
    if 'file' not in request.files: return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    is_screenshot = request.form.get("is_screenshot") == "true"
    
    from services.gemini_service import call_gemini
    image_bytes = file.read()
    mime_type = file.content_type
    
    # Step 1: Extract Text
    prompt = "Extract all text from this image accurately. Maintain readability."
    extracted_text = call_gemini(prompt, image_bytes=image_bytes, mime_type=mime_type)
    
    if is_screenshot:
        # Step 2: Immediate Credibility Analysis for Screenshots
        result = analyze_screenshot(extracted_text)
        auth.save_history(request.user['user_id'], "screenshot_audit", "Image Upload", result)
        return jsonify({"text": extracted_text, "audit": result})
    
    return jsonify({"text": extracted_text})

@app.route("/api/improve-words", methods=["POST"])
@login_required
def improve_words():
    data = request.json
    text = data.get("text")
    if not text: return jsonify({"error": "Text required"}), 400
    
    from services.gemini_service import call_gemini
    prompt = f"Detect weak words in the following text and suggest better, context-aware alternatives. Return suggestions as a JSON list of objects with 'original', 'suggestions' (list), and 'context' fields.\n\nText: {text}"
    result = call_gemini(prompt, system_instruction="You are a linguistic expert specializing in professional writing.")
    return jsonify({"analysis": result})

# --- Error Handlers ---

@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({"error": "Rate limit exceeded. Please try again later."}), 429

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
    return jsonify({"error": "An internal server error occurred"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # In production, debug should be False
    app.run(host="0.0.0.0", port=port, debug=False)
