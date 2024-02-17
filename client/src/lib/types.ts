type Basic = {
  address: `0x${string}`;
  title: string;
  subtitle: string;
  image: string;
};

export type HotelBasic = Basic & {
  city: string;
};
export type HotelFull = HotelBasic & {
  owner: `0x${string}`;
  description: string;
  location: string;
  contacts: string;
  usefulInfo: string;
  organisation: OrganisationBasic;
  cancellationDelay: string;
  rooms: RoomBasic[];
};

export type OrganisationBasic = Basic & {};
export type OrganisationFull = OrganisationBasic & {
  owner: `0x${string}`;
  description: string;
  contacts: string;
  hotels: HotelBasic[];
};

export type RoomBasic = {
  id: string;
  image: string;
  price: string;
};
export type RoomFull = RoomBasic & {
  description: string;
  hotel: HotelBasic;
  // available rooms
};

export type Booking = {
  bookingId: string;
  hotel: `0x${string}`;
  roomId: string;
  cancellationDeadline: string;
  guest: `0x${string}`;
  price: string;
};
