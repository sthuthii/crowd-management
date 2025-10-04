from fastapi import FastAPI
import asyncio
from contextlib import asynccontextmanager
from .routers import traffic 
from .services.traffic import run_traffic_simulation 

@asynccontextmanager
async def lifespan(app: FastAPI):
    
    asyncio.create_task(run_traffic_simulation())
    yield

app = FastAPI(title="Divine Crowd Sense API", lifespan=lifespan)


app.include_router(traffic.router, prefix="/api")

@app.get("/")
def read_root():
    return {"status": "API is running"}