from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.database import models
from app.database.db import engine

# Routers
from app.routers import (
    emergency,
    lost_and_found,
    alerts,
    sms,
    users,
    auth,
    evacuation,
    navigation,
    priority,
    accessibility,
    crowd_prediction,
    traffic,
    queue
)

# Services
from app.services.traffic import run_traffic_simulation

# Create all database tables
models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background tasks like traffic simulation
    asyncio.create_task(run_traffic_simulation())
    yield


app = FastAPI(
    title="Crowd Management System API",
    description="API for TirthaSaathi App and Admin Dashboard",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      # change later if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(auth.router)
app.include_router(emergency.router)
app.include_router(lost_and_found.router)
app.include_router(alerts.router)
app.include_router(sms.router)
app.include_router(users.router)
app.include_router(evacuation.router)
app.include_router(navigation.router)
app.include_router(priority.router)
app.include_router(accessibility.router, prefix='/accessibility')
app.include_router(crowd_prediction.router)
app.include_router(traffic.router)
app.include_router(queue.router)

# Health Check

@app.get("/")
def root():
    return {"status": "Backend running successfully 🚀"}
