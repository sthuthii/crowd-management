from pydantic import BaseModel
from typing import Optional

class CrowdPredictionIn(BaseModel):
    source: Optional[str] = None  # e.g., camera id
    filename: Optional[str] = None

class CrowdPredictionOut(BaseModel):
    count: int
    source: Optional[str]

class TrafficIn(BaseModel):
    location: str

class QueueIn(BaseModel):
    queue_name: str
