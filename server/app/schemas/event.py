from pydantic import BaseModel, EmailStr
from datetime import datetime

# Event schemas
class EventBase(BaseModel):
    name: str
    location: str
    start_time: datetime
    end_time: datetime
    max_capacity: int

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: int

    class Config:
        
        from_attributes = True

# Attendee schemas
class AttendeeBase(BaseModel):
    name: str
    email: EmailStr

class AttendeeCreate(AttendeeBase):
    pass

class AttendeeResponse(AttendeeBase):
    id: int
    event_id: int

    class Config:
        from_attributes = True
