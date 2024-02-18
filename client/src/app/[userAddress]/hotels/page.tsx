import { Metadata } from 'next';
import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollCardComponent } from '@/components/ui/scroll-card';
import { HotelBasic } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Your Organisations',
  description: 'Organisations that were created by You.',
};

const hotelBasics: HotelBasic[] = [
  {
    address: '0x123abc',
    title: 'Hotel A',
    subtitle: 'Luxury Accommodation',
    image: 'https://github.com/shadcn.png',
    city: 'New York',
  },
  {
    address: '0x456def',
    title: 'Hotel B',
    subtitle: 'Cozy Retreat',
    image: 'https://github.com/shadcn.png',
    city: 'Paris',
  },
  {
    address: '0x789ghi',
    title: 'Hotel C',
    subtitle: 'Beachfront Paradise',
    image: 'https://github.com/shadcn.png',
    city: 'Miami',
  },
  {
    address: '0x123abc',
    title: 'Hotel A',
    subtitle: 'Luxury Accommodation',
    image: 'https://github.com/shadcn.png',
    city: 'New York',
  },
  {
    address: '0x456def',
    title: 'Hotel B',
    subtitle: 'Cozy Retreat',
    image: 'https://github.com/shadcn.png',
    city: 'Paris',
  },
  {
    address: '0x789ghi',
    title: 'Hotel C',
    subtitle: 'Beachfront Paradise',
    image: 'https://github.com/shadcn.png',
    city: 'Miami',
  },
  {
    address: '0x123abc',
    title: 'Hotel A',
    subtitle: 'Luxury Accommodation',
    image: 'https://github.com/shadcn.png',
    city: 'New York',
  },
  {
    address: '0x456def',
    title: 'Hotel B',
    subtitle: 'Cozy Retreat',
    image: 'https://github.com/shadcn.png',
    city: 'Paris',
  },
  {
    address: '0x789ghi',
    title: 'Hotel C',
    subtitle: 'Beachfront Paradise',
    image: 'https://github.com/shadcn.png',
    city: 'Miami',
  },
];

export default function UserHotels() {
  return (
    <Card className="col-span-2 space-y-8 p-6">
      <CardTitle>Your hotels</CardTitle>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {hotelBasics.map((hotel) => (
              <ScrollCardComponent
                key={hotel.title}
                image={hotel.image}
                title={hotel.title}
                className="w-[250px]"
                aspectRatio="portrait"
                width={250}
                height={330}
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </Card>
  );
}
