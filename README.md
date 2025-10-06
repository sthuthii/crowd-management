# Crowd Management System

## Backend
- FastAPI app at `backend/app/main.py`
- Run: `uvicorn app.main:app --reload --port 8000` from `backend` folder.

## Frontend
- React app in `frontend/`
- Run: `npm install` then `npm start` in `frontend/`

## Notes
- Put model weights at `backend/app/models/weights.pth` or change `CROWD_MODEL_PATH` env var.
- This repo is starter boilerplate; implement/replace services and models with your production code.
