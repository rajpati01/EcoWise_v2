import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

def get_db():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    client = MongoClient(mongo_uri)
    return client["test"]
# The database name is set to "test" by default.