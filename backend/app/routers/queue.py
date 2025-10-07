from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import uuid
from datetime import datetime, timedelta
from app.database.db import get_db
from app.database import models
from ..database import schemas, db, models
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/queues")
def get_live_queues():
    return [
        {"id": "q_general", "name": "General Darshan", "wait_time_minutes": 75, "status": "High"},
        {"id": "q_vip", "name": "VIP Pass Holders", "wait_time_minutes": 15, "status": "Low"},
    ]

@router.post("/passes", response_model=schemas.DigitalPass)
def book_darshan_pass(pass_data: schemas.PassCreate, db: Session = Depends(db.get_db), current_user: models.User = Depends(get_current_user)):
    existing_pass = db.query(models.DigitalPass).filter(models.DigitalPass.user_id == current_user.id).first()
    if existing_pass:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has an active pass.")

    queue_map = {"q_general": "General Darshan", "q_vip": "VIP Pass Holders"}
    queue_name = queue_map.get(pass_data.queue_id, "Unknown Queue")

    pass_id = f"pass_{uuid.uuid4().hex[:8]}"
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={pass_id}"

    db_pass = models.DigitalPass(
        pass_id=pass_id, user_id=current_user.id, queue_name=queue_name,
        assigned_slot=datetime.utcnow() + timedelta(hours=2), qr_code_url=qr_code_url,
        owner=current_user
    )
    db.add(db_pass)
    db.commit()
    db.refresh(db_pass)
    return db_pass
@router.get("/passes/previous", response_model=schemas.DigitalPass)
def get_previous_pass(
    db: Session = Depends(db.get_db),
    current_user: models.User = Depends(get_current_user)
):
    existing_pass = db.query(models.DigitalPass).filter(
        models.DigitalPass.user_id == current_user.id
    ).order_by(models.DigitalPass.id.desc()).first()

    if not existing_pass:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No previous pass found.")

    return existing_pass
# Get currently booked pass for the logged-in user
@router.get("/passes/me", response_model=schemas.DigitalPass)
def get_my_pass(db: Session = Depends(db.get_db), current_user: models.User = Depends(get_current_user)):
    user_pass = db.query(models.DigitalPass).filter(models.DigitalPass.user_id == current_user.id).first()
    if not user_pass:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active pass found")
    return user_pass
