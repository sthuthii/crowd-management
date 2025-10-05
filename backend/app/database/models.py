from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, Text
from sqlalchemy.sql import func
from app.database.db import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)

class CrowdPredictionRecord(Base):
    __tablename__ = "crowd_predictions"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)  # e.g., camera id or filename
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    count = Column(Integer)
    metadata = Column(Text)

class TrafficRecord(Base):
    __tablename__ = "traffic"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    density = Column(Float)
    avg_speed = Column(Float)

class QueueRecord(Base):
    __tablename__ = "queues"
    id = Column(Integer, primary_key=True, index=True)
    queue_name = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    length = Column(Integer)
    avg_wait = Column(Float)
