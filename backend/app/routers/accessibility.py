from fastapi import APIRouter

router = APIRouter()

# Hardcoded accessibility info
accessibility_info = {
    "Main Hall": {"ramps": True, "priority_entrance": True},
    "Temple Gate": {"ramps": False, "priority_entrance": True},
    "Cafeteria": {"ramps": True, "priority_entrance": False},
    "Restroom A": {"accessible": True},
    "Restroom B": {"accessible": False},
}

@router.get("/accessibility")
async def get_accessibility():
    """
    Returns accessibility information for all locations.
    """
    return accessibility_info
