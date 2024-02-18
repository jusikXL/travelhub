'use client';

import { createColumnHelper } from '@tanstack/react-table';
import { CancelBookingUser } from '@/components/contract-interactions';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BookingCell = {
  hotelAddress: `0x${string}`;
  roomId: string;
  bookingId: string;
  cancellationDeadline: string;
  price: string;
  guest: `0x${string}`;
};

const columnHelper = createColumnHelper<BookingCell>();

export const columns = [
  columnHelper.accessor((row) => row.hotelAddress, {
    id: 'hotelAddress',
    cell: (info) => info.getValue(),
    header: () => <span>Hotel</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.roomId, {
    id: 'roomId',
    cell: (info) => info.getValue(),
    header: () => <span>Room</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.cancellationDeadline, {
    id: 'cancellationDeadline',
    cell: (info) => info.getValue(),
    header: () => <span>Cancellation Deadline</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.price, {
    id: 'price',
    cell: (info) => info.getValue(),
    header: () => <span>Price</span>,
    footer: (props) => props.column.id,
  }),
  columnHelper.accessor((row) => row.bookingId, {
    id: 'bookingId',
    cell: (info) => (
      <CancelBookingUser
        hotelAddress={info.row.original.hotelAddress}
        bookingId={BigInt(info.row.original.bookingId)}
        guest={info.row.original.guest}
      />
    ),
    header: () => <span>Booking ID</span>,
    footer: (props) => props.column.id,
  }),
];
