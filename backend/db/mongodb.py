import os
from pymongo import MongoClient, TEXT, ASCENDING
from pymongo.server_api import ServerApi
from motor.motor_asyncio import AsyncIOMotorClient

# Global async references
client = None
db = None

async def connect_db():
    global client, db
    mongo_uri = os.getenv("MONGODB_URI")
    client = AsyncIOMotorClient(mongo_uri)
    db = client.civilization_memory_os
    print("Connected to MongoDB Atlas (Async Motor Client)")
    
    # Pre-build index checks async
    await db.concepts.create_index([("name", "text"), ("definition", "text")])
    await db.concepts.create_index([("layer", 1)])
    await db.concepts.create_index([("importance", 1)])

# Sync fallback reference (for seeding and sync functions)
_sync_client = None
_sync_db = None

def get_db():
    global _sync_client, _sync_db
    if _sync_db is None:
        mongo_uri = os.getenv("MONGODB_URI")
        _sync_client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        _sync_db = _sync_client["civilization_memory_os"]
        _create_indexes(_sync_db)
    return _sync_db

def _create_indexes(sync_db):
    try:
        sync_db.concepts.create_index([("name", TEXT), ("definition", TEXT)])
        sync_db.concepts.create_index([("layer", ASCENDING)])
        sync_db.concepts.create_index([("importance", ASCENDING)])
    except Exception as e:
        print(f"Index creation notice: {e}")
