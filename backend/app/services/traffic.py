import asyncio
import random
from datetime import datetime

live_data = {
    "parking": {},
    "shuttles": [],
    "traffic_flow": {}
}

async def run_traffic_simulation():
    """
    A smart, realistic simulation that runs in the background.
    It simulates daily cycles and cause-and-effect relationships.
    """
    print("Starting ADVANCED background simulation for traffic and mobility...")
    
    
    parking_levels = {
        "level_1": {"total": 200, "occupied": 10},
        "level_2": {"total": 200, "occupied": 5},
        "basement": {"total": 150, "occupied": 0},
    }
    shuttles_state = [
        {"id": "SHUTTLE_A", "lat": 21.5222, "lon": 70.4579, "direction": 1},
        {"id": "SHUTTLE_B", "lat": 21.5162, "lon": 70.4529, "direction": -1}
    ]
    traffic_hotspots = {
        "gate_a": {"name": "Gate A (Main Entrance)", "congestion": 0.1},
        "main_road_junction": {"name": "Main Road Junction", "congestion": 0.2},
    }

    while True:
        current_hour = datetime.now().hour

       
        if 6 <= current_hour < 11: 
            arrival_rate = random.randint(3, 8)
        elif 11 <= current_hour < 16: 
            arrival_rate = random.randint(-2, 2)
        elif 16 <= current_hour < 21:
            arrival_rate = random.randint(-8, -3)
        else: 
            arrival_rate = -10

        
        for level_id in ["level_1", "level_2", "basement"]:
            if parking_levels[level_id]["occupied"] < parking_levels[level_id]["total"]:
                parking_levels[level_id]["occupied"] = max(0, min(parking_levels[level_id]["total"], parking_levels[level_id]["occupied"] + arrival_rate))
                break
        
        overall_occupied = sum(p['occupied'] for p in parking_levels.values())
        overall_total = sum(p['total'] for p in parking_levels.values())
        parking_occupancy_percent = overall_occupied / overall_total if overall_total > 0 else 0
        best_level = min(parking_levels, key=lambda p: parking_levels[p]['occupied'] / parking_levels[p]['total'])
        
        live_data["parking"] = {
            "overall_available_slots": overall_total - overall_occupied,
            "recommended_level": best_level.replace("_", " ").title(),
            "levels": parking_levels
        }

        
        for shuttle in shuttles_state:
            shuttle["lat"] += 0.0001 * shuttle["direction"]
            shuttle["lon"] += 0.0001 * shuttle["direction"]
            if shuttle["lat"] > 21.5230 or shuttle["lat"] < 21.5160:
                shuttle["direction"] *= -1 
            
            
            if parking_occupancy_percent > 0.8:
                shuttle["occupied"] = random.randint(7, 10)
            else:
                shuttle["occupied"] = random.randint(2, 6)
        live_data["shuttles"] = shuttles_state

        
        base_congestion = 0.6 if 7 <= current_hour < 10 or 17 <= current_hour < 20 else 0.2
        for spot in traffic_hotspots.values():
            spot["congestion"] = round(max(0, min(1, base_congestion + random.uniform(-0.1, 0.1))), 2)

       
        if traffic_hotspots["main_road_junction"]["congestion"] > 0.8:
            traffic_hotspots["gate_a"]["congestion"] = min(1, traffic_hotspots["gate_a"]["congestion"] + 0.15)
        live_data["traffic_flow"] = traffic_hotspots
        
        print(f"Simulator: Data updated. Parking is {parking_occupancy_percent:.0%} full.")
        
        await asyncio.sleep(5)
