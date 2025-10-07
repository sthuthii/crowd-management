# backend/app/database/schemas.py

from pydantic import BaseModel,Field
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
        from_attributes = True

# --- Emergency Schemas ---
class EmergencyBase(BaseModel):
    user_id: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
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
        from_attributes = True

# --- Alert Schemas ---
class AlertBase(BaseModel):
    message: str
    severity: str = "info"

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    id: int
    timestamp: datetime

    class Config:
        from_attributes = True


# --- User Schemas ---
class UserBase(BaseModel):
    username: str

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=72)
    role: str = "admin"

class User(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


# --- Exit Schema (UPDATED) ---
class Exit(BaseModel):
    name: str
    # --- ADDED THESE TWO LINES ---
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    class Config:
        from_attributes = True