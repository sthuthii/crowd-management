from fastapi import APIRouter
from typing import Dict
import random

router = APIRouter()

# Hardcoded traffic data (people/vehicles per location)
traffic_data = {
    "Main Hall": {"pedestrians": 30, "vehicles": 5},
    "Temple Gate": {"pedestrians": 50, "vehicles": 2},
    "Cafeteria": {"pedestrians": 20, "vehicles": 0},
    "Parking Lot": {"pedestrians": 10, "vehicles": 15},
}

@router.get("/traffic")
async def get_traffic():
    """
    Returns simulated traffic data, with slight random variations to mimic real-time changes.
    """
    updated = {}
    for loc, t in traffic_data.items():
        updated[loc] = {
            "pedestrians": max(0, t["pedestrians"] + random.randint(-5, 5)),
            "vehicles": max(0, t["vehicles"] + random.randint(-2, 2)),
        }
    return updated
