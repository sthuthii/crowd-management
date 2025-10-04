# backend/app/main.py

from fastapi import FastAPI
from .database import models
from .database.db import engine
from fastapi.middleware.cors import CORSMiddleware
# Edit this line below
from .routers import emergency , lost_and_found,alerts,sms,users,auth

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crowd Management System API",
    description="API for TirthaSaathi App and Admin Dashboard",
    version="1.0.0"
)
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True, # Allows cookies and authentication headers
    allow_methods=["*"],    # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],    # Allows all headers
)

# Include API routers
app.include_router(auth.router)
app.include_router(emergency.router)
app.include_router(lost_and_found.router) # Comment this out for now
app.include_router(alerts.router)
app.include_router(sms.router)
app.include_router(users.router)
@app.get("/")
def read_root():
    return {"message": "Welcome to the Crowd Management System API"}