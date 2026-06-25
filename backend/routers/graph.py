from fastapi import APIRouter, HTTPException
from backend.db.mongodb import get_db
from backend.core.knowledge_graph import KnowledgeGraph

router = APIRouter()

@router.get("/")
def get_full_graph():
    db = get_db()
    try:
        concepts = list(db.concepts.find({}, {"_id": 0}))
        relationships = list(db.relationships.find({}, {"_id": 0}))

        kg = KnowledgeGraph()
        
        # Hydrate NetworkX directed graph
        for c in concepts:
            # Clean concept definition and details
            kg.add_concept({
                "name": c["name"],
                "layer": c.get("layer", 5),
                "importance": c.get("importance", 5.0),
                "definition": c.get("definition", ""),
                "prerequisites": c.get("prerequisites", [])
            })
            
        # Re-resolve strengths
        for r in relationships:
            u, v = r.get("from_concept"), r.get("to_concept")
            if kg.graph.has_node(u) and kg.graph.has_node(v):
                kg.graph.add_edge(u, v, weight=r.get("strength", 0.5))

        return kg.export_for_visualization()
    except Exception as e:
        raise HTTPException(500, f"Failed to compile knowledge graph: {str(e)}")

@router.get("/search/{query}")
def search_concepts(query: str):
    db = get_db()
    try:
        # Check text search indexes
        results = list(db.concepts.find(
            {"$text": {"$search": query}},
            {"score": {"$meta": "textScore"}, "_id": 0}
        ).sort([("score", {"$meta": "textScore"})]).limit(10))
        
        # If text index is not fully warmed up or returned empty, do a simple regex fallback
        if not results:
            regex_query = {"$regex": query, "$options": "i"}
            fallback_cursor = db.concepts.find(
                {"$or": [{"name": regex_query}, {"definition": regex_query}]},
                {"_id": 0}
            ).limit(10)
            results = list(fallback_cursor)
            
        return {"results": results}
    except Exception as e:
        # Fallback to regex in case of search score exception index issues
        db = get_db()
        regex_query = {"$regex": query, "$options": "i"}
        fallback_cursor = db.concepts.find(
            {"$or": [{"name": regex_query}, {"definition": regex_query}]},
            {"_id": 0}
        ).limit(10)
        return {"results": list(fallback_cursor)}
