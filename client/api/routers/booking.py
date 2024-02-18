from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import NoResultFound
from sqlmodel import Session, select, and_

from ..database import get_session
from ..database.models import Booking
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


@router.get("/hotel/{hotel_address}/room/{room_id}")
def get_all_bookings_in_room(
        hotel_address: str, room_id: int, session: Session = Depends(get_session)
) -> list[BookingBasic]:
    bookings = []

    try:
        # Fetch bookings for the given room
        room_bookings = session.exec(
            select(Booking).where(
                and_(Booking.hotel == hotel_address, Booking.room_id == room_id)
            )
        ).all()

        for room_booking in room_bookings:
            # Fetch guest details
            booking = BookingBasic(
                bookingId=str(room_booking.booking_id),
                hotel=room_booking.hotel,
                roomId=str(room_booking.room_id),
                cancellationDeadline=str(room_booking.cancellation_deadline),
                price=str(room_booking.price),
                guest=room_booking.guest,
            )

            bookings.append(booking)

    except NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Bookings Not Found for the specified room",
        )

    return bookings


@router.get("/user/{user_address}")
def get_client_bookings(
        user_address: str, session: Session = Depends(get_session)
) -> list[BookingBasic]:
    bookings = []

    try:
        # Fetch bookings for the given user
        user_bookings = session.exec(
            select(Booking).where(Booking.guest == user_address)
        ).all()

        for user_booking in user_bookings:
            # Create Booking instance
            booking = BookingBasic(
                bookingId=str(user_booking.booking_id),
                hotel=user_booking.hotel,
                roomId=str(user_booking.room_id),
                cancellationDeadline=str(user_booking.cancellation_deadline),
                price=str(user_booking.price),
                guest=user_booking.guest,
            )

            bookings.append(booking)

    except NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Bookings Not Found for the specified user",
        )

    return bookings
