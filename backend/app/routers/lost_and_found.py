from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from ..database import schemas, models
from ..database.db import get_db

router = APIRouter(
    prefix="/api/lost-and-found",  # <-- This line ensures the URL is correct
    tags=["Lost and Found"]
)

@router.post("/", response_model=schemas.LostAndFoundItem)
def create_lost_and_found_item(
    item: schemas.LostAndFoundItemCreate, db: Session = Depends(get_db)
):
    db_item = models.LostAndFoundItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/", response_model=List[schemas.LostAndFoundItem])
def get_all_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    print("--- 1. ENTERING get_all_items function ---")
    try:
        print("--- 2. Querying the database for items... ---")
        items = db.query(models.LostAndFoundItem).offset(skip).limit(limit).all()
        print(f"--- 3. Found {len(items)} items in the database. ---")
        return items
    except Exception as e:
        print("!!!!!! AN ERROR OCCURRED !!!!!!")
        print(f"ERROR TYPE: {type(e)}")
        print(f"ERROR DETAILS: {e}")
        # Still raise an exception so the frontend knows something went wrong
        raise HTTPException(status_code=500, detail="An internal error occurred while fetching items.")

@router.get("/{item_id}", response_model=schemas.LostAndFoundItem)
def get_item_by_id(item_id: int, db: Session = Depends(get_db)):
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
    db_item = db.query(models.LostAndFoundItem).filter(models.LostAndFoundItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    if item_update.status:
        db_item.status = item_update.status

    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = db.query(models.LostAndFoundItem).filter(models.LostAndFoundItem.id == item_id).first()
    if db_item is None:
        raise HTTPException(status_code=404, detail="Item not found")

    db.delete(db_item)
    db.commit()
    return {"detail": "Item deleted successfully"}