# import logging
import time
import web3
from . import abis, config, database
from sqlmodel import Session, select
from .database.models import (
    Room,
    Booking,
    HotelContract,
    HotelMetadata,
    OrganisationContract,
    OrganisationMetadata,
    OrganisationFactory,
    ContractBase,
    MetadataBase,
)

w3 = web3.Web3(web3.Web3.HTTPProvider(config.FUSE_ENDPOINT))


def fetch_model(model: ContractBase):
    with Session(database.engine) as session:
        # results = session.query(model).all()
        query = select(model)
        results = session.exec(query).all()
        return results


def update_latest_block(model: ContractBase, address: str, value: int):
    with Session(database.engine) as session:
        # row = session.query(model).filter(model.address == address).first()
        query = select(model).where(model.address == address)
        row = session.exec(query).first()
        row.latest_block_number = value
        session.commit()


def add_booking(
    session: Session,
    booking_id: int,
    hotel: str,
    room_id: int,
    guest: str,
    check_in: int,
    check_out: int,
    cancellation_deadline: int,
    price: int,
    next_booking_id: int,
    past_booking_id: int,
):
    booking = Booking(
        booking_id=booking_id,
        hotel=hotel,
        room_id=room_id,
        guest=guest,
        check_in=check_in,
        check_out=check_out,
        cancellation_deadline=cancellation_deadline,
        price=price,
        past_booking_id=past_booking_id,
        next_booking_id=next_booking_id,
    )
    try:
        session.add(booking)
    except Exception as e:
        print("CRITICAL: Booking not added: ", e)
        return

    if check_in == 0:
        return

    # past = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.hotel == hotel,
    #         Booking.booking_id == past_booking_id,
    #     )
    #     .first()

    # )
    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.booking_id == past_booking_id,
    )
    past = session.exec(query).first()
    if past:
        past.next_booking_id = booking_id
    else:
        print(f"Past booking of booking {booking_id} of hotel {hotel} not found.")

    # next = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.hotel == hotel,
    #         Booking.booking_id == next_booking_id,
    #     )
    #     .first()
    # )
    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.booking_id == next_booking_id,
    )
    next = session.exec(query).first()
    if next:
        next.past_booking_id = booking_id
    else:
        print(f"Next booking of booking {booking_id} of hotel {hotel} not found.")


def remove_booking(session: Session, booking_id: int, hotel: str):
    # record_to_delete = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.booking_id == booking_id,
    #         Booking.hotel == hotel,
    #     )
    #     .first()
    # )
    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.booking_id == booking_id,
    )
    record_to_delete = session.exec(query).first()
    if not record_to_delete:
        print(
            f"CRITICAL: Booking {booking_id} of hotel {hotel} not found, nothing to delete."
        )
        return
    past_booking_id = record_to_delete.past_booking_id
    next_booking_id = record_to_delete.next_booking_id
    session.delete(record_to_delete)

    # past = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.hotel == hotel,
    #         Booking.booking_id == past_booking_id,
    #     )
    #     .first()
    # )
    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.booking_id == past_booking_id,
    )
    past = session.exec(query).first()
    if past:
        past.next_booking_id = next_booking_id
    else:
        print(f"Past booking of booking {booking_id} of hotel {hotel} not found.")

    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.booking_id == next_booking_id,
    )
    next = session.exec(query).first()
    # next = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.hotel == hotel,
    #         Booking.booking_id == next_booking_id,
    #     )
    #     .first()
    # )
    if next:
        next.past_booking_id = past_booking_id
    else:
        print(f"Next booking of booking {booking_id} of hotel {hotel} not found.")


def remove_room(session: Session, room_id: int, hotel: str):
    query = select(Booking).where(
        Booking.hotel == hotel,
        Booking.room_id == room_id,
        Booking.check_in == 0,
    )
    record_to_delete = session.exec(query).first()
    # record_to_delete = (
    #     session.query(Booking)
    #     .filter(
    #         Booking.room_id == room_id,
    #         Booking.hotel == hotel,
    #         Booking.check_in == 0,
    #     )
    #     .first()
    # )
    if record_to_delete:
        session.delete(record_to_delete)
    else:
        print(f"Initial booking of room {room_id} of hotel {hotel} not found.")
    # record_to_delete = (
    #     session.query(Room)
    #     .filter(
    #         Room.id == room_id,
    #         Room.hotel == hotel,
    #     )
    #     .first()
    # )
    query = select(Room).where(
        Room.id == room_id,
        Room.hotel == hotel,
    )
    record_to_delete = session.exec(query).first()
    if record_to_delete:
        session.delete(record_to_delete)
    else:
        print(f"Room {room_id} of hotel {hotel} not found.")


def update_room_price(session: Session, room_id: int, hotel: str, new_price: int):
    # row = (
    #     session.query(Room)
    #     .filter(
    #         Room.id == room_id,
    #         Room.hotel == hotel,
    #     )
    #     .first()
    # )
    query = select(Room).where(
        Room.id == room_id,
        Room.hotel == hotel,
    )
    row = session.exec(query).first()
    if row:
        row.price = new_price
    else:
        print(f"Price of room {room_id} of hotel {hotel} not modified, room not found.")


def add_contract(session: Session, model: ContractBase, address: str):
    m = model(
        address=address,
        latest_block_number=0,
    )
    session.add(m)


def update_owner(
    session: Session,
    model: ContractBase,
    metadata_model: MetadataBase,
    address: str,
    owner: str,
):
    # row = session.query(model).filter(model.address == address).first()
    query = select(model).where(
        model.address == address,
    )
    row = session.exec(query).first()
    if row:
        row.owner = owner
    else:
        print(f"CRITICAL Contract {address} not found, owner not modified.")
    # row = session.query(metadata_model).filter(model.address == address).first()
    query = select(metadata_model).where(
        metadata_model.address == address,
    )
    row = session.exec(query).first()
    if row:
        row.owner = owner
    else:
        print(f"Metadata for {address} not found, owner not modified.")


def update_cancellation_delay(session: Session, hotel: str, new_delay: int):
    # row = session.query(HotelMetadata).filter(HotelMetadata.address == hotel).first()
    query = select(HotelMetadata).where(
        HotelMetadata.address == hotel,
    )
    row = session.exec(query).first()
    if row:
        row.cancellation_delay = new_delay
    else:
        print(f"Metadata for hotel {hotel} not found, cancellation delay not modified.")


def remove_contract(session: Session, model: ContractBase, address: str):
    # record_to_delete = (
    #     session.query(model)
    #     .filter(
    #         model.address == address,
    #     )
    #     .first()
    # )
    query = select(model).where(
        model.address == address,
    )
    record_to_delete = session.exec(query).first()
    if record_to_delete:
        session.delete(record_to_delete)
    else:
        print(f"Contract {address} not found, nothing to delete.")


def remove_metadata(session: Session, model: MetadataBase, address: str):
    # record_to_delete = (
    #     session.query(model)
    #     .filter(
    #         model.address == address,
    #     )
    #     .first()
    # )
    query = select(model).where(
        model.address == address,
    )
    record_to_delete = session.exec(query).first()
    if record_to_delete:
        session.delete(record_to_delete)
    else:
        print(f"Metadata for {address} not found, nothing to delete.")


def parse_hotel_entry(session: Session, entry, address):
    if entry.event == "RoomCreated":
        initial_booking_id = entry.args.initialBookingId
        add_booking(
            session,
            booking_id=initial_booking_id,
            hotel=address,
            room_id=entry.args.roomId,
            guest="0x0000000000000000000000000000000000000000",
            check_in=0,
            check_out=0,
            cancellation_deadline=0,
            price=0,
            next_booking_id=initial_booking_id,
            past_booking_id=initial_booking_id,
        )

    elif entry.event == "RoomRemoved":
        remove_room(session, entry.args.roomId, address)

    elif entry.event == "RoomPriceChanged":
        update_room_price(session, entry.args.roomId, address, entry.args.newPrice)

    elif entry.event == "BookingCreated":
        add_booking(
            session,
            booking_id=entry.args.bookingId,
            hotel=address,
            room_id=entry.args.roomId,
            guest=entry.args.guest,
            check_in=entry.args.checkInDate,
            check_out=entry.args.checkOutDate,
            cancellation_deadline=entry.args.cancellationDeadline,
            price=entry.args.price,
            past_booking_id=entry.args.pastBookingId,
            next_booking_id=entry.args.nextBookingId,
        )

    elif entry.event == "BookingCancelled":
        remove_booking(session, entry.args.bookingId, address)

    elif entry.event == "OwnershipTransferred":
        update_owner(
            session, HotelContract, HotelMetadata, address, entry.args.newOwner
        )
    elif entry.event == "CancellationDelayUpdated":
        update_cancellation_delay(session, address, entry.args.newDelay)
    else:
        print("Unknown Hotel Event", entry.event)


def parse_organisation_entry(session: Session, entry, address):
    if entry.event == "HotelCreated":
        add_contract(session, HotelContract, entry.args.hotelAddress)
    elif entry.event == "HotelRemoved":
        remove_contract(session, HotelContract, entry.args.hotelAddress)
        remove_metadata(session, HotelMetadata, entry.args.hotelAddress)
    elif entry.event == "OwnershipTransferred":
        update_owner(
            session,
            OrganisationContract,
            OrganisationMetadata,
            address,
            entry.args.newOwner,
        )
    else:
        print("Unknown Organisation Event", entry.event)


def parse_factory_entry(session: Session, entry, address):
    if entry.event == "OrganisationCreated":
        add_contract(session, OrganisationContract, entry.args.organisationAddress)
    elif entry.event == "OrganisationRemoved":
        remove_contract(session, OrganisationContract, entry.args.organisationAddress)
        remove_metadata(session, OrganisationMetadata, entry.args.organisationAddress)
    elif entry.event == "OwnershipTransferred":
        update_owner(
            session,
            OrganisationContract,
            OrganisationMetadata,
            address,
            entry.args.newOwner,
        )
    else:
        print("Unknown Factory Event", entry.event)


def parse_entry(session: Session, model, entry, address):
    if model == OrganisationFactory:
        parse_factory_entry(session, entry, address)
    elif model == OrganisationContract:
        parse_organisation_entry(session, entry, address)
    elif model == HotelContract:
        parse_hotel_entry(session, entry, address)
    else:
        print("Unknown Model")


def update():

    for model, abi, events in zip(
        [OrganisationFactory, OrganisationContract, HotelContract],
        [abis.organisation_factory, abis.organisation, abis.hotel],
        [
            [  # Organisation Factory events
                "OrganisationCreated",
                "OrganisationRemoved",
            ],
            [  # Organisation events
                "HotelCreated",
                "HotelRemoved",
                "OwnershipTransferred",
            ],
            [  # Hotel events
                "RoomCreated",
                "RoomRemoved",
                "RoomPriceChanged",
                "BookingCreated",
                "BookingCancelled",
                "CancellationDelayUpdated",
                "OwnershipTransferred",
            ],
        ],
    ):
        print(model)
        result = fetch_model(model)
        for row in result:
            address = row.address
            current_block = int(row.latest_block_number)
            latest_block = w3.eth.get_block("latest").number
            contract = w3.eth.contract(address=address, abi=abi)
            print(address, current_block)
            entries = []
            for event in events:

                new_entries = (
                    contract.events[event]
                    .create_filter(fromBlock=current_block)
                    .get_all_entries()
                )
                entries += new_entries
                print(f"Event {event}: \t {len(new_entries)} new entries")

            if len(entries) == 0:
                continue
            sorted_entries = sorted(entries, key=lambda entry: entry.blockNumber)
            with Session(database.engine) as session:
                for entry in sorted_entries:
                    parse_entry(session, model, entry, address)
                session.commit()
            update_latest_block(model, address, latest_block + 1)


if __name__ == "__main__":
    while True:
        try:
            update()
        except Exception as e:
            print("Error: ", e)
        time.sleep(15)
