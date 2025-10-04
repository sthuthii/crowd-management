# In backend/app/queuemain.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from .database import models, db
from .database.db import engine
from .routers import queue, auth

# This function will create the default queues if they don't exist
def create_initial_data():
    database = db.SessionLocal()
    if not database.query(models.Queue).first():
        print("Creating initial queue data...")
        queues_to_create = [
            models.Queue(id="q_general", name="General Darshan", wait_time_minutes=75, status="High"),
            models.Queue(id="q_vip", name="VIP Pass Holders", wait_time_minutes=15, status="Low"),
            models.Queue(id="q_prasad", name="Prasad Counter", wait_time_minutes=25, status="Medium"),
        ]
        database.add_all(queues_to_create)
        database.commit()
    database.close()

# Create database tables
models.Base.metadata.create_all(bind=db.engine)

app = FastAPI(title="Darshan Sahaay API")

# Run the seeding function on startup
@app.on_event("startup")
def on_startup():
    create_initial_data()

# Add CORS middleware
origins = ["http://localhost:3000", "http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(queue.router, prefix="/api", tags=["Queue & Ticketing"])

@app.get("/")
def read_root():
    return {"message": "Welcome to the Darshan Sahaay API"}