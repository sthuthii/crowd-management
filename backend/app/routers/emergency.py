from fastapi import APIRouter
from typing import Dict
import random

router = APIRouter()

# Hardcoded emergency data
emergency_status = {
    "Main Hall": "Safe",
    "Temple Gate": "Safe",
    "Cafeteria": "Safe",
    "Parking Lot": "Safe",
}

# Hardcoded exits per location
emergency_exits = {
    "Main Hall": ["North Door", "South Door"],
    "Temple Gate": ["East Gate"],
    "Cafeteria": ["Back Door"],
    "Parking Lot": ["Exit 1", "Exit 2"],
}

@router.get("/status")
async def get_status():
    """
    Returns current emergency status for all locations.
    """
    return emergency_status

@router.get("/exits/{location}")
async def get_exits(location: str):
    """
    Returns emergency exits for a specific location.
    """
    if location not in emergency_exits:
        return {"error": "Invalid location"}
    return {"exits": emergency_exits[location]}

@router.post("/alert/{location}")
async def trigger_alert(location: str):
    """
    Trigger an emergency alert at a location.
    """
    if location not in emergency_status:
        return {"error": "Invalid location"}
    
    # Randomly simulate severity
    emergency_status[location] = random.choice(["Safe", "Alert", "Critical"])
    return {"message": f"Alert triggered at {location}", "status": emergency_status[location]}
