import os
import datetime
import jwt
import logging
from functools import wraps
from flask import Flask, request, jsonify, render_template, session, make_response
from flask_cors import CORS
from dotenv import load_dotenv

# Basic Security (Simplified for Render reliability)
from flask_talisman import Talisman

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
app.config['SESSION_COOKIE_SECURE'] = False 
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# 1. CORS Restricted Origins - Explicitly allowing Vercel domain and wildcards for reliability
# Note: Temporarily allowing all origins to fix the "Service Unavailable" CORS block if Vercel URL changed
CORS(app, supports_credentials=True, origins="*")

# 2. Security: Minimal Talisman to avoid proxy header blocks on Render
talisman = Talisman(
    app,
    content_security_policy=None, 
    force_https=False 
)

# --- Standardized Response Helper ---
def create_response(data=None, success=True, status=200, error=None):
    response_body = {
        "success": success,
        "data": data,
        "error": error
    }
    return make_response(jsonify(response_body), status)

# --- Security Utilities ---
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.cookies.get('access_token')
        
        if f.__name__ in ['login', 'register', 'send_otp', 'verify_otp_login', 'health_check']:
            return f(*args, **kwargs)

        if not token:
            request.user = {"user_id": f"guest_{request.remote_addr[:12]}", "is_guest": True}
            return f(*args, **kwargs)
            
        try:
            payload = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
            request.user = payload
            request.user['is_guest'] = False
        except Exception:
            request.user = {"user_id": f"guest_{request.remote_addr[:12]}", "is_guest": True}
            return f(*args, **kwargs)
        return f(*args, **kwargs)
    return decorated_function

# --- Public Routes ---

@app.route("/api/health", methods=["GET"])
def health_check():
    return create_response(data={"status": "operational", "timestamp": datetime.datetime.utcnow().isoformat()})

# --- Auth Endpoints ---

@app.route("/api/auth/register", methods=["POST"])
def register():
    try:
        req_json = request.get_json()
        if not req_json: return create_response(success=False, error="Missing manifest data.", status=400)
        
        data = RegisterSchema(**req_json)
        result = auth.register_user(data.email, data.password, data.name)
        
        if result.get('success'):
            response = create_response(data={"user": result['user']}, status=201)
            is_prod = not app.debug
            response.set_cookie('access_token', result['access_token'], httponly=True, secure=is_prod, samesite='Lax', max_age=86400)
            response.set_cookie('refresh_token', result['refresh_token'], httponly=True, secure=is_prod, samesite='Lax', max_age=7*24*3600)
            return response
        return create_response(success=False, error=result.get('error', 'Synthesis failed.'), status=result.get('status', 400))
    except ValidationError:
        return create_response(success=False, error="Manifest validation failed.", status=400)

@app.route("/api/auth/login", methods=["POST"])
def login():
    try:
        req_json = request.get_json() or {}
        data = LoginSchema(**req_json)
        result = auth.login_user(data.email, data.password)
        if result.get('success'):
            response = create_response(data={"user": result['user']})
            is_prod = not app.debug
            response.set_cookie('access_token', result['access_token'], httponly=True, secure=is_prod, samesite='Lax', max_age=86400)
            response.set_cookie('refresh_token', result['refresh_token'], httponly=True, secure=is_prod, samesite='Lax', max_age=7*24*3600)
            return response
        return create_response(success=False, error=result.get('error', 'Access denied.'), status=401)
    except ValidationError:
        return create_response(success=False, error="Invalid credentials format.", status=400)

@app.route("/api/auth/logout", methods=["POST", "GET"])
def logout():
    response = create_response(data={"message": "Logged out successfully."})
    response.set_cookie('access_token', '', expires=0, path='/')
    response.set_cookie('refresh_token', '', expires=0, path='/')
    return response

@app.route("/api/auth/me", methods=["GET"])
@login_required
def get_me():
    user_id = request.user['user_id']
    if request.user.get('is_guest'):
        return create_response(data={"name": "Guest Analyst", "id": user_id, "is_guest": True})
    user_data = auth.get_user_by_id(user_id)
    if user_data:
        return create_response(data=user_data)
    return create_response(success=False, error="Entity not identified.", status=404)

# --- AI & Knowledge Endpoints (Optimized) ---

def validate_text_input(text, min_len=1, max_len=20000):
    if not text or not isinstance(text, str):
        return False, "Input must contain a valid neural manifest."
    if len(text.strip()) < min_len:
        return False, "Spectrum intensity too low."
    if len(text) > max_len:
        return False, "Spectrum limit exceeded."
    return True, None

@app.route("/api/generate", methods=["POST"])
@app.route("/api/ai/generate", methods=["POST"])
@login_required
def generate():
    data = request.json or {}
    prompt = data.get("prompt") or data.get("query")
    
    ok, msg = validate_text_input(prompt)
    if not ok: return create_response(success=False, error=msg, status=400)
    
    result = generate_answer(prompt, data.get("domain", "General"), data.get("response_type", "Research"))
    auth.save_history(request.user['user_id'], "generation", prompt[:100], result)
    return create_response(data={"answer": result})

@app.route("/api/plagiarism/check", methods=["POST"])
@app.route("/api/ai/plagiarism/check", methods=["POST"])
@login_required
def plagiarism():
    data = request.json or {}
    text = data.get("text")
    
    ok, msg = validate_text_input(text)
    if not ok: return create_response(success=False, error=msg, status=400)
    
    result = check_plagiarism(text)
    auth.save_history(request.user['user_id'], "plagiarism", text[:50], result)
    return create_response(data=result)

@app.route("/api/humanize", methods=["POST"])
@app.route("/api/ai/humanize", methods=["POST"])
@login_required
def humanize():
    data = request.json or {}
    text = data.get("text")
    
    ok, msg = validate_text_input(text)
    if not ok: return create_response(success=False, error=msg, status=400)
    
    result = humanize_text(text, data.get("tone", "Professional"))
    auth.save_history(request.user['user_id'], "humanization", text[:50], result)
    return create_response(data=result)

@app.route("/api/analyze", methods=["POST"])
@app.route("/api/ai/analyze", methods=["POST"])
@login_required
def analyze():
    data = request.json or {}
    text = data.get("text") or data.get("answer")
    
    ok, msg = validate_text_input(text)
    if not ok: return create_response(success=False, error=msg, status=400)
    
    result = verify_claims(text, data.get("context", "General"))
    auth.save_history(request.user['user_id'], "analysis", text[:50], result)
    return create_response(data=result)

@app.route("/api/ai/visualize", methods=["POST"])
@login_required
def visualize():
    data = request.json or {}
    text = data.get("text")
    
    ok, msg = validate_text_input(text, max_len=10000)
    if not ok: return create_response(success=False, error=msg, status=400)
    
    result = generate_visual_intelligence(text, data.get("type"))
    auth.save_history(request.user['user_id'], "visualization", text[:50], result)
    return create_response(data=result)

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"VERIMIND SPECTRAL ERROR: {str(e)}", exc_info=True)
    return create_response(success=False, error=f"Neural sync failure. ({str(e)[:50]})", status=500)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
