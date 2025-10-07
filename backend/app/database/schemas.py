from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

# ==========================
# 🔹 Queue Ticketing Schemas
# ==========================
class User(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class Queue(BaseModel):
    id: str
    name: str
    wait_time_minutes: int
    status: str

class PassCreate(BaseModel):
    queue_id: str
    number_of_people: int

class DigitalPass(BaseModel):
    pass_id: str
    queue_name: str
    assigned_slot: datetime
    qr_code_url: str
    owner: User
    class Config:
        from_attributes = True


# ==========================
# 🔹 Lost and Found Schemas
# ==========================
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


# ==========================
# 🔹 Emergency Schemas
# ==========================
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


# ==========================
# 🔹 Alert Schemas
# ==========================
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


# ==========================
# 🔹 User + Auth Schemas
# ==========================
class UserBase(BaseModel):
    username: str

class UserCreateAuth(UserBase):
    password: str = Field(..., min_length=8, max_length=72)
    role: str = "admin"

class UserAuth(UserBase):
    id: int
    role: str

    class Config:
        from_attributes = True

class TokenAuth(BaseModel):
    access_token: str
    token_type: str

class TokenDataAuth(BaseModel):
    username: Optional[str] = None


# ==========================
# 🔹 Exit Schema
# ==========================
class Exit(BaseModel):
    name: str

    class Config:
        from_attributes = True
