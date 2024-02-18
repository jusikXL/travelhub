import { Metadata } from 'next';
import React from 'react';
import { Card, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollCardComponent } from '@/components/ui/scroll-card';
import { OrganisationBasic } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Your Organisations',
  description: 'Organisations that were created by You.',
};

const organisationBasics: OrganisationBasic[] = [
  {
    address: '0xabc123',
    title: 'Company A',
    subtitle: 'Tech Startup',
    image: '/company-a.jpg',
  },
  {
    address: '0xdef456',
    title: 'Company B',
    subtitle: 'Consulting Firm',
    image: '/company-b.jpg',
  },
  {
    address: '0xghi789',
    title: 'Company C',
    subtitle: 'Marketing Agency',
    image: '/company-c.jpg',
  },
  {
    address: '0xabc123',
    title: 'Company A',
    subtitle: 'Tech Startup',
    image: '/company-a.jpg',
  },
  {
    address: '0xdef456',
    title: 'Company B',
    subtitle: 'Consulting Firm',
    image: '/company-b.jpg',
  },
  {
    address: '0xghi789',
    title: 'Company C',
    subtitle: 'Marketing Agency',
    image: '/company-c.jpg',
  },
  {
    address: '0xabc123',
    title: 'Company A',
    subtitle: 'Tech Startup',
    image: '/company-a.jpg',
  },
  {
    address: '0xdef456',
    title: 'Company B',
    subtitle: 'Consulting Firm',
    image: '/company-b.jpg',
  },
  {
    address: '0xghi789',
    title: 'Company C',
    subtitle: 'Marketing Agency',
    image: '/company-c.jpg',
  },
  {
    address: '0xabc123',
    title: 'Company A',
    subtitle: 'Tech Startup',
    image: '/company-a.jpg',
  },
  {
    address: '0xdef456',
    title: 'Company B',
    subtitle: 'Consulting Firm',
    image: '/company-b.jpg',
  },
  {
    address: '0xghi789',
    title: 'Company C',
    subtitle: 'Marketing Agency',
    image: '/company-c.jpg',
  },
];

export default function UserOrganisations() {
  return (
    <Card className="col-span-2 space-y-8 p-6">
      <CardTitle>Your organisations</CardTitle>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {organisationBasics.map((organisation) => (
              <ScrollCardComponent
                key={organisation.title}
                image={organisation.image}
                title={organisation.title}
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
