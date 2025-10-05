from fastapi import APIRouter
from app.services.traffic import live_data  # <-- use absolute import

router = APIRouter()

@router.get("/parking")
def get_parking_status():
    """Provides intelligent parking guidance from the live in-memory simulator."""
    return live_data.get("parking", {"error": "Parking data not available yet."})

@router.get("/shuttle")
def get_shuttle_status():
    """Provides live shuttle coordinates from the in-memory simulator."""
    return live_data.get("shuttles", [])

@router.get("/traffic-advisory")
def get_traffic_advisory():
    """Analyzes live traffic flow from memory and generates an advisory for police integration."""
    hotspots = live_data.get("traffic_flow")
    if not hotspots:
        return {"error": "Traffic data not available yet."}

    severity = "Low"
    advisory_message = "Traffic is flowing smoothly. No action required."
    action_code = "GREEN"
    
    if hotspots.get('gate_a', {}).get('congestion', 0) > 0.8:
        severity = "High"
        advisory_message = "Critical congestion at Gate A. Recommend dispatching unit to reroute traffic towards Gate B."
        action_code = "RED"
    elif hotspots.get('main_road_junction', {}).get('congestion', 0) > 0.7:
        severity = "Medium"
        advisory_message = "Moderate congestion building at Main Road Junction. Suggest adjusting traffic signal timing."
        action_code = "YELLOW"

    return {
        "severity": severity,
        "advisory_message": advisory_message,
        "action_code": action_code,
        "live_data": hotspots
    }
