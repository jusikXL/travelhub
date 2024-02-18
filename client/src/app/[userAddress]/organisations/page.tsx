'use client';

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { getUserOrganisations } from '@/components/api-interactions';
import { Card, CardTitle } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { ScrollCardComponent } from '@/components/ui/scroll-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function UserOrganisations({ params: { userAddress } }: { params: { userAddress: `0x${string}` } }) {
  const { data: organisations } = useQuery({
    queryKey: ['organisations', userAddress],
    queryFn: async () => {
      const response = await getUserOrganisations(userAddress);
      return response.data;
    },
  });

  return (
    <Card className="col-span-2 space-y-8 p-6">
      <CardTitle>Your organisations</CardTitle>
      <div className="relative">
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {organisations ? (
              organisations.map((organisation) => (
                <ScrollCardComponent
                  key={organisation.title}
                  image={organisation.image}
                  title={organisation.title}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
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
