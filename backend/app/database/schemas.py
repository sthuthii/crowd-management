# backend/app/database/schemas.py

from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- Lost and Found Schemas ---
class LostAndFoundItemBase(BaseModel):
    item_name: str
    category: str
    description: str
    location: str
    reporter_name: str
    contact: str

class LostAndFoundItemCreate(LostAndFoundItemBase):
    status: str = "lost"

class LostAndFoundItemUpdate(BaseModel):
    status: Optional[str] = None

class LostAndFoundItem(LostAndFoundItemBase):
    id: int
    date: datetime
    status: str

    class Config:
        from_attributes = True # <-- CHANGE HERE

# --- Emergency Schemas ---
class EmergencyBase(BaseModel):
    user_id: str
    latitude: float
    longitude: float
    emergency_type: Optional[str] = "General"
    notes: Optional[str] = None

class EmergencyCreate(EmergencyBase):
    pass

class EmergencyUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class Emergency(EmergencyBase):
    id: int
    timestamp: datetime
    status: str

    class Config:
        from_attributes = True # <-- AND CHANGE HERE