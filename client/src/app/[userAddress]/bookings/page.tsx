'use client';

import { useQuery } from '@tanstack/react-query';
import { formatEther } from 'viem';
import { getUserBookings } from '@/components/api-interactions';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Booking } from '@/lib/types';
import { BookingCell, columns } from './columns';
import { DataTable } from './data-table';

function convertBookingsToBookingCells(bookings: Booking[]): BookingCell[] {
  const bookingCells: BookingCell[] = bookings.map((booking) => {
    const date = new Date(Number(booking.cancellationDeadline) * 1000);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    return {
      hotelAddress: booking.hotel,
      roomId: booking.roomId.toString(),
      bookingId: booking.bookingId.toString(),
      cancellationDeadline: formattedDate,
      price: `$${formatEther(BigInt(booking.price))}`,
      guest: booking.guest,
    };
  });
  return bookingCells;
}

export default function BookingsPage({ params: { userAddress } }: { params: { userAddress: `0x${string}` } }) {
  const { data } = useQuery({
    queryKey: ['bookings', userAddress],
    queryFn: async () => {
      const response = await getUserBookings(userAddress);
      return response.data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <DataTable columns={columns} data={convertBookingsToBookingCells(data)} />
        ) : (
          <Skeleton className="h-36" />
        )}
      </CardContent>
    </Card>
  );
}
