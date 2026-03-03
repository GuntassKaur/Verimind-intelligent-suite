import os
import jwt
import datetime
import bcrypt
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Setup
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/verimind")
client = MongoClient(MONGO_URI)
db = client.get_database()
users_col = db.users
users_col.create_index("email", unique=True) # Essential indexing optimization
history_col = db.history
otps_col = db.otps # New collection for OTPs

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_key")

def generate_otp():
    """Generates a 6-digit random OTP."""
    import random
    return "".join([str(random.randint(0, 9)) for _ in range(6)])

def request_password_reset(email):
    """Generates an OTP, hashes it, and stores it in DB with expiry."""
    user = users_col.find_one({"email": email})
    if not user:
        return {"error": "Email not found"}
    
    # Check if there's a recent OTP (limit resend to 60s)
    last_otp = otps_col.find_one({"email": email})
    if last_otp:
        elapsed = (datetime.datetime.utcnow() - last_otp['created_at']).total_seconds()
        if elapsed < 60:
            return {"error": f"Please wait {int(60 - elapsed)} seconds before resending."}

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
    
    # Fast async simulated email sending to prevent UI blocking
    import threading
    def send_simulated_email(recipient, code):
        import time
        time.sleep(1) # Simulate network jump
        html_email = f"""
        <html>
            <body>
                <div style="text-align: center; padding: 20px;">
                    <svg viewBox="0 0 100 100" width="48" height="48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="vgradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#818cf8"/>
                                <stop offset="100%" stopColor="#4f46e5"/>
                            </linearGradient>
                        </defs>
                        <path d="M50 5L90 25V75L50 95L10 75V25L50 5Z" stroke="url(#vgradient)" stroke-width="8" stroke-linejoin="round"/>
                        <path d="M30 35L50 65L70 35" stroke="white" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <h2>VeriMind Security</h2>
                    <p>Your OTP code is: <b>{code}</b></p>
                </div>
            </body>
        </html>
        """
        print(f"\n[SIMULATED HTML EMAIL SENT TO {recipient}]\n{html_email}\n")
        
    threading.Thread(target=send_simulated_email, args=(email, otp)).start()
    
    return {"success": "OTP sent to your email."}

def verify_otp_and_reset_password(email, otp, new_password):
    """Verifies OTP and resets password if valid."""
    otp_record = otps_col.find_one({"email": email})
    if not otp_record:
        return {"error": "Invalid or expired OTP."}
    
    if datetime.datetime.utcnow() > otp_record['expires_at']:
        otps_col.delete_one({"email": email})
        return {"error": "OTP has expired."}
    
    if otp_record['attempts'] >= 5:
        otps_col.delete_one({"email": email})
        return {"error": "Too many failed attempts. Please request a new OTP."}

    if not bcrypt.checkpw(otp.encode('utf-8'), otp_record['otp_hash']):
        otps_col.update_one({"email": email}, {"$inc": {"attempts": 1}})
        return {"error": "Invalid OTP code."}
    
    # Valid OTP - Reset password
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt())
    users_col.update_one({"email": email}, {"$set": {"password": hashed_password}})
    
    # Invalidate OTP after use
    otps_col.delete_one({"email": email})
    
    return {"success": "Password updated successfully."}

def register_user(email, password, name):
    """Registers a new user."""
    if users_col.find_one({"email": email}):
        return {"error": "Email already exists"}
    
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
    user_data = {
        "email": email,
        "password": hashed_password,
        "name": name,
        "created_at": datetime.datetime.utcnow()
    }
    users_col.insert_one(user_data)
    return {"success": True}

def login_user(email, password):
    """Logs in a user and returns a JWT token."""
    user = users_col.find_one({"email": email})
    if not user:
        return {"error": "User not found"}
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, JWT_SECRET, algorithm='HS256')
        return {"token": token, "user": {"email": user['email'], "name": user['name']}}
    
    return {"error": "Invalid password"}

def save_history(user_id, feature, input_data, output_data):
    """Saves action to history."""
    history_entry = {
        "user_id": user_id, # Can be 'guest_session_id' or MongoDB ID
        "feature": feature,
        "input": input_data,
        "output": output_data,
        "timestamp": datetime.datetime.utcnow()
    }
    history_col.insert_one(history_entry)

def get_user_history(user_id):
    """Gets history for a specific user."""
    history = list(history_col.find({"user_id": user_id}).sort("timestamp", -1).limit(50))
    for item in history:
        item['_id'] = str(item['_id'])
    return history
