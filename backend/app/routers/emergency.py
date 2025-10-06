from fastapi import APIRouter
from typing import Dict
import random

router = APIRouter()

# Hardcoded emergency data
emergency_status: Dict[str, str] = {
    "Main Hall": "Safe",
    "Temple Gate": "Safe",
    "Cafeteria": "Safe",
    "Parking Lot": "Safe",
}

# Hardcoded exits per location
emergency_exits: Dict[str, list] = {
    "Main Hall": ["North Door", "South Door"],
    "Temple Gate": ["East Gate"],
    "Cafeteria": ["Back Door"],
    "Parking Lot": ["Exit 1", "Exit 2"],
}

@router.get("/status")
async def get_status():
    """
    Get current emergency status for all locations.
    """
    return emergency_status

@router.get("/exits/{location}")
async def get_exits(location: str):
    """
    Get emergency exits for a specific location.
    """
    if location not in emergency_exits:
        return {"error": "Invalid location"}
    return {"location": location, "exits": emergency_exits[location]}

@router.post("/alert/{location}")
async def trigger_alert(location: str):
    """
    Trigger an emergency alert at a location.
    Randomly simulate alert severity.
    """
    if location not in emergency_status:
        return {"error": "Invalid location"}
    
    emergency_status[location] = random.choice(["Safe", "Alert", "Critical"])
    return {
        "message": f"Alert triggered at {location}",
        "status": emergency_status[location]
    }
