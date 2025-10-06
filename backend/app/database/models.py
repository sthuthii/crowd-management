from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base

# -----------------------------
# Lost and Found
# -----------------------------
class LostAndFoundItem(Base):
    __tablename__ = "lost_and_found_items"
    id = Column(Integer, primary_key=True, index=True)
    item_name = Column(String, index=True)
    category = Column(String)
    description = Column(String)
    location = Column(String)
    date = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="lost")
    reporter_name = Column(String)
    contact = Column(String)

# -----------------------------
# Emergency
# -----------------------------
class Emergency(Base):
    __tablename__ = "emergencies"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    emergency_type = Column(String, default="General")
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    status = Column(String, default="reported")
    notes = Column(String, nullable=True)

# -----------------------------
# Alerts
# -----------------------------
class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    severity = Column(String, default="info")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

# -----------------------------
# Users
# -----------------------------
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    hashed_password = Column(String)
    role = Column(String, default="admin")

# -----------------------------
# Evacuation Zones & Exits
# -----------------------------
class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    exits = relationship("Exit", back_populates="zone")

class Exit(Base):
    __tablename__ = "exits"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    zone_id = Column(Integer, ForeignKey("zones.id"))
    zone = relationship("Zone", back_populates="exits")

# -----------------------------
# Crowd Prediction
# -----------------------------
class CrowdPredictionRecord(Base):
    __tablename__ = "crowd_predictions"
    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)  # e.g., camera id or filename
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    count = Column(Integer)
    metadata = Column(Text)

# -----------------------------
# Traffic
# -----------------------------
class TrafficRecord(Base):
    __tablename__ = "traffic"
    id = Column(Integer, primary_key=True, index=True)
    location = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    density = Column(Float)
    avg_speed = Column(Float)

# -----------------------------
# Queue Monitoring
# -----------------------------
class QueueRecord(Base):
    __tablename__ = "queues"
    id = Column(Integer, primary_key=True, index=True)
    queue_name = Column(String)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    length = Column(Integer)
    avg_wait = Column(Float)
