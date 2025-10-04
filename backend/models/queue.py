from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database.database import Base
import enum

class TicketStatus(enum.Enum):
    BOOKED = "BOOKED"
    USED = "USED"

class DarshanTicket(Base):
    __tablename__ = "darshan_tickets"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    ticket_code = Column(String, unique=True, nullable=False)
    booking_time = Column(DateTime, server_default=func.now())
    status = Column(Enum(TicketStatus), default=TicketStatus.BOOKED)
    owner = relationship("User", back_populates="tickets")