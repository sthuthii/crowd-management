# backend/app/routers/emergency.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import schemas, models
from ..database.db import get_db
from .. import security 

router = APIRouter(
    prefix="/api/emergency",
    tags=["Emergency"]
)

@router.post("/", response_model=schemas.Emergency)
def create_emergency_alert(
    emergency: schemas.EmergencyCreate, db: Session = Depends(get_db)
):
    """
    Create a new emergency alert. This is the SOS trigger.
    """
    db_emergency = models.Emergency(**emergency.dict())
    db.add(db_emergency)
    db.commit()
    db.refresh(db_emergency)
    # In a real app, this would also trigger notifications to the admin dashboard.
    return db_emergency

@router.get("/", response_model=List[schemas.Emergency])
def get_active_emergencies(db: Session = Depends(get_db)):
    """
    Get a list of all active (not resolved) emergencies.
    """
    return db.query(models.Emergency).filter(models.Emergency.status != "resolved").all()

@router.get("/{emergency_id}", response_model=schemas.Emergency)
def get_emergency_by_id(emergency_id: int, db: Session = Depends(get_db)):
    """
    Get details of a specific emergency by its ID.
    """
    db_emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if db_emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")
    return db_emergency

@router.put("/{emergency_id}", response_model=schemas.Emergency)
def update_emergency_status(
    emergency_id: int,
    emergency_update: schemas.EmergencyUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(security.get_current_user)
):
    """
    Update the status or notes of an emergency (for admins).
    e.g., "dispatched", "resolved"
    """
    db_emergency = db.query(models.Emergency).filter(models.Emergency.id == emergency_id).first()
    if db_emergency is None:
        raise HTTPException(status_code=404, detail="Emergency not found")

    if emergency_update.status:
        db_emergency.status = emergency_update.status
    if emergency_update.notes:
        db_emergency.notes = emergency_update.notes

    db.commit()
    db.refresh(db_emergency)
    return db_emergency