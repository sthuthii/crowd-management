from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# --- User Schemas ---
class User(BaseModel):
    id: int
    username: str
    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    password: str

# --- Token Schemas ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Queue & Pass Schemas ---
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
    owner: User # Nests the user info in the response
    class Config:
        from_attributes = True