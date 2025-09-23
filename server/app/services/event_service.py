from sqlalchemy.orm import Session
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError
from datetime import datetime
from fastapi import HTTPException, status

from app.models.event import Event
from app.models.attendee import Attendee
from app.schemas.event import EventCreate, AttendeeCreate


def create_event(db: Session, event_in: EventCreate) -> Event:
    #event_in carries the payload.
    ev = Event(
        name=event_in.name,
        location=event_in.location,
        start_time=event_in.start_time,
        end_time=event_in.end_time,
        max_capacity=event_in.max_capacity,
    )
    db.add(ev)
    db.commit()
    db.refresh(ev)
    return ev

def list_upcoming_events(db: Session, now: datetime | None = None):
    if now is None:
        now = datetime.utcnow()
    # lists events that haven't ended yet
    return db.query(Event).filter(Event.end_time >= now).order_by(Event.start_time).all()

def register_attendee(db: Session, event_id: int, attendee_in: AttendeeCreate) -> Attendee:

    # start a transaction block
    with db.begin():
        # lock the event row for update to prevent concurrent overbook
        stmt = select(Event).where(Event.id == event_id).with_for_update()
        ev = db.execute(stmt).scalar_one_or_none()

        if ev is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")

        # count current attendees
        current_count = db.execute(
            select(func.count()).select_from(Attendee).where(Attendee.event_id == event_id)
        ).scalar_one()

        if current_count >= ev.max_capacity:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Event is fully booked")

        # check duplicate registration
        existing = db.execute(
            select(Attendee).where(Attendee.event_id == event_id, Attendee.email == attendee_in.email)
        ).scalar_one_or_none()

        if existing:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered for this event")

        # create attendee
        new_att = Attendee(event_id=event_id, name=attendee_in.name, email=attendee_in.email)
        db.add(new_att)
        try:
            # flush/commit happens when leaving context, but we can flush to get id
            db.flush()
        except IntegrityError:
            # unique constraint might still fail under concurrency
            db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered for this event")

        db.refresh(new_att)
        return new_att

def list_attendees(db: Session, event_id: int):
    # ensure event exists
    ev = db.query(Event).filter(Event.id == event_id).first()
    if not ev:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    return db.query(Attendee).filter(Attendee.event_id == event_id).all()


def delete_event(db: Session, event_id: int) -> None:
    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Event not found")
    db.delete(event)
    db.commit()


def remove_attendee(db: Session, event_id: int, attendee_id: int) -> None:
    attendee = db.query(Attendee).filter(
        Attendee.id == attendee_id,
        Attendee.event_id == event_id
    ).first()

    if not attendee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attendee not found for this event")

    db.delete(attendee)
    db.commit()
