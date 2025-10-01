from fastapi import FastAPI
from .routers import crowd_prediction  


app = FastAPI(
    title="Divine Crowd Sense API",
    description="API for crowd forecasting and management."
)


app.include_router(crowd_prediction.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "API is running"}