'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { getAllHotels, getAllOrganisations } from '@/components/api-interactions';
import { CardComponent } from '@/components/card';
import { CreateOrganisation } from '@/components/contract-interactions';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomeComponent() {
  const { data: organisations } = useQuery({
    queryKey: ['organisations'],
    queryFn: async () => {
      const response = await getAllOrganisations();
      return response.data;
    },
  });

  const { data: hotels } = useQuery({
    queryKey: ['hotels'],
    queryFn: async () => {
      const response = await getAllHotels();
      return response.data;
    },
  });

  return (
    <Tabs defaultValue="organisations" className="h-full space-y-6">
      <TabsList>
        <TabsTrigger value="organisations">Organisations</TabsTrigger>
        <TabsTrigger value="hotels">Hotels</TabsTrigger>
      </TabsList>
      <TabsContent value="hotels" className="border-none p-0 outline-none">
        <h2 className="text-2xl font-semibold tracking-tight">Find your dream stay</h2>
        <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
        <Separator className="my-4" />
        <div className="grid grid-cols-4 gap-4">
          {hotels
            ? hotels.map((hotel) => (
                <Link key={hotel.address} href={`/hotels/${hotel.address}`}>
                  <CardComponent kind="hotelBasic" data={hotel} />
                </Link>
              ))
            : Array.from({ length: 4 }, (_, index) => (
                <Card key={index}>
                  <CardHeader className="space-y-6">
                    <Skeleton className="h-96 rounded-md" />
                    <Skeleton className="h-6 rounded-md" />
                  </CardHeader>
                </Card>
              ))}
        </div>
      </TabsContent>
      <TabsContent value="organisations" className="border-none p-0 outline-none">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Find your dream stay</h2>
            <p className="text-sm text-muted-foreground">Top picks for you. Updated daily.</p>
          </div>
          <CreateOrganisation />
        </div>
        <Separator className="my-4" />
        <div className="grid grid-cols-4 gap-4">
          {organisations
            ? organisations.map((organisation) => (
                <Link key={organisation.address} href={`/organisations/${organisation.address}`}>
                  <CardComponent kind="organisationBasic" data={organisation} />
                </Link>
              ))
            : Array.from({ length: 4 }, (_, index) => (
                <Card key={index}>
                  <CardHeader className="space-y-6">
                    <Skeleton className="h-96 rounded-md" />
                    <Skeleton className="h-6 rounded-md" />
                  </CardHeader>
                </Card>
              ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
