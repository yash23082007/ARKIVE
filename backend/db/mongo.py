import os
from typing import Optional, Dict, Any, List
import pymongo
from pymongo.errors import ConnectionFailure

# Read connection string from environment
MONGODB_URI = os.getenv("MONGODB_URI", "")
DB_NAME = "arkive_db"

class MongoDB:
    client: Optional[pymongo.MongoClient] = None
    db = None
    use_fallback: bool = True

    @classmethod
    def connect(cls) -> bool:
        if not MONGODB_URI:
            cls.use_fallback = True
            return False
        try:
            cls.client = pymongo.MongoClient(MONGODB_URI, serverSelectionTimeoutMS=2000)
            # Verify connection
            cls.client.admin.command('ping')
            cls.db = cls.client[DB_NAME]
            cls.use_fallback = False
            print("Successfully connected to MongoDB Atlas.")
            return True
        except (ConnectionFailure, Exception) as e:
            print(f"MongoDB connection failed: {e}. Falling back to SQLite local database.")
            cls.use_fallback = True
            return False

    @classmethod
    def save_archive(cls, archive_data: Dict[str, Any]) -> bool:
        if cls.use_fallback or cls.db is None:
            # Save binary content in sqlite
            from backend.db.sqlite_fallback import SQLiteDB
            return SQLiteDB.insert_archive(
                archive_data["id"],
                archive_data["title"],
                archive_data["original_text"],
                archive_data["compressed_bytes"],
                archive_data["codebook"],
                archive_data["bit_length"],
                archive_data["knowledge_graph"],
                archive_data["bootstrap_data"],
                archive_data["survival_score"]
            )
        try:
            # For MongoDB, serialize binary bytes to BSON Binary
            bson_data = dict(archive_data)
            bson_data["compressed_bytes"] = pymongo.binary.Binary(archive_data["compressed_bytes"])
            cls.db.archives.insert_one(bson_data)
            return True
        except Exception as e:
            print(f"MongoDB save failed: {e}")
            return False

    @classmethod
    def get_archive(cls, archive_id: str) -> Optional[Dict[str, Any]]:
        if cls.use_fallback or cls.db is None:
            from backend.db.sqlite_fallback import SQLiteDB
            return SQLiteDB.get_archive(archive_id)
        try:
            doc = cls.db.archives.find_one({"id": archive_id})
            if doc:
                # Convert BSON Binary back to Python bytes
                doc["compressed_bytes"] = bytes(doc["compressed_bytes"])
                if "_id" in doc:
                    del doc["_id"]
                return doc
            return None
        except Exception as e:
            print(f"MongoDB fetch failed: {e}")
            return None

    @classmethod
    def list_archives(cls) -> List[Dict[str, Any]]:
        if cls.use_fallback or cls.db is None:
            from backend.db.sqlite_fallback import SQLiteDB
            return SQLiteDB.list_archives()
        try:
            cursor = cls.db.archives.find({}, {"id": 1, "title": 1, "survival_score": 1, "original_text": 1, "created_at": 1})
            archives = []
            for doc in cursor:
                archives.append({
                    "id": doc["id"],
                    "title": doc["title"],
                    "survival_score": doc.get("survival_score", 0),
                    "original_size": len(doc.get("original_text", "")),
                    "created_at": doc.get("created_at", "")
                })
            return archives
        except Exception as e:
            print(f"MongoDB list failed: {e}")
            return []

# Initialize connection
MongoDB.connect()
