from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.database import models
from app.database.db import engine

# Import all routers from your project
from app.routers import (
    emergency,
    lost_and_found,
    alerts,
    sms,
    users,
    auth,
    evacuation,
    navigation, # Including both evacuation and navigation as seen in a previous version
    priority,
    accessibility,
    crowd_prediction,
    traffic,
    queue
)

# Import services if needed for background tasks
from app.services.traffic import run_traffic_simulation

# Create all database tables defined in models.py
models.Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Handles startup and shutdown events for the application.
    """
    # Start background tasks
    print("Starting background tasks...")
    asyncio.create_task(run_traffic_simulation())
    yield
    print("Shutting down background tasks...")


app = FastAPI(
    title="Crowd Management System API",
    description="API for DarshanSahay App and Admin Dashboard",
    version="1.0.0",
    lifespan=lifespan
)

# --- CORS Middleware Configuration ---
# This list defines which frontend URLs are allowed to make requests to this backend.
origins = [
    "http://localhost:5173",
    "http://localhost:5174", # The port from your recent error messages
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"], # Allows all headers
)
# ------------------------------------

# --- API Router Configuration ---
# All routers are included here to ensure all endpoints are active.
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(emergency.router)
app.include_router(lost_and_found.router)
app.include_router(alerts.router)
app.include_router(sms.router)
app.include_router(evacuation.router)
app.include_router(navigation.router)
app.include_router(priority.router)
app.include_router(accessibility.router, prefix='/accessibility')
app.include_router(crowd_prediction.router)
app.include_router(traffic.router)
app.include_router(queue.router, prefix='/queue')


# Health Check Endpoint
@app.get("/")
def root():
    """
    A simple health check endpoint to confirm the backend is running.
    """
    return {"status": "Backend running successfully 🚀"}

