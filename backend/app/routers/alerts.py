# backend/app/routers/alerts.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import schemas, models
from ..database.db import get_db

router = APIRouter(
    prefix="/api/alerts",
    tags=["Alerts"]
)

@router.post("/", response_model=schemas.Alert)
def create_alert(alert: schemas.AlertCreate, db: Session = Depends(get_db)):
    """
    Create a new broadcast alert (for admins).
    """
    db_alert = models.Alert(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

@router.get("/", response_model=List[schemas.Alert])
def get_active_alerts(db: Session = Depends(get_db)):
    """
    Get a list of the 10 most recent alerts (for devotees).
    """
    return db.query(models.Alert).order_by(models.Alert.timestamp.desc()).limit(10).all()