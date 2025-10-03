from fastapi import APIRouter, Query, HTTPException
from typing import List, Dict

router = APIRouter()

# Hardcoded graph (nodes = places, edges = connected paths with distances in meters)
graph = {
    "Main Hall": {"Temple Gate": 50, "Dining Area": 100},
    "Temple Gate": {"Main Hall": 50, "Parking": 120},
    "Dining Area": {"Main Hall": 100, "Garden": 80},
    "Garden": {"Dining Area": 80, "Parking": 150},
    "Parking": {"Temple Gate": 120, "Garden": 150},
}

def shortest_path(graph: Dict[str, Dict[str, int]], start: str, end: str):
    import heapq
    queue = [(0, start, [])]
    seen = set()
    while queue:
        (cost, node, path) = heapq.heappop(queue)
        if node in seen:
            continue
        path = path + [node]
        if node == end:
            return (cost, path)
        seen.add(node)
        for adj, weight in graph.get(node, {}).items():
            if adj not in seen:
                heapq.heappush(queue, (cost + weight, adj, path))
    return None

@router.get("/directions")
async def directions(
    start: str = Query(..., description="Starting location"),
    end: str = Query(..., description="Destination location")
):
    if start not in graph or end not in graph:
        raise HTTPException(status_code=400, detail="Invalid location")

    result = shortest_path(graph, start, end)
    if not result:
        raise HTTPException(status_code=404, detail="No path found")

    distance, path = result
    # Generate steps
    steps = []
    for i in range(len(path)-1):
        steps.append({
            "from": path[i],
            "to": path[i+1],
            "instruction": f"Go from {path[i]} to {path[i+1]}",
            "distance_m": graph[path[i]][path[i+1]]
        })

    return {
        "start": start,
        "end": end,
        "total_distance_m": distance,
        "steps": steps
    }
