from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app import schemas
from app.services import event_service

router = APIRouter()

@router.post("/", response_model=schemas.event.EventResponse, status_code=status.HTTP_201_CREATED)
def create_event(event_in: schemas.event.EventCreate, db: Session = Depends(get_db)):
    return event_service.create_event(db, event_in)

@router.get("/", response_model=list[schemas.event.EventResponse])
def list_events(db: Session = Depends(get_db)):
    return event_service.list_upcoming_events(db)

@router.post("/{event_id}/register", response_model=schemas.event.AttendeeResponse, status_code=status.HTTP_201_CREATED)
def register_attendee(event_id: int, attendee_in: schemas.event.AttendeeCreate, db: Session = Depends(get_db)):
    return event_service.register_attendee(db, event_id, attendee_in)

@router.get("/{event_id}/attendees", response_model=list[schemas.event.AttendeeResponse])
def get_attendees(event_id: int, db: Session = Depends(get_db)):
    return event_service.list_attendees(db, event_id)

@router.delete("/{event_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_event(event_id: int, db: Session = Depends(get_db)):
    event_service.delete_event(db, event_id)
    return {"detail": "Event deleted successfully"}


@router.delete("/{event_id}/attendees/{attendee_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_attendee(event_id: int, attendee_id: int, db: Session = Depends(get_db)):
    event_service.remove_attendee(db, event_id, attendee_id)
    return {"detail": "Attendee removed successfully"}