import os
import sys
from dotenv import load_dotenv

load_dotenv()

class Config:
    def __init__(self):
        self.REQUIRED_VARS = [
            "MONGO_URI",
            "JWT_SECRET",
            "REFRESH_SECRET",
            "SESSION_SECRET",
            "GEMINI_API_KEY"
        ]
        self.validate()

    def validate(self):
        missing = [var for var in self.REQUIRED_VARS if not os.getenv(var)]
        if missing:
            print(f"\n[!] SECURITY CONFIGURATION ERROR")
            print(f"Missing required environment variables: {', '.join(missing)}")
            print("The system cannot start in an insecure state.\n")
            sys.exit(1)

        # Basic health check for secrets strength
        jwt_secret = os.getenv("JWT_SECRET")
        if len(jwt_secret) < 32:
            print("[WARNING] JWT_SECRET is too short. Use at least 32 characters for enterprise security.")

    @property
    def mongo_uri(self):
        return os.getenv("MONGO_URI")

    @property
    def debug_mode(self):
        # Default to False for production safety
        return os.getenv("DEBUG", "False").lower() == "true"

config = Config()
