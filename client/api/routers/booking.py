from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session, select, and_

from ..database import get_session
from ..database.models import Booking, HotelMetadata, Room
from .commune import BookingBasic

router = APIRouter()

@router.get("/hotel/{hotel_address}")
def get_all_bookings_from_hotel(
    hotel_address: str, session: Session = Depends(get_session)
) -> list[BookingBasic]:
    bookings = []

    try:
        # Fetch bookings for the given hotel
        hotel_bookings = session.exec(
            select(Booking).where(Booking.hotel == hotel_address)
        ).all()

        for hotel_booking in hotel_bookings:
            # Fetch guest details
            booking = BookingBasic(
                bookingId=str(hotel_booking.booking_id),
                hotel=hotel_booking.hotel,
                roomId=str(hotel_booking.room_id),
                cancellationDeadline=str(hotel_booking.cancellation_deadline),
                price=str(hotel_booking.price),
                guest=hotel_booking.guest,
            )

            bookings.append(booking)

    except NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Bookings Not Found for the specified hotel",
        )

    return bookings


