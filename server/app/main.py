from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.v1 import routes_event

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Management API")

app.include_router(routes_event.router, prefix="/api/v1/events", tags=["events"])
