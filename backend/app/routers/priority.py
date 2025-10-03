from fastapi import APIRouter

router = APIRouter()

@router.get("/prioritize")
async def prioritize(entity: str):
    # stub for priority-based movement
    return {"entity": entity, "priority": "high"}
