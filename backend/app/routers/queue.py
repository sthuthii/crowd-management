from fastapi import APIRouter
from pydantic import BaseModel
import random

router = APIRouter()

# Hardcoded queue lengths: normal + priority
queues = {
    "Temple Gate": {"normal": 12, "priority": 2},
    "Cafeteria": {"normal": 5, "priority": 1},
    "Restroom A": {"normal": 3, "priority": 0},
    "Restroom B": {"normal": 2, "priority": 1},
}

# Pydantic model for join/serve requests
class QueueUpdate(BaseModel):
    location: str
    type: str  # "normal" or "priority"

# GET current queues
@router.get("/")
async def get_queues():
    """
    Returns current queue lengths.
    Randomize normal queue only to simulate changes.
    """
    updated_queues = {}
    for loc, q in queues.items():
        normal = max(0, q["normal"] + random.randint(-2, 3))
        updated_queues[loc] = {"normal": normal, "priority": q["priority"]}
    return updated_queues

# POST join a queue
@router.post("/join")
async def join_queue(data: QueueUpdate):
    """
    Add a person to a queue at a location.
    """
    if data.location not in queues:
        return {"error": "Invalid location"}
    
    if data.type not in ["normal", "priority"]:
        return {"error": "Invalid queue type"}
    
    queues[data.location][data.type] += 1
    return {"message": f"You joined the {data.type} queue at {data.location}", "current_queue": queues[data.location]}

# POST serve next in queue
@router.post("/serve")
async def serve_next(data: QueueUpdate):
    """
    Serve next person in the queue. Priority or normal.
    """
    if data.location not in queues:
        return {"error": "Invalid location"}
    
    if data.type not in ["normal", "priority"]:
        return {"error": "Invalid queue type"}
    
    if queues[data.location][data.type] > 0:
        queues[data.location][data.type] -= 1
        served = data.type
    else:
        return {"message": f"{data.type.capitalize()} queue is empty", "current_queue": queues[data.location]}
    
    return {"message": f"Served one {served} visitor at {data.location}", "current_queue": queues[data.location]}
