from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt
from passlib.context import CryptContext
import hashlib

# --- IMPORTANT: This should be in an environment variable, not hardcoded! ---
SECRET_KEY = "440cdc22372b494a90ece5c0a50cd090e5b2e843d20fb5d0828bfad7baf996f9"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

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
