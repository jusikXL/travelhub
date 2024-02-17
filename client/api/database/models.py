from sqlmodel import Field, SQLModel
from pydantic import condecimal, constr


class MetadataBase(SQLModel):
    address: constr(max_length=42) = Field(primary_key=True)
    owner: constr(max_length=42) = Field(
        default="0x0000000000000000000000000000000000000000"
    )
    title: constr(max_length=100) = Field(default="No title")
    contacts: constr(max_length=100) = Field(
        default="No contact information"
    )
    subtitle: constr(max_length=100) = Field(default="No subtitle")
    image: constr(max_length=1000) = Field(default="No image")
    description: constr(max_length=5000) = Field(default="No description")


class ContractBase(SQLModel):
    address: constr(max_length=42) = Field(primary_key=True)
    latest_block_number: int = Field(default=0)
    owner: constr(max_length=42) = Field(
        default="0x0000000000000000000000000000000000000000"
    )


class Booking(SQLModel, table=True):
    __tablename__ = "bookings"

    booking_id: condecimal(max_digits=78, decimal_places=0) = Field(primary_key=True)
    hotel: constr(max_length=42) = Field(primary_key=True)
    room_id: condecimal(max_digits=78, decimal_places=0)
    guest: constr(max_length=42)
    check_in: int
    check_out: int
    cancellation_deadline: int
    price: condecimal(max_digits=78, decimal_places=0)
    past_booking_id: condecimal(max_digits=78, decimal_places=0)
    next_booking_id: condecimal(max_digits=78, decimal_places=0)


class Room(SQLModel, table=True):
    __tablename__ = "rooms"
    image: constr(max_length=1000) = Field(default="No image")
    description: constr(max_length=5000) = Field(default="No description")
    hotel: constr(max_length=42) = Field(primary_key=True)
    id: condecimal(max_digits=78, decimal_places=0) = Field(primary_key=True)
    price: condecimal(max_digits=78, decimal_places=0)


class HotelContract(ContractBase, table=True):
    __tablename__ = "hotel_contracts"


class HotelMetadata(MetadataBase, table=True):
    __tablename__ = "hotels_metadata"

    city: constr(max_length=100) = Field(default="No city")
    organisation: constr(max_length=42)
    useful_info: constr(max_length=300) = Field(default="No useful info")
    location: constr(max_length=500) = Field(default="No location")
    cancellation_delay: int = Field(default=0)


class OrganisationContract(ContractBase, table=True):
    __tablename__ = "organisation_contracts"


class OrganisationMetadata(MetadataBase, table=True):
    __tablename__ = "organisations_metadata"


class OrganisationFactory(ContractBase, table=True):
    __tablename__ = "organisation_factories"
