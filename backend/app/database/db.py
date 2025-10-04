# In backend/app/database/db.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Import the URL from your new config file
from ..config import DATABASE_URL

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# This is the necessary dependency function for your routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()