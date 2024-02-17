from sqlalchemy import exc
from sqlalchemy.exc import IntegrityError
from fastapi import APIRouter, Depends, HTTPException
from .commune import (
    HotelFull,
    RoomFull,
    RoomBasic,
    PastNext,
    OrganisationBasic,
    HotelBasic,
    BookedPeriod,
)
from ..database import get_session
from sqlmodel import Session, select
from sqlalchemy.sql import and_

from ..database.models import (
    HotelMetadata,
    Room,
    Booking,
    OrganisationMetadata,
)

router = APIRouter()

@router.get("/")
def get_all_hotels(session: Session = Depends(get_session)) -> list[HotelBasic]:
    try:
        hotels = session.exec(select(HotelMetadata)).all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="No Hotels Found",
        )

    # Convert hotels to HotelBasic model
    hotels_list = [
        HotelBasic(
            title=hotel.title,
            subtitle=hotel.subtitle,
            city=hotel.city,
            location=hotel.location,
            image=hotel.image,
            address=hotel.address,
        )
        for hotel in hotels
    ]

    return hotels_list