from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .db import Base

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

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    message = Column(String, nullable=False)
    severity = Column(String, default="info")
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="admin")

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