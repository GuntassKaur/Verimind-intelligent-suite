from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/verimind")

try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
    client.admin.command('ping')
    print("MongoDB Connected successfully!")
except Exception as e:
    print(f"MongoDB Connection Failed: {e}")
