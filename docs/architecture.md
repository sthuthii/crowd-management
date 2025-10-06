Architecture overview:
- Frontend (React) talks to backend (FastAPI)
- Backend has routes for crowd, traffic, queue, accessibility, emergency
- Crowd predictions use a PyTorch model; output saved and optionally stored in DB
