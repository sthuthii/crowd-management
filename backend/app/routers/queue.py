from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.database import schemas

router = APIRouter(prefix="/api", tags=["Queue Management"])

# 🧠 Temporary in-memory storage for demo purposes
fake_passes = [
    {
        "id": 1,
        "queue_number": "Q001",
        "issued_time": "2025-10-09T18:30:00",
        "user_name": "Sthuthi",
        "status": "active"
    },
    {
        "id": 2,
        "queue_number": "Q002",
        "issued_time": "2025-10-09T18:45:00",
        "user_name": "Sathwik",
        "status": "waiting"
    }
]

# ✅ Add this missing route
@router.get("/queues")
def get_live_queues():
    return [
        {"id": "q_general", "name": "General Darshan", "wait_time_minutes": 75, "status": "High"},
        {"id": "q_vip", "name": "VIP Pass Holders", "wait_time_minutes": 15, "status": "Low"},
    ]

# ✅ Create new digital pass (hardcoded for testing)
@router.post("/passes", response_model=schemas.DigitalPass)
def create_pass(db: Session = Depends(get_db)):
    new_pass = schemas.DigitalPass(
        id=len(fake_passes) + 1,
        queue_number=f"Q00{len(fake_passes) + 1}",
        issued_time="2025-10-09T19:00:00",
        user_name="TestUser",
        status="active"
    )
    fake_passes.append(new_pass.dict())
    return new_pass

# ✅ Get all passes (hardcoded)
@router.get("/passes", response_model=list[schemas.DigitalPass])
def get_passes(db: Session = Depends(get_db)):
    return fake_passes

# ✅ Get a specific pass by ID
@router.get("/passes/{pass_id}", response_model=schemas.DigitalPass)
def get_pass(pass_id: int, db: Session = Depends(get_db)):
    for p in fake_passes:
        if p["id"] == pass_id:
            return p
    raise HTTPException(status_code=404, detail="Pass not found")

# ✅ Delete a pass (for testing)
@router.delete("/passes/{pass_id}", response_model=dict)
def delete_pass(pass_id: int, db: Session = Depends(get_db)):
    global fake_passes
    fake_passes = [p for p in fake_passes if p["id"] != pass_id]
    return {"message": f"Pass {pass_id} deleted successfully"}
