import os

# Basic config for local development
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_PATH = os.environ.get("CROWD_MODEL_PATH", os.path.join(BASE_DIR, "models", "weights.pth"))
DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///./crowd.db")
