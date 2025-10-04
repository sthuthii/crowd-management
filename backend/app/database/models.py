# In backend/app/database/models.py

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    passes = relationship("DigitalPass", back_populates="owner")

class DigitalPass(Base):
    __tablename__ = "digital_passes"
    pass_id = Column(String, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    queue_name = Column(String)
    assigned_slot = Column(DateTime)
    qr_code_url = Column(String)
    owner = relationship("User", back_populates="passes")

# --- ADD THIS MISSING MODEL ---
class Queue(Base):
    __tablename__ = "queues"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    wait_time_minutes = Column(Integer, default=0)
    status = Column(String, default="Low")