import random
import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from ..database import models, schemas

def get_all_queues_logic():
    """
    Simulates fetching live queue data.
    """
    return [
        {"id": "q_general", "name": "General Darshan", "wait_time_minutes": random.randint(45, 75), "status": "High"},
        {"id": "q_vip", "name": "VIP Pass Holders", "wait_time_minutes": random.randint(10, 15), "status": "Low"},
    ]

def create_pass_logic(db: Session, current_user: models.User, pass_data: schemas.PassCreate, queue_name: str):
    """
    Creates a new digital pass, saves it to the database for the current user, and returns it.
    """
    pass_id = f"pass_{uuid.uuid4().hex[:8]}"
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={pass_id}"
    
    db_pass = models.DigitalPass(
        pass_id=pass_id,
        user_id=current_user.id,
        queue_name=queue_name,
        assigned_slot=datetime.utcnow() + timedelta(hours=2),
        qr_code_url=qr_code_url,
        owner=current_user
    )
    
    db.add(db_pass)
    db.commit()
    db.refresh(db_pass)
    
    return db_pass