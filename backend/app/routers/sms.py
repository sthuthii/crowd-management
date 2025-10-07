from fastapi import APIRouter, Depends, Form, Response
from sqlalchemy.orm import Session

from ..database import models
from ..database.db import get_db

router = APIRouter(
    prefix="/api/webhook",
    tags=["SMS Webhook"]
)

@router.post("/sms")
def sms_reply(From: str = Form(...), Body: str = Form(...), db: Session = Depends(get_db)):
    """
    Receive an incoming SMS and create an emergency alert.
    """
    message_body = Body.strip().upper()
    xml_content = ""
    
    # Check for a keyword in the message
    if "SOS" in message_body or "HELP" in message_body:
        # Create a new emergency in the database
        new_emergency = models.Emergency(
            user_id=From,
            emergency_type="SMS",
            status="reported",
            notes=f"SOS received via SMS from {From}. Message: '{Body}'"
        )
        db.add(new_emergency)
        db.commit()

        # Manually create the XML confirmation message
        xml_content = '<Response><Message>Help is on the way. Your SOS has been received by the authorities.</Message></Response>'
        
    else:
        # Manually create the generic XML reply
        xml_content = '<Response><Message>This is the TirthaSaathi emergency line. Text \'SOS\' or \'HELP\' for assistance.</Message></Response>'

    # Return the XML string with the correct content type
    return Response(content=xml_content, media_type="application/xml")