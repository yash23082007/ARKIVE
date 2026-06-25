from fastapi import APIRouter, Query, HTTPException
from backend.core.simulator_engine import CivilizationSimulator
from backend.db.mongodb import get_db
from bson import ObjectId

router = APIRouter()

@router.get("/steps")
def get_simulation_steps(archive_id: str = Query(None)):
    """Return all simulation steps for the archive (defaults to demo archive)."""
    if archive_id:
        db = get_db()
        try:
            query = {"id": archive_id}
            if ObjectId.is_valid(archive_id):
                query = {"$or": [{"id": archive_id}, {"_id": ObjectId(archive_id)}]}
            doc = db.archives.find_one(query)
            if not doc:
                raise HTTPException(404, "Archive not found for simulation")
            
            # Reconstruct customized civilization steps using concepts stored in DB
            concepts = doc.get("knowledge_nodes", [])
            concepts_list = [c["id"] for c in concepts]
            
            # Build simulation steps based on actual concept list
            sim = CivilizationSimulator(bytes([2,3,5,7,11,13,17,19]))
            steps = sim.run_simulation()
            
            # Map dynamic concepts into the matching layers for this custom simulation
            for step in steps:
                layer = step.get("layer")
                if layer is not None:
                    step["concepts_unlocked"] = [c["id"] for c in concepts if c.get("layer", 5) == layer]
            
            return {"steps": steps, "total": len(steps)}
        except Exception as e:
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(400, f"Simulation compilation failed: {e}")
            
    # Default Demo Simulation
    demo_archive = bytes([2, 3, 5, 7, 11, 13, 17, 19] + [0] * 100)
    sim = CivilizationSimulator(demo_archive)
    steps = sim.run_simulation()
    return {"steps": steps, "total": len(steps)}

@router.get("/step/{step_number}")
def get_step(step_number: int):
    demo_archive = bytes([2, 3, 5, 7, 11, 13, 17, 19] + [0] * 100)
    sim = CivilizationSimulator(demo_archive)
    sim.run_simulation()
    return sim.get_step(step_number)
