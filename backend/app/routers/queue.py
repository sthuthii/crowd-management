from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ..database import schemas, db, models
from ..services import queue as queue_service
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/queues", response_model=list[schemas.Queue])
def get_live_queues():
    """
    Provides a live list of all major queues and their current wait times.
    """
    # Calls the service to get the data
    return queue_service.get_all_queues_logic()

@router.post("/passes", response_model=schemas.DigitalPass)
def book_darshan_pass(pass_data: schemas.PassCreate, db: Session = Depends(db.get_db), current_user: models.User = Depends(get_current_user)):
    """
    Allows a logged-in pilgrim to book a new digital darshan pass.
    """
    # Check for existing pass
    existing_pass = db.query(models.DigitalPass).filter(models.DigitalPass.user_id == current_user.id).first()
    if existing_pass:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has an active pass.")

    queue_map = {"q_general": "General Darshan", "q_vip": "VIP Pass Holders"}
    queue_name = queue_map.get(pass_data.queue_id, "Unknown Queue")
    
    # Calls the service to create the pass in the database
    return queue_service.create_pass_logic(db=db, current_user=current_user, pass_data=pass_data, queue_name=queue_name)