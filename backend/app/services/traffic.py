def estimate_traffic(payload: dict):
    # very simple stub - in production you'd run a model here
    location = payload.get("location", "unknown")
    # return dummy values
    return {"location": location, "density": 0.4, "avg_speed": 25.0}
