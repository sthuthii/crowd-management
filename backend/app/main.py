from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    emergency,
    navigation,
    priority,
    accessibility,
    crowd_prediction,
    traffic,
    queue
)
from .services.traffic import run_traffic_simulation


@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(run_traffic_simulation())
    yield


app = FastAPI(title="Divine Crowd Sense API", lifespan=lifespan)

# ---------------- Middleware ----------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Routers ----------------
app.include_router(emergency.router, prefix="/emergency", tags=["Emergency"])
app.include_router(navigation.router, prefix="/navigation", tags=["Navigation"])
app.include_router(priority.router, prefix="/priority", tags=["Priority"])
app.include_router(accessibility.router, prefix="/accessibility", tags=["Accessibility"])
app.include_router(crowd_prediction.router)
app.include_router(traffic.router, prefix="/traffic", tags=["Traffic"])
app.include_router(queue.router, prefix="/queue", tags=["Queue"])


@app.get("/")
def read_root():
    return {"status": "API is running"}
