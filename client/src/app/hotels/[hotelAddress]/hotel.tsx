'use client';

import { useQuery } from '@tanstack/react-query';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getHotel } from '@/components/api-interactions';
import { CardComponent } from '@/components/card';
import { AddRoom, UpdateCancellationDelay } from '@/components/contract-interactions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted';
import { AccordionComponent } from './components/accordion';

export default function HotelPage({ hotelAddress }: { hotelAddress: `0x${string}` }) {
  const { data: hotel } = useQuery({
    queryKey: ['hotels', hotelAddress],
    queryFn: async () => {
      const response = await getHotel(hotelAddress);
      return response.data;
    },
  });

  const { address } = useAccount();
  const isMounted = useMounted();

  return (
    <div>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-1">
          {hotel ? (
            <CardComponent kind="hotelFull" data={{ ...hotel, address: hotelAddress }} />
          ) : (
            <Card>
              <CardHeader className="space-y-6">
                <Skeleton className="h-96 rounded-md" />
                <Skeleton className="h-36 rounded-md" />
              </CardHeader>
            </Card>
          )}
        </div>
        <Card className="col-span-2 space-y-8 p-6">
          <div className="space-y-4">
            <CardTitle>About</CardTitle>
            {hotel ? <CardDescription>{hotel.description}</CardDescription> : <Skeleton className="h-56 rounded-md" />}
          </div>
          <div className="space-y-4">
            <CardTitle>FAQ</CardTitle>
            <AccordionComponent
              usefulInfo={hotel?.usefulInfo}
              contacts={hotel?.contacts}
              cancellationDelay={hotel?.cancellationDelay}
            />
          </div>
        </Card>
      </div>
      <Card className="mt-6 space-y-6 p-6">
        <div className="grid grid-cols-6">
          <CardTitle className="col-span-2 col-start-3 justify-self-center text-center">Rooms</CardTitle>
          <div className="col-span-1 col-start-6 justify-self-end">
            {hotel?.owner === address && isMounted && (
              <div className="flex items-center gap-2">
                <AddRoom hotelAddress={hotelAddress} />
                <UpdateCancellationDelay hotelAddress={hotelAddress} />
              </div>
            )}
          </div>
        </div>
        {hotel ? (
          hotel.rooms && hotel.rooms.length ? (
            <ul className="grid grid-cols-4 gap-4">
              {hotel.rooms.map((room, i) => (
                <li key={i}>
                  <Link href={`${hotelAddress}/${room.id}`}>
                    <CardComponent kind="roomBasic" data={room} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>No rooms yet!</AlertTitle>
              <AlertDescription>You can create a new one if you are the owner.</AlertDescription>
            </Alert>
          )
        ) : (
          <ul className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }, (_, index) => (
              <li key={index}>
                <Card>
                  <CardHeader className="space-y-6">
                    <Skeleton className="h-96 rounded-md" />
                    <Skeleton className="h-6 rounded-md" />
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
