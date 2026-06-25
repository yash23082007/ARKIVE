import sqlite3
import json
import os
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "arkive.db")

class SQLiteDB:
    @staticmethod
    def get_connection():
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    @staticmethod
    def init_db():
        """
        Initializes the tables if they do not exist.
        """
        conn = SQLiteDB.get_connection()
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS archives (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                original_text TEXT NOT NULL,
                compressed_bytes BLOB NOT NULL,
                codebook TEXT NOT NULL,
                bit_length INTEGER NOT NULL,
                knowledge_graph TEXT NOT NULL,
                bootstrap_data TEXT NOT NULL,
                survival_score INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)
        conn.commit()
        conn.close()

    @staticmethod
    def insert_archive(archive_id: str, title: str, original_text: str, compressed_bytes: bytes, 
                       codebook: Dict[str, str], bit_length: int, knowledge_graph: Dict[str, Any], 
                       bootstrap_data: Dict[str, Any], survival_score: int) -> bool:
        try:
            conn = SQLiteDB.get_connection()
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO archives (id, title, original_text, compressed_bytes, codebook, bit_length, knowledge_graph, bootstrap_data, survival_score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                archive_id,
                title,
                original_text,
                compressed_bytes,
                json.dumps(codebook),
                bit_length,
                json.dumps(knowledge_graph),
                json.dumps(bootstrap_data),
                survival_score
            ))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"SQLite error: {e}")
            return False

    @staticmethod
    def get_archive(archive_id: str) -> Optional[Dict[str, Any]]:
        conn = SQLiteDB.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM archives WHERE id = ?", (archive_id,))
        row = cursor.fetchone()
        conn.close()
        
        if not row:
            return None
            
        return {
            "id": row["id"],
            "title": row["title"],
            "original_text": row["original_text"],
            "compressed_bytes": row["compressed_bytes"],
            "codebook": json.loads(row["codebook"]),
            "bit_length": row["bit_length"],
            "knowledge_graph": json.loads(row["knowledge_graph"]),
            "bootstrap_data": json.loads(row["bootstrap_data"]),
            "survival_score": row["survival_score"],
            "created_at": row["created_at"]
        }

    @staticmethod
    def list_archives() -> List[Dict[str, Any]]:
        conn = SQLiteDB.get_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, title, survival_score, length(original_text) as size, created_at FROM archives ORDER BY created_at DESC")
        rows = cursor.fetchall()
        conn.close()
        
        return [
            {
                "id": row["id"],
                "title": row["title"],
                "survival_score": row["survival_score"],
                "original_size": row["size"],
                "created_at": row["created_at"]
            }
            for row in rows
        ]
        
    @staticmethod
    def delete_archive(archive_id: str) -> bool:
        try:
            conn = SQLiteDB.get_connection()
            cursor = conn.cursor()
            cursor.execute("DELETE FROM archives WHERE id = ?", (archive_id,))
            conn.commit()
            conn.close()
            return True
        except Exception as e:
            print(f"SQLite error: {e}")
            return False

# Self-initialize
SQLiteDB.init_db()
