from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import encoder, archive, simulator, graph
from backend.db.mongodb import connect_db

app = FastAPI(
    title="Civilization Memory OS API",
    description="Encode human knowledge for civilizational survival",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    try:
        await connect_db()
    except Exception as e:
        print(f"Warning: Database startup failed: {e}. Running offline.")

app.include_router(encoder.router,   prefix="/api/encoder",   tags=["Encoder"])
app.include_router(archive.router,   prefix="/api/archive",   tags=["Archive"])
app.include_router(simulator.router, prefix="/api/simulator", tags=["Simulator"])
app.include_router(graph.router,     prefix="/api/graph",     tags=["Graph"])

@app.get("/")
def root():
    return {
        "name": "Civilization Memory OS",
        "version": "1.0.0",
        "tagline": "The survival protocol for human knowledge"
    }

@app.get("/health")
def health():
    return {"status": "alive", "service": "ARKIVE"}
