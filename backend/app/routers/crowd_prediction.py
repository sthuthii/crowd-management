from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from pathlib import Path
import uuid
import shutil

from app.services.crowd_prediction import predict_image_file, predict_frame_from_video

# Only one router with prefix
router = APIRouter(prefix="/crowd")

# Directory to save uploaded files
UPLOAD_DIR = Path("/tmp/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Path to store the latest image for prediction
LATEST_IMAGE = UPLOAD_DIR / "latest.jpg"

# Endpoint to get the current crowd count
@router.get("/count")
def get_crowd_count():
    if not LATEST_IMAGE.exists():
        raise HTTPException(status_code=404, detail="No image available for prediction")
    try:
        count = predict_image_file(str(LATEST_IMAGE))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"count": count}

# Endpoint to upload an image and predict
@router.post("/image")
async def predict_image(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix
    # Save as latest.jpg to keep dashboard updated
    with open(LATEST_IMAGE, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        count = predict_image_file(str(LATEST_IMAGE))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return JSONResponse({"count": count, "source": LATEST_IMAGE.name})

# Endpoint to upload a video and predict crowd in each frame
@router.post("/video")
async def predict_video(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix
    fname = f"{uuid.uuid4().hex}{ext}"
    fpath = UPLOAD_DIR / fname
    with open(fpath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        out_video = UPLOAD_DIR / f"out_{fname}"
        predict_frame_from_video(str(fpath), str(out_video))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return JSONResponse({"out_video": str(out_video)})
