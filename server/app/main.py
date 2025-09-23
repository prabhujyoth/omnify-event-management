from fastapi import FastAPI
from app.db.session import Base, engine
from app.api.v1 import routes_event
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Event Management API")

origins = [
    "http://localhost:3000"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,           
    allow_credentials=True,
    allow_methods=["*"],             
    allow_headers=["*"],             
)

app.include_router(routes_event.router, prefix="/api/v1/events", tags=["events"])
