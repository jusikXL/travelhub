from pydantic import BaseModel


def to_camel(string: str) -> str:
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


class Response(BaseModel):
    class Config:
        alias_generator = to_camel
        allow_population_by_field_name = True


class BasicMeta(Response):
    address: str
    title: str
    subtitle: str
    image: str


class PastNext(Response):
    available: bool
    past_booking_id: str
    next_booking_id: str


class OrganisationBasic(BasicMeta):
    pass


class HotelBasic(BasicMeta):
    city: str


class RoomBasic(Response):
    id: str
    image: str
    price: str


class BookingBasic(Response):
    booking_id: str
    hotel: str
    room_id: str
    cancellation_deadline: str
    price: str
    guest: str


class BookedPeriod(Response):
    check_in: str
    check_out: str


class RoomFull(RoomBasic):
    description: str
    hotel: HotelBasic
    booked_periods: list[BookedPeriod]


class HotelFull(HotelBasic):
    owner: str
    description: str
    location: str
    contacts: str
    useful_info: str
    cancellation_delay: str
    organisation: OrganisationBasic
    rooms: list[RoomBasic]


class OrganisationFull(OrganisationBasic):
    owner: str
    description: str
    contacts: str
    hotels: list[HotelBasic]
