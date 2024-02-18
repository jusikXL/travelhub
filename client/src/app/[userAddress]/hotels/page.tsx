'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React from 'react';
import { getUserHotels } from '@/components/api-interactions';
import { Card, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollCardComponent } from '@/components/ui/scroll-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserHotels({ params: { userAddress } }: { params: { userAddress: `0x${string}` } }) {
  const { data: hotels } = useQuery({
    queryKey: ['hotels', userAddress],
    queryFn: async () => {
      const response = await getUserHotels(userAddress);
      return response.data;
    },
  });

  return (
    <Card className="col-span-2 space-y-8 p-6">
      <CardTitle>Your hotels</CardTitle>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {hotels ? (
              hotels.map((hotel) => (
                <Link key={hotel.address} href={`/hotels/${hotel.address}`}>
                  <ScrollCardComponent
                    image={hotel.image}
                    title={hotel.title}
                    className="w-[250px]"
                    aspectRatio="portrait"
                    width={250}
                    height={330}
                  />
                </Link>
              ))
            ) : (
              <Skeleton className="h-36" />
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Card>
  );
}
