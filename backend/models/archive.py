from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class IngestRequest(BaseModel):
    title: str = Field(..., description="Title of the knowledge archive")
    text: Optional[str] = Field(None, description="Raw text input")
    url: Optional[str] = Field(None, description="Web page URL to scrape")

class IngestResponse(BaseModel):
    title: str
    original_text: str
    char_count: int
    word_count: int
    chunks: List[Dict[str, Any]]

class EncodeRequest(BaseModel):
    title: str
    text: str
    has_redundancy: bool = True
    is_hardware_agnostic: bool = True

class EncodeResponse(BaseModel):
    archive_id: str
    title: str
    original_size_bytes: int
    compressed_size_bytes: int
    compression_ratio: float
    savings_percent: float
    survival_score: int
    math_anchors_count: int

class ArchiveSummary(BaseModel):
    id: str
    title: str
    survival_score: int
    original_size: int
    created_at: str

class SimulationStep(BaseModel):
    step: int
    title: str
    status: str
    log: str
    code: str
    data: Any

class SimulationResponse(BaseModel):
    archive_id: str
    title: str
    steps: List[SimulationStep]
