# backend/app/main.py
from fastapi import FastAPI
from .routers import crowd_prediction  # Import your router

# This is the line that creates the 'app' attribute Uvicorn is looking for
app = FastAPI(
    title="Divine Crowd Sense API",
    description="API for crowd forecasting and management."
)

# This line connects your /forecast endpoint to the main application
app.include_router(crowd_prediction.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "API is running"}