# backend/app/routers/lost_and_found.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import schemas, models
from ..database.db import get_db

router = APIRouter(
    prefix="/lost-and-found",
    tags=["Lost and Found"]
)

@router.post("/", response_model=schemas.LostAndFoundItem)
def create_lost_and_found_item(
    item: schemas.LostAndFoundItemCreate, db: Session = Depends(get_db)
):
    """
    Create a new report for a lost or found item.
    """
    db_item = models.LostAndFoundItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[schemas.LostAndFoundItem])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve all lost and found items with pagination.
    """
    items = db.query(models.LostAndFoundItem).offset(skip).limit(limit).all()
    return items

@router.get("/{item_id}", response_model=schemas.LostAndFoundItem)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
    """
    Get a specific item by its ID.
    """
    db_item = db.query(models.LostAndFoundItem).filter(models.LostAndFoundItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item

@router.put("/{item_id}", response_model=schemas.LostAndFoundItem)
def update_item_status(
    item_id: int,
    item_update: schemas.LostAndFoundItemUpdate,
    db: Session = Depends(get_db)
):
    """
    Update the status of an item (e.g., from 'lost' to 'found' or 'returned').
    """
    db_item = db.query(models.LostAndFoundItem).filter(models.LostAndFoundItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if item_update.status:
        db_item.status = item_update.status

    db.commit()
    db.refresh(db_item)
    return db_item