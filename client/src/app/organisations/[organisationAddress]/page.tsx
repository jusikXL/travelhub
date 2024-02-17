'use client';

import { useQuery } from '@tanstack/react-query';
import { Terminal } from 'lucide-react';
import Link from 'next/link';
import { useAccount } from 'wagmi';
import { getOrganisation } from '@/components/api-interactions';
import { CreateHotel, RemoveHotel } from '@/components/contract-interactions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMounted } from '@/hooks/use-mounted';
import { CardComponent } from '../../../components/card';

export default function Organisation({
  params: { organisationAddress },
}: {
  params: { organisationAddress: `0x${string}` };
}) {
  const { data: organisation } = useQuery({
    queryKey: ['organisations', organisationAddress],
    queryFn: async () => {
      const response = await getOrganisation(organisationAddress);
      return response.data;
    },
  });

  const { address } = useAccount();
  const isMounted = useMounted();

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-1">
        {organisation ? (
          <CardComponent kind="organisationFull" data={{ ...organisation, address: organisationAddress }} />
        ) : (
          <Card>
            <CardHeader className="space-y-6">
              <Skeleton className="h-96 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </CardHeader>
          </Card>
        )}
      </div>
      <div className="col-span-2 col-start-2">
        <div className="grid grid-cols-6">
          <h2 className="col-span-2 col-start-3 justify-self-center text-center text-3xl font-semibold leading-none tracking-tight">
            Hotels
          </h2>
          <div className="col-span-1 col-start-6 justify-self-end">
            {organisation?.owner === address && isMounted && (
              <div className="flex items-center gap-2">
                <RemoveHotel organisationAddress={organisationAddress} />
                <CreateHotel organisationAddress={organisationAddress} />
              </div>
            )}
          </div>
        </div>
        <Separator className="my-4" />
        {organisation ? (
          organisation.hotels.length ? (
            <ul className="grid grid-cols-3 gap-4">
              {organisation.hotels.map((hotel) => (
                <li key={hotel.title}>
                  <Link href={`/hotels/${hotel.address}`}>
                    <CardComponent kind="hotelBasic" data={hotel} />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>No hotels yet!</AlertTitle>
              <AlertDescription>You can create a new one if you are the owner.</AlertDescription>
            </Alert>
          )
        ) : (
          <ul className="grid grid-cols-3 gap-4">
            {Array.from({ length: 3 }, (_, index) => (
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
      </div>
    </div>
  );
}
