# backend/app/database/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError
from ..config import DATABASE_URL  # Make sure this points to your SQLite or other DB

# -----------------------------
# ✅ Create SQLAlchemy Engine
# -----------------------------
# For SQLite, need check_same_thread=False
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

# -----------------------------
# ✅ Create Session Factory
# -----------------------------
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# -----------------------------
# ✅ Base Class for Models
# -----------------------------
Base = declarative_base()

# -----------------------------
# ✅ Dependency for FastAPI Routes
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -----------------------------
# Optional: Ensure tables exist
# -----------------------------
def init_db():
    try:
        from . import models  # Import models to create tables
        Base.metadata.create_all(bind=engine)
        print("Database tables created ✅")
    except OperationalError as e:
        print("Error creating tables:", e)
