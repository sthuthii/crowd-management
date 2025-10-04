# backend/app/database/models.py

from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from .db import Base

class LostAndFoundItem(Base):
    __tablename__ = "lost_and_found_items"

    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True)
    category = Column(String)
    description = Column(String)
    location = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="lost")  # lost, found, returned
    reporter_name = Column(String)
    contact = Column(String)

# NEW: Add the Emergency model
class Emergency(Base):
    __tablename__ = "emergencies"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True) # Could be a device ID or a logged-in user ID
    emergency_type = Column(String, default="General") # e.g., Medical, Lost Child, Security
    latitude = Column(Float)
    longitude = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="reported") # reported, dispatched, resolved
    notes = Column(String, nullable=True)

 # ... (at the end of the file)

# NEW: Add the Alert model
class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    severity = Column(String, default="info")  # e.g., 'info', 'warning', 'critical'
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    
#Authentication and authorization
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="admin") # e.g., 'admin', 'security'       