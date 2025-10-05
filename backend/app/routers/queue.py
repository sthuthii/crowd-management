from fastapi import APIRouter
from typing import Dict
import random

router = APIRouter()

# Hardcoded queue lengths: normal + priority
queues = {
    "Temple Gate": {"normal": 12, "priority": 2},
    "Cafeteria": {"normal": 5, "priority": 1},
    "Restroom A": {"normal": 3, "priority": 0},
    "Restroom B": {"normal": 2, "priority": 1},
}

@router.get("/queues")
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

@router.post("/join-queue/{location}")
async def join_queue(location: str, priority: bool = False):
    """
    Add a person to a queue at a location.
    Priority=True → priority queue
    """
    if location not in queues:
        return {"error": "Invalid location"}
    
    if priority:
        queues[location]["priority"] += 1
        qtype = "priority"
    else:
        queues[location]["normal"] += 1
        qtype = "normal"

    return {"message": f"You joined the {qtype} queue at {location}", "current_queue": queues[location]}

@router.post("/leave-queue/{location}")
async def leave_queue(location: str):
    """
    Serve next person in the queue. Priority first.
    """
    if location not in queues:
        return {"error": "Invalid location"}
    
    if queues[location]["priority"] > 0:
        queues[location]["priority"] -= 1
        served = "priority"
    elif queues[location]["normal"] > 0:
        queues[location]["normal"] -= 1
        served = "normal"
    else:
        return {"message": "Queue is empty", "current_queue": queues[location]}

    return {"message": f"Served one {served} visitor at {location}", "current_queue": queues[location]}
