from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(
    prefix="/priority",
    tags=["Priority Services"]
)

# Schema for a priority service
class PriorityService(BaseModel):
    id: int
    name: str
    coords: List[float]  # [lat, lng] renamed to match frontend
    type: str            # e.g., "elderly", "differently-abled"
    info: str

# Sample data (replace with DB fetch later)
PRIORITY_SERVICES = [
    {
        "id": 1,
        "name": "Elderly Queue",
        "coords": [12.915, 74.856],
        "type": "elderly",
        "info": "Shorter wait for elderly pilgrims"
    },
    {
        "id": 2,
        "name": "Wheelchair Ramp",
        "coords": [12.916, 74.857],
        "type": "differently-abled",
        "info": "Accessible ramp to temple garden"
    },
    {
        "id": 3,
        "name": "Priority Darshan Line",
        "coords": [12.914, 74.855],
        "type": "priority",
        "info": "Special darshan line for priority users"
    }
]

@router.get("/", response_model=List[PriorityService])
async def get_priority_services():
    """
    Get all priority services / special facilities for pilgrims.
    """
    return PRIORITY_SERVICES

@router.get("/prioritize")
async def prioritize(entity: str):
    """
    Return priority level for a specific entity.
    """
    # For now, everything is high priority
    return {"entity": entity, "priority": "high"}
