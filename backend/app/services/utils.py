# small helpers, e.g., format timestamps etc.
from datetime import datetime

def now_iso():
    return datetime.utcnow().isoformat() + "Z"
