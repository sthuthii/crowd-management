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
        from_attributes = True # <-- CHANGE HERE

# --- Emergency Schemas ---
class EmergencyBase(BaseModel):
    user_id: str
    latitude: Optional[float] = None  # <-- CHANGE HERE
    longitude: Optional[float] = None # <-- CHANGE HERE
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

  # ... (at the end of the file)

# --- Alert Schemas (NEW) ---
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


# ... Authentication and authorisation

# --- User Schemas (NEW) ---
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

#authentication&authorization in react app
# --- Token Schemas (NEW) ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None



# --- Exit Schema (NEW) ---
class Exit(BaseModel):
    name: str

    class Config:
        from_attributes = True    
