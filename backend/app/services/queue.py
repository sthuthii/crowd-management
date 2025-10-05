import uuid
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from ..database import models, schemas

def create_pass_logic(db: Session, current_user: models.User, pass_data: schemas.PassCreate, queue_name: str):
    user = db.query(models.User).filter(models.User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"User with id {current_user.id} not found")

    pass_id = f"pass_{uuid.uuid4().hex[:8]}"
    qr_code_url = f"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={pass_id}"

    db_pass = models.DigitalPass(
        pass_id=pass_id,
        user_id=current_user.id,
        queue_name=queue_name,
        assigned_slot=datetime.utcnow() + timedelta(hours=2),
        qr_code_url=qr_code_url,
        owner=user
    )

    db.add(db_pass)
    db.commit()
    db.refresh(db_pass)

    return db_pass