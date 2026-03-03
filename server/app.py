from flask import Flask, request, jsonify, render_template, session
from flask_cors import CORS
try:
    from flask_limiter import Limiter
    from flask_limiter.util import get_remote_address
    LIMITER_AVAILABLE = True
except ImportError:
    LIMITER_AVAILABLE = False
from services.verification_service import analyze_hallucination
from services.generation_service import generate_answer
from services.plagiarism_service import check_plagiarism
from services.humanize_service import humanize_text
from services.typing_service import get_typing_text
import services.auth_service as auth
from utils.processors import extract_text_from_pdf, extract_text_from_url
import os
import jwt
from dotenv import load_dotenv
from functools import wraps

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("JWT_SECRET", "super_secret_for_flask_session")
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB Limit

# Security: CORS and Rate Limiting
CORS(app, supports_credentials=True)

if LIMITER_AVAILABLE:
    limiter = Limiter(
        get_remote_address,
        app=app,
        default_limits=["200 per day", "50 per hour"],
        storage_uri="memory://",
    )
else:
    print("WARNING: flask-limiter not installed. Rate limiting disabled.")
    # Create a dummy limiter with a no-op limit decorator
    class _DummyLimiter:
        def limit(self, *args, **kwargs):
            def decorator(f):
                @wraps(f)
                def wrapper(*a, **kw):
                    return f(*a, **kw)
                return wrapper
            return decorator
    limiter = _DummyLimiter()

# Helper for Token Verification
def get_logged_in_user():
    token = session.get('token')
    if not token:
        return None
    try:
        data = jwt.decode(token, os.getenv("JWT_SECRET", "super_secret_key"), algorithms=["HS256"])
        return data
    except:
        return None

# Serve templates for web access
@app.route('/')
def index_page():
    user = get_logged_in_user()
    return render_template('index.html', is_logged_in=user is not None)

@app.route('/generation')
def generation_page():
    user = get_logged_in_user()
    return render_template('generation.html', is_logged_in=user is not None)

@app.route('/analyzer')
def analyzer_page():
    user = get_logged_in_user()
    return render_template('analyzer.html', is_logged_in=user is not None)

@app.route('/plagiarism')
def plagiarism_page():
    user = get_logged_in_user()
    return render_template('plagiarism.html', is_logged_in=user is not None)

@app.route('/humanize')
def humanize_page():
    user = get_logged_in_user()
    return render_template('humanize.html', is_logged_in=user is not None)

@app.route('/typing-test')
def typing_test_page():
    user = get_logged_in_user()
    return render_template('typing_test.html', is_logged_in=user is not None)

@app.route('/login')
def login_page():
    user = get_logged_in_user()
    return render_template('login.html', is_logged_in=user is not None)

@app.route('/history')
def history_page():
    user = get_logged_in_user()
    if user:
        # Get from MongoDB
        user_history = auth.get_user_history(user['user_id'])
        return render_template('history_view.html', history=user_history, is_logged_in=True)
    return render_template('history_view.html', history=[], is_logged_in=False)

# --- OTP Password Reset Endpoints ---

@app.route("/api/auth/reset-password-request", methods=["POST"])
@limiter.limit("5 per hour")
def reset_request():
    data = request.json
    email = data.get('email')
    if not email:
        return jsonify({"error": "Email is required"}), 400
    result = auth.request_password_reset(email)
    return jsonify(result)

@app.route("/api/auth/reset-password-verify", methods=["POST"])
@limiter.limit("10 per hour")
def reset_verify():
    data = request.json
    email = data.get('email')
    otp = data.get('otp')
    new_password = data.get('password')
    if not all([email, otp, new_password]):
        return jsonify({"error": "Missing fields"}), 400
    result = auth.verify_otp_and_reset_password(email, otp, new_password)
    return jsonify(result)

# --- File & URL Processing Endpoints ---

@app.route("/api/process/pdf", methods=["POST"])
@limiter.limit("10 per minute")
def process_pdf():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
    file = request.files['file']
    if file.filename == '' or not file.filename.endswith('.pdf'):
        return jsonify({"error": "Invalid file type. PDF required."}), 400
    
    content = extract_text_from_pdf(file.read())
    return jsonify({"text": content})

@app.route("/api/process/url", methods=["POST"])
@limiter.limit("10 per minute")
def process_url():
    data = request.json
    url = data.get('url')
    if not url:
        return jsonify({"error": "URL is required"}), 400
    
    content = extract_text_from_url(url)
    if "Error" in content:
        return jsonify({"error": content}), 400
    return jsonify({"text": content})

@app.route("/api/process/image", methods=["POST"])
def process_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
    file = request.files['file']
    from server.services.gemini_service import call_gemini
    
    image_data = file.read()
    mime_type = file.content_type
    
    prompt = "Please extract all text from this image as accurately as possible. Return ONLY the text found."
    extracted_text = call_gemini(prompt, image_bytes=image_data, mime_type=mime_type)
    
    if "Service temporarily unavailable" in extracted_text:
        return jsonify({"error": extracted_text}), 503
        
    return jsonify({"text": extracted_text})

# --- Main API Endpoints ---

@app.route("/api/auth/register", methods=["POST"])
@limiter.limit("5 per hour")
def register():
    data = request.json
    result = auth.register_user(data['email'], data['password'], data['name'])
    return jsonify(result)

@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("20 per hour")
def login():
    data = request.json
    result = auth.login_user(data['email'], data['password'])
    if "token" in result:
        session['token'] = result['token']
        session['user'] = result['user']
    return jsonify(result)

@app.route("/api/auth/forgot-password", methods=["POST"])
@limiter.limit("5 per hour")
def forgot_password():
    data = request.json
    if not data or not data.get('email'):
        return jsonify({"error": "Email is required"}), 400
    result = auth.request_password_reset(data['email'])
    return jsonify(result)

@app.route("/api/auth/verify-reset", methods=["POST"])
@limiter.limit("15 per hour")
def verify_reset():
    data = request.json
    if not data or not data.get('email') or not data.get('otp') or not data.get('newPassword'):
        return jsonify({"error": "Missing fields"}), 400
    result = auth.verify_otp_and_reset_password(data['email'], data['otp'], data['newPassword'])
    return jsonify(result)


from flask import redirect, url_for

@app.route("/api/auth/logout")
def logout():
    session.clear()
    return redirect(url_for('login_page'))

@app.route("/api/plagiarism", methods=["POST"])
def api_plagiarism():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        text = data.get("text")
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        result = check_plagiarism(text)
        
        # Optional history tracking (Fail-safe)
        try:
            user = get_logged_in_user()
            user_id = user['user_id'] if user else "guest"
            auth.save_history(user_id, "plagiarism", text[:100], result)
        except Exception as history_err:
            print(f"History Save Error (Plagiarism): {history_err}")
        
        return jsonify(result)
    except Exception as e:
        print(f"Global Plagiarism Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/humanize", methods=["POST"])
def api_humanize():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
        text = data.get("text")
        tone = data.get("tone", "Professional")
        if not text:
            return jsonify({"error": "Text is required"}), 400
        
        result = humanize_text(text, tone)
        
        try:
            user = get_logged_in_user()
            user_id = user['user_id'] if user else "guest"
            auth.save_history(user_id, "humanize", text[:100], result)
        except Exception as history_err:
            print(f"History Save Error (Humanize): {history_err}")
        
        return jsonify(result)
    except Exception as e:
        print(f"Global Humanize Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/typing/get-text", methods=["POST"])
def api_typing_text():
    try:
        data = request.get_json(silent=True)
        difficulty = data.get("difficulty", "Medium")
        category = data.get("category", "General")
        text = get_typing_text(difficulty, category)
        return jsonify({"text": text})
    except Exception as e:
        print(f"Typing API Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/generate", methods=["POST"])
@app.route("/generate", methods=["POST"])
def generate():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
            
        prompt = data.get("prompt") or data.get("query")
        domain = data.get("domain", "General Research")
        response_type = data.get("response_type", "Brief")
        
        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400
        
        result = generate_answer(prompt, domain, response_type)
        
        # Save History (Fail-safe)
        try:
            user = get_logged_in_user()
            user_id = user['user_id'] if user else "guest"
            auth.save_history(user_id, "generation", prompt[:100], {"answer": result[:100] + "..."})
        except Exception as history_err:
            print(f"History Save Error (Gen): {history_err}")
            
        return jsonify({"answer": result})
    except Exception as e:
        print(f"Global Generation Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

@app.route("/api/analyze", methods=["POST"])
@app.route("/analyze", methods=["POST"])
def analyze_endpoint():
    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400
            
        prompt = data.get("prompt") or data.get("question")
        answer = data.get("answer")
        
        if not prompt or not answer:
            return jsonify({"error": "Prompt and answer are required"}), 400
            
        result = analyze_hallucination(prompt, answer)
        
        # Save History (Fail-safe)
        try:
            user = get_logged_in_user()
            user_id = user['user_id'] if user else "guest"
            history_data = {
                "score": result.get('integrity_score', 0), 
                "verdict": result.get('audit_verdict', 'N/A')
            }
            auth.save_history(user_id, "analysis", prompt[:100], history_data)
        except Exception as history_err:
            print(f"History Save Error: {history_err}")
        
        # v4.8 Schema Mapping
        response_data = {
            "hallucination_percentage": result.get("integrity_score", 0),
            "verdict": result.get("audit_verdict") or result.get("verdict", "N/A"),
            "explanation": result.get("educational_summary") or result.get("summary", "No summary available."),
            "sentences": result.get("sentences", []),
            "citations": result.get("citations", []),
            **result
        }
        return jsonify(response_data)
    except Exception as e:
        print(f"Global Analyze Error: {str(e)}")
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
