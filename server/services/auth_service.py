import os
import jwt
import datetime
import bcrypt
import secrets
import logging
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/verimind")
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    db = client.get_database()
    # Test connection
    client.server_info() 
except Exception as e:
    logger.error(f"[SECURITY ALERT] MongoDB connection failure: {str(e)}")
    db = None

# Collections
if db is not None:
    users_col = db.users
    users_col.create_index("email", unique=True)
    history_col = db.history
    otps_col = db.otps
    refresh_tokens_col = db.refresh_tokens
else:
    users_col = None
    history_col = None
    otps_col = None
    refresh_tokens_col = None

from config import config

# Use validated secrets from config
JWT_SECRET = os.getenv("JWT_SECRET")
REFRESH_SECRET = os.getenv("REFRESH_SECRET")

def generate_otp():
    """Generates a secure 6-digit random OTP."""
    return "".join([str(secrets.randbelow(10)) for _ in range(6)])

# --- NEW: Password-Based Registration & Login ---

def register_user(email, password, name):
    """Securely registers a new user with a hashed password."""
    if users_col is None:
        return {"error": "Database connection failure. Please contact support.", "status": 503}
    if users_col.find_one({"email": email}):
        return {"error": "Email already registered.", "status": 400}
    
    hashed_pw = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    
    user_id = users_col.insert_one({
        "email": email,
        "password_hash": hashed_pw,
        "name": name,
        "created_at": datetime.datetime.utcnow(),
        "last_login": datetime.datetime.utcnow()
    }).inserted_id
    
    user = users_col.find_one({"_id": user_id})
    access_token, refresh_token = generate_tokens(str(user["_id"]), user["email"])
    
    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"email": user['email'], "name": user['name']},
        "status": 201
    }

def login_user(email, password):
    """Authenticates a user via email and password."""
    if users_col is None:
        return {"error": "Database connection failure. Please contact support.", "status": 503}
    user = users_col.find_one({"email": email})
    if not user:
        return {"error": "Invalid email or password.", "status": 401}
    
    if not bcrypt.checkpw(password.encode('utf-8'), user.get('password_hash', b'')):
        return {"error": "Invalid email or password.", "status": 401}
    
    users_col.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.datetime.utcnow()}})
    
    access_token, refresh_token = generate_tokens(str(user["_id"]), user["email"])
    
    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"email": user['email'], "name": user.get('name', 'User')},
        "status": 200
    }

# --- OTP for Forgot Password Only ---

def request_forgot_password_otp(email):
    """Generates an OTP for password reset."""
    if users_col is None or otps_col is None:
        return {"error": "Database connection failure.", "status": 503}
    user = users_col.find_one({"email": email})
    if not user:
        # Don't leak exists/not exists for security, but return success message
        return {"success": "If your email is registered, you will receive an OTP.", "status": 200}

    # Rate Limit Check
    last_otp = otps_col.find_one({"email": email})
    if last_otp:
        elapsed = (datetime.datetime.utcnow() - last_otp['created_at']).total_seconds()
        if elapsed < 60:
            return {"error": f"Please wait {int(60 - elapsed)} seconds before resending.", "status": 429}

    otp = generate_otp()
    hashed_otp = bcrypt.hashpw(otp.encode('utf-8'), bcrypt.gensalt())
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    
    otps_col.update_one(
        {"email": email},
        {"$set": {
            "otp_hash": hashed_otp,
            "expires_at": expiry,
            "created_at": datetime.datetime.utcnow(),
            "attempts": 0
        }},
        upsert=True
    )
    
    # Send via real mailer
    from utils.mailer import send_otp_email
    mail_sent = send_otp_email(email, otp)
    if not mail_sent:
        return {"error": "Failed to deliver OTP. Please check your email address.", "status": 500}
        
    logger.info(f"[RESET PASSWORD] OTP for {email} generated. If no SMTP is set, check logs above.")
    return {"success": "OTP sent to your email for password reset.", "status": 200}

def reset_password_with_otp(email, otp, new_password):
    """Verifies OTP and resets the user's password."""
    if users_col is None or otps_col is None:
        return {"error": "Database connection failure.", "status": 503}
    otp_record = otps_col.find_one({"email": email})
    if not otp_record:
        return {"error": "Invalid or expired OTP session.", "status": 401}
    
    if datetime.datetime.utcnow() > otp_record['expires_at']:
        otps_col.delete_one({"email": email})
        return {"error": "OTP has expired.", "status": 401}
    
    if otp_record['attempts'] >= 3:
        otps_col.delete_one({"email": email})
        return {"error": "Too many failed attempts. Session locked.", "status": 403}

    if not bcrypt.checkpw(otp.encode('utf-8'), otp_record['otp_hash']):
        otps_col.update_one({"email": email}, {"$inc": {"attempts": 1}})
        return {"error": "Invalid OTP.", "status": 401}
    
    # Success: Update Password
    new_hashed_pw = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    result = users_col.update_one({"email": email}, {"$set": {"password_hash": new_hashed_pw}})
    
    if result.modified_count == 0:
        return {"error": "User not found.", "status": 404}
    
    # Cleanup
    otps_col.delete_one({"email": email})
    
    return {"success": "Password updated successfully. You can now log in.", "status": 200}

from utils.mailer import send_otp_email

# --- OTP-Based Login Flow (New) ---

def request_login_otp(email):
    """Generates and sends an OTP for login."""
    if users_col is None or otps_col is None:
        return {"error": "Database connection failure.", "status": 503}
    
    # Rate Limit Check (1 per 60 seconds)
    last_otp = otps_col.find_one({"email": email})
    if last_otp:
        elapsed = (datetime.datetime.utcnow() - last_otp['created_at']).total_seconds()
        if elapsed < 60:
            return {"error": f"Please wait {int(60 - elapsed)} seconds before resending.", "status": 429}

    otp = generate_otp()
    hashed_otp = bcrypt.hashpw(otp.encode('utf-8'), bcrypt.gensalt())
    expiry = datetime.datetime.utcnow() + datetime.timedelta(minutes=5)
    
    otps_col.update_one(
        {"email": email},
        {"$set": {
            "otp_hash": hashed_otp,
            "expires_at": expiry,
            "created_at": datetime.datetime.utcnow(),
            "attempts": 0
        }},
        upsert=True
    )
    
    # Send via real mailer
    mail_sent = send_otp_email(email, otp)
    if not mail_sent:
        return {"error": "Failed to deliver OTP. Please check your email address.", "status": 500}
    
    return {"success": "OTP sent successfully.", "status": 200}

def verify_login_otp(email, otp):
    """Verifies OTP and creates/logs in user."""
    if users_col is None or otps_col is None:
        return {"error": "Database connection failure.", "status": 503}
    
    otp_record = otps_col.find_one({"email": email})
    if not otp_record:
        return {"error": "Invalid or expired OTP session.", "status": 401}
    
    if datetime.datetime.utcnow() > otp_record['expires_at']:
        otps_col.delete_one({"email": email})
        return {"error": "OTP has expired.", "status": 401}
    
    if otp_record['attempts'] >= 3:
        otps_col.delete_one({"email": email})
        return {"error": "Too many failed attempts. Session locked.", "status": 403}

    if not bcrypt.checkpw(otp.encode('utf-8'), otp_record['otp_hash']):
        otps_col.update_one({"email": email}, {"$inc": {"attempts": 1}})
        return {"error": "Invalid OTP code.", "status": 401}
    
    # Success: Find or Create User
    user = users_col.find_one({"email": email})
    if not user:
        # Auto-create account
        name = email.split('@')[0].capitalize()
        user_id = users_col.insert_one({
            "email": email,
            "name": name,
            "created_at": datetime.datetime.utcnow(),
            "last_login": datetime.datetime.utcnow(),
            "is_active": True
        }).inserted_id
        user = users_col.find_one({"_id": user_id})
        logger.info(f"New user created via OTP: {email}")
    else:
        users_col.update_one({"_id": user["_id"]}, {"$set": {"last_login": datetime.datetime.utcnow()}})

    # Cleanup OTP
    otps_col.delete_one({"email": email})
    
    # Generate Tokens
    access_token, refresh_token = generate_tokens(str(user["_id"]), user["email"])
    
    return {
        "success": True,
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {"email": user['email'], "name": user.get('name', 'User')},
        "status": 200
    }

def get_user_by_id(user_id):
    """Fetches user profile data by ID."""
    if users_col is None: return None
    try:
        user = users_col.find_one({"_id": ObjectId(user_id)})
        if user:
            return {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user.get("name", "User"),
                "created_at": user.get("created_at")
            }
    except:
        return None
    return None

# --- Utilities ---

def generate_tokens(user_id, email):
    """Generates Access (1h) and Refresh (7d) tokens."""
    # Extend access token slightly for better UX (1 hour)
    access_token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'type': 'access',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, JWT_SECRET, algorithm='HS256')

    refresh_token = jwt.encode({
        'user_id': user_id,
        'email': email,
        'type': 'refresh',
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'jti': secrets.token_hex(16)
    }, REFRESH_SECRET, algorithm='HS256')

    if refresh_tokens_col is not None:
        refresh_tokens_col.update_one(
            {"user_id": user_id},
            {"$set": {"token_id": refresh_token, "created_at": datetime.datetime.utcnow()}},
            upsert=True
        )

    return access_token, refresh_token

def refresh_access_token(token):
    """Rotates access token if refresh token is valid."""
    try:
        payload = jwt.decode(token, REFRESH_SECRET, algorithms=['HS256'])
        if payload['type'] != 'refresh':
            return None
        
        user_id = payload['user_id']
        if refresh_tokens_col is None:
            return None
        stored = refresh_tokens_col.find_one({"user_id": user_id, "token_id": token})
        if not stored:
            return None
        
        return jwt.encode({
            'user_id': user_id,
            'email': payload['email'],
            'type': 'access',
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)
        }, JWT_SECRET, algorithm='HS256')
    except:
        return None

def save_history(user_id, feature, input_data, output_data):
    """Audits user activity."""
    if history_col is None: return
    if str(user_id).startswith("guest_"): return
    history_entry = {
        "user_id": user_id,
        "feature": feature,
        "input": str(input_data)[:500],
        "output": str(output_data)[:500],
        "timestamp": datetime.datetime.utcnow(),
        "ip_hidden": True 
    }
    history_col.insert_one(history_entry)

def get_user_history(user_id):
    """Fetches activity logs."""
    if history_col is None: return []
    history = list(history_col.find({"user_id": user_id}).sort("timestamp", -1).limit(50))
    for item in history:
        item['_id'] = str(item['_id'])
    return history
