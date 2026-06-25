from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse, Response
from backend.db.mongodb import get_db
from bson import ObjectId
import io

router = APIRouter()

@router.get("/")
def list_archives():
    db = get_db()
    cursor = db.archives.find({}, {"name": 1, "created_at": 1, "survival_score": 1, "original_size_bytes": 1, "compressed_size_bytes": 1, "compression_ratio": 1})
    archives = []
    for doc in cursor:
        doc_id = str(doc["_id"])
        archives.append({
            "id": doc_id,
            "name": doc.get("name", "Unnamed Archive"),
            "created_at": doc.get("created_at"),
            "survival_score": doc.get("survival_score", {}),
            "original_size_bytes": doc.get("original_size_bytes", 0),
            "compressed_size_bytes": doc.get("compressed_size_bytes", 0),
            "compression_ratio": doc.get("compression_ratio", 1.0)
        })
    return archives

@router.get("/{archive_id}")
def get_archive(archive_id: str):
    db = get_db()
    try:
        # Check by string ID or ObjectId
        query = {"id": archive_id}
        if ObjectId.is_valid(archive_id):
            query = {"$or": [{"id": archive_id}, {"_id": ObjectId(archive_id)}]}
            
        doc = db.archives.find_one(query)
        if not doc:
            raise HTTPException(404, "Archive not found")
            
        return {
            "id": str(doc["_id"]),
            "name": doc.get("name"),
            "created_at": doc.get("created_at"),
            "original_size_bytes": doc.get("original_size_bytes"),
            "compressed_size_bytes": doc.get("compressed_size_bytes"),
            "compression_ratio": doc.get("compression_ratio"),
            "knowledge_nodes": doc.get("knowledge_nodes", []),
            "knowledge_edges": doc.get("knowledge_edges", []),
            "survival_score": doc.get("survival_score"),
            "math_anchor_count": doc.get("math_anchor_count", 0),
            "redundancy_level": doc.get("redundancy_level", 3)
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(400, f"Invalid archive request: {str(e)}")

@router.get("/{archive_id}/download")
def download_archive(archive_id: str):
    db = get_db()
    try:
        query = {"id": archive_id}
        if ObjectId.is_valid(archive_id):
            query = {"$or": [{"id": archive_id}, {"_id": ObjectId(archive_id)}]}
            
        doc = db.archives.find_one(query)
        if not doc or "raw_bytes" not in doc:
            raise HTTPException(404, "Archive raw bytes not found")
            
        binary_io = io.BytesIO(bytes(doc["raw_bytes"]))
        filename = f"civilization_archive_{archive_id}.cmem"
        
        return StreamingResponse(
            binary_io,
            media_type="application/octet-stream",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(400, f"Download failure: {str(e)}")

@router.delete("/{archive_id}")
def delete_archive(archive_id: str):
    db = get_db()
    try:
        query = {"id": archive_id}
        if ObjectId.is_valid(archive_id):
            query = {"$or": [{"id": archive_id}, {"_id": ObjectId(archive_id)}]}
            
        result = db.archives.delete_one(query)
        if result.deleted_count == 0:
            raise HTTPException(404, "Archive not found for deletion")
        return {"status": "success", "message": "Archive successfully removed"}
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(400, f"Delete failure: {str(e)}")
