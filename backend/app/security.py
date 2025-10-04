from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
import hashlib

from .database import models, db

# This scheme will look for a "Bearer" token in the Authorization header
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/token")

# --- IMPORTANT: This should be in an environment variable, not hardcoded! ---
SECRET_KEY = "440cdc22372b494a90ece5c0a50cd090e5b2e843d20fb5d0828bfad7baf996f9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

# --- Password Helpers ---
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against the stored bcrypt hash.
    """
    return pwd_context.verify(_safe_pre_hash(plain_password), hashed_password)

def get_password_hash(password: str) -> str:
    """
    Hash the password using bcrypt.
    Supports long passwords by pre-hashing with SHA-256.
    """
    return pwd_context.hash(_safe_pre_hash(password))

def _safe_pre_hash(password: str) -> str:
    """
    Pre-hash the password with SHA-256 (digest, not hex) to ensure it fits bcrypt's 72-byte limit.
    """
    return hashlib.sha256(password.encode("utf-8")).hexdigest()  # 64 chars safe for bcrypt


# --- JWT Token Helpers ---
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """
    Create a JWT access token with an expiration time.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme), database: Session = Depends(db.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = database.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user
