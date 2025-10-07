from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import models, schemas
from ..database.db import get_db

router = APIRouter(
    prefix="/api/evacuation",
    tags=["Navigation"]
)

# This zone is now defined around the Somnath Temple area in Gujarat.
PREDEFINED_ZONES = {
    "Main Hall": {"lat_min": 20.8870, "lat_max": 20.8890, "lon_min": 70.4000, "lon_max": 70.4025}
}

@router.get("/exits-near-me", response_model=List[schemas.Exit])
def get_nearby_exits(lat: float, lon: float, db: Session = Depends(get_db)):
    """
    Takes a user's latitude and longitude, determines their zone,
    and returns a list of emergency exits (with coordinates) for that zone.
    """
    found_zone_name = None
    for zone_name, bounds in PREDEFINED_ZONES.items():
        if bounds["lat_min"] <= lat <= bounds["lat_max"] and bounds["lon_min"] <= lon <= bounds["lon_max"]:
            found_zone_name = zone_name
            break
            
    if not found_zone_name:
        raise HTTPException(status_code=404, detail="You are not in a recognized zone.")

    zone_db = db.query(models.Zone).filter(models.Zone.name == found_zone_name).first()
    if not zone_db or not zone_db.exits:
        raise HTTPException(status_code=404, detail=f"No exits found for {found_zone_name}.")

    return zone_db.exits

@router.post("/seed-data", status_code=201)
def seed_exit_data(db: Session = Depends(get_db)):
    """
    Creates sample zone and exit data with coordinates for Somnath Temple.
    Run this once from the API docs (http://127.0.0.1:8000/docs) to set up your data.
    """
    main_hall = db.query(models.Zone).filter(models.Zone.name == "Main Hall").first()
    if not main_hall:
        # Create the Zone
        main_hall = models.Zone(name="Main Hall")
        db.add(main_hall)

        # Create Exits with coordinates relevant to Somnath Temple and link them to the Zone
        exit1 = models.Exit(name="North Gate Exit", zone=main_hall, latitude=20.8887, longitude=70.4015)
        exit2 = models.Exit(name="South Gate Exit (Sea Facing)", zone=main_hall, latitude=20.8875, longitude=70.4013)
        db.add(exit1)
        db.add(exit2)
        db.commit()
        return {"message": "Sample Somnath Temple zone and exit data created successfully."}
        
    return {"message": "Data already exists."}