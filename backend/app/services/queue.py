# tiny in-memory queue store for demo purposes
_QUEUES = {}

def get_queue_status(queue_name: str):
    return _QUEUES.get(queue_name, {"queue_name": queue_name, "length": 0, "avg_wait": 0.0})

def update_queue(payload: dict):
    name = payload.get("queue_name")
    if not name:
        return {"error": "queue_name required"}
    _QUEUES[name] = {
        "queue_name": name,
        "length": int(payload.get("length", 0)),
        "avg_wait": float(payload.get("avg_wait", 0.0))
    }
    return _QUEUES[name]
