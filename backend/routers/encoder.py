from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List, Dict, Any
from backend.core.concept_extractor import ConceptExtractor
from backend.core.rosetta_encoder import RosettaEncoder
from backend.db.mongodb import get_db
import datetime

router = APIRouter()
extractor = ConceptExtractor()
encoder = RosettaEncoder()

class ExtractRequest(BaseModel):
    text: str

class ArchiveRequest(BaseModel):
    title: str = "Civilization Archive"
    concepts: List[Dict[str, Any]]
    redundancy_level: int = 3

@router.post("/extract-concepts")
async def extract_concepts(request: ExtractRequest):
    if not request.text.strip():
        raise HTTPException(400, "Text cannot be empty")
    concepts = extractor.extract_concepts(request.text)
    return {"concepts": concepts, "count": len(concepts)}

@router.post("/generate-archive")
async def generate_archive(request: ArchiveRequest):
    """Generate .cmem archive file from concepts and store in DB."""
    if not request.concepts:
        raise HTTPException(400, "Concepts list cannot be empty")
        
    try:
        archive_bytes = encoder.generate_archive(request.concepts)
        
        # Calculate survival score on the fly
        from backend.core.simulator.survival_calc import calculate_survival_score
        survival = calculate_survival_score({
            'is_self_decoding': True,
            'format_simplicity_score': 80,
            'redundancy_count': request.redundancy_level,
            'uses_open_format': True,
            'math_anchor_count': sum(1 for c in request.concepts if c.get('layer', 5) <= 1),
            'is_decentralized': True
        })

        db = get_db()
        # Parse nodes and links for D3 force visualization
        nodes = []
        for c in request.concepts:
            nodes.append({
                "id": c["name"],
                "label": c["name"],
                "layer": c.get("layer", 5),
                "importance": c.get("importance", 5.0),
                "definition": c.get("definition", ""),
                "group": c.get("layer", 5)
            })

        # Resolve edges from prerequisites
        edges = []
        for c in request.concepts:
            for prereq in c.get("prerequisites", []):
                edges.append({
                    "source": prereq,
                    "target": c["name"],
                    "weight": 0.9
                })

        archive_doc = {
            "name": request.title,
            "created_at": datetime.datetime.utcnow().isoformat(),
            "original_size_bytes": sum(len(c.get("definition", "").encode("utf-8")) for c in request.concepts),
            "compressed_size_bytes": len(archive_bytes),
            "compression_ratio": round(sum(len(c.get("definition", "").encode("utf-8")) for c in request.concepts) / max(len(archive_bytes), 1), 2),
            "knowledge_nodes": nodes,
            "knowledge_edges": edges,
            "bootstrap": {
                "stages": [0, 1, 2, 3, 4, 5, 6],
                "prime_header": [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
            },
            "survival_score": survival,
            "math_anchor_count": survival.get("math_anchor_count", 0),
            "redundancy_level": request.redundancy_level,
            "raw_bytes": archive_bytes # store raw compiled binary bytes for download
        }
        
        result = db.archives.insert_one(archive_doc)
        archive_id = str(result.inserted_id)
        
        # Save back the string ID reference
        db.archives.update_one({"_id": result.inserted_id}, {"$set": {"id": archive_id}})

        return Response(
            content=archive_bytes,
            media_type="application/octet-stream",
            headers={
                "Content-Disposition": f"attachment; filename=civilization_archive_{archive_id}.cmem",
                "Access-Control-Expose-Headers": "X-Archive-ID",
                "X-Archive-ID": archive_id
            }
        )
    except Exception as e:
        raise HTTPException(500, f"Archive compilation failed: {str(e)}")
