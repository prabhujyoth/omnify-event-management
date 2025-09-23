from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from app.db.session import Base

class Attendee(Base):
    __tablename__ = "attendees"
    __table_args__ = (UniqueConstraint("event_id", "email", name="uq_event_email"),)

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)

    event = relationship("Event", back_populates="attendees")
