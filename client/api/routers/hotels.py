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


@router.get("/{hotel_address}")
def get_hotel(hotel_address: str, session: Session = Depends(get_session)) -> HotelFull:
    query = (
        select(HotelMetadata, OrganisationMetadata)
        .join(
            OrganisationMetadata,
            and_(HotelMetadata.organisation == OrganisationMetadata.address),
        )
        .where(HotelMetadata.address == hotel_address)
    )

    try:
        hotel, organisation = session.exec(query).one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Hotel Not Found",
        )

    rooms = session.exec(select(Room).where(Room.hotel == hotel_address)).all()

    # Convert rooms to RoomBasic model
    rooms_n = [
        RoomBasic(id=str(room.id), image=room.image, price=str(room.price))
        for room in rooms
    ]

    return HotelFull(
        title=hotel.title,
        subtitle=hotel.subtitle,
        city=hotel.city,
        location=hotel.location,
        address=hotel.address,
        image=hotel.image,
        owner=hotel.owner,
        contacts=hotel.contacts,
        cancellationDelay=str(hotel.cancellation_delay),
        organisation=OrganisationBasic(
            title=organisation.title,
            address=organisation.address,
            subtitle=organisation.subtitle,
            image=organisation.image,
        ),
        usefulInfo=hotel.useful_info,
        description=hotel.description,
        rooms=rooms_n,
    )


@router.get("/user_hotels/{user_address}")
def get_user_hotels(
    user_address: str, session: Session = Depends(get_session)
) -> list[HotelBasic]:
    query = select(HotelMetadata).where(HotelMetadata.owner == user_address)

    try:
        hotels = session.exec(query).all()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Hotel Not Found",
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


@router.get("/{hotel_address}/{room_number}")
def get_room(
    hotel_address: str, room_number: str, session: Session = Depends(get_session)
) -> RoomFull:
    try:
        room = session.exec(
            select(Room, HotelMetadata)
            .join(HotelMetadata, and_(Room.hotel == HotelMetadata.address))
            .where(Room.hotel == hotel_address, Room.id == room_number)
        ).one()
    except exc.NoResultFound:
        raise HTTPException(
            status_code=404,
            detail="Room Not Found",
        )

    room_bookings = session.exec(
        select(Booking)
        .where((Booking.room_id == room_number) & (Booking.hotel == hotel_address))
        .order_by(Booking.check_in)
    ).fetchall()

    booked_periods = []
    for romm_booking in room_bookings:
        if romm_booking.check_in == 0:
            continue
        booked_periods.append(
            BookedPeriod(
                checkIn=str(romm_booking.check_in),
                checkOut=str(romm_booking.check_out),
            )
        )

    room_full = RoomFull(
        id=str(room.Room.id),
        image=room.Room.image,
        price=str(room.Room.price),
        hotel=HotelBasic(
            title=room.HotelMetadata.title,
            subtitle=room.HotelMetadata.subtitle,
            city=room.HotelMetadata.city,
            location=room.HotelMetadata.location,
            image=room.HotelMetadata.image,
            address=room.HotelMetadata.address,
        ),
        description=room.Room.description,
        bookedPeriods=booked_periods,
    )

    return room_full


@router.get("/{hotel_address}/{room_number}/past_next")
def get_past_next(
    hotel_address: str,
    room_number: str,
    check_in_timestamp: int,
    check_out_timestamp: int,
    session: Session = Depends(get_session),
) -> PastNext:

    if check_in_timestamp > check_out_timestamp:
        raise HTTPException(
            status_code=400,
            detail="Check-in timestamp must be before check-out timestamp",
        )

    if (check_out_timestamp - check_in_timestamp) % (24 * 60 * 60) != 0:
        raise HTTPException(
            status_code=400,
            detail="Booking time has to be a multiple of 24 hours",
        )

    room_bookings = session.exec(
        select(Booking)
        .where((Booking.room_id == room_number) & (Booking.hotel == hotel_address))
        .order_by(Booking.check_in)
    ).fetchall()

    if not room_bookings:
        raise HTTPException(
            status_code=404,
            detail="No Initial booking found",
        )

    if len(room_bookings) == 1:
        # only initial booking in the list
        return PastNext(
            available=True,
            pastBookingId=str(room_bookings[0].booking_id),
            nextBookingId=str(room_bookings[0].booking_id),
        )

    if check_out_timestamp <= room_bookings[1].check_in:
        # new booking will be the first booking in the chain
        return PastNext(
            available=True,
            pastBookingId=str(room_bookings[0].booking_id),
            nextBookingId=str(room_bookings[1].booking_id),
        )

    for i in range(len(room_bookings) - 1):
        if room_bookings[i].check_out >= check_in_timestamp:
            if check_out_timestamp <= room_bookings[i + 1].check_in:
                return PastNext(
                    available=True,
                    pastBookingId=str(room_bookings[i].booking_id),
                    nextBookingId=str(room_bookings[i + 1].booking_id),
                )
            else:
                return PastNext(
                    available=False,
                    pastBookingId=str(0),
                    nextBookingId=str(0),
                )
        else:
            continue

    if check_in_timestamp >= room_bookings[-1].check_out:
        return PastNext(
            available=True,
            pastBookingId=str(room_bookings[-1].booking_id),
            nextBookingId=str(room_bookings[0].booking_id),
        )

    return PastNext(
        available=False,
        pastBookingId=str(0),
        nextBookingId=str(0),
    )


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


@router.post("/{hotel_address}/add_room")
def add_room(
    room: Room,
    session: Session = Depends(get_session),
) -> RoomFull:
    try:
        # Check if the hotel exists
        hotel = session.exec(
            select(HotelMetadata).where(HotelMetadata.address == room.hotel)
        ).first()
        if not hotel:
            raise HTTPException(
                status_code=404,
                detail="Hotel Not Found",
            )

        session.add(room)
        session.commit()

        # Refresh the session to get the auto-generated room_id
        session.refresh(room)

        # Retrieve the added room
        added_room = session.exec(
            select(Room).where(Room.hotel == room.hotel, Room.id == Room.id)
        ).first()

        # Convert room to RoomFull model
        room_full = RoomFull(
            id=str(added_room.id),
            image=added_room.image,
            price=str(added_room.price),
            hotel=HotelBasic(
                title=hotel.title,
                subtitle=hotel.subtitle,
                city=hotel.city,
                location=hotel.location,
                image=hotel.image,
                address=hotel.address,
            ),
            description=added_room.description,
            bookedPeriods=[],
        )

        return room_full

    except IntegrityError as e:
        raise HTTPException(
            status_code=500,
            detail="Room with provided id already exists in this hotel",
        )
