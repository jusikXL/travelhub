'use client';

import { useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { CalendarOff, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount, usePublicClient } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { hotelAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';

export default function CancelBookingUser({
  hotelAddress,
  bookingId,
  guest,
}: {
  hotelAddress: `0x${string}`;
  bookingId: bigint;
  guest: `0x${string}`;
}) {
  const isMounted = useMounted();
  const { isConnected, address } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);

  async function cancelBooking() {
    setIsPending(true);

    const txPromise = writeContract(config, {
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'cancelBooking',
      args: [bookingId],
    });

    const resultPromise = txPromise.then((tx) => {
      return client.waitForTransactionReceipt({
        hash: tx,
      });
    });

    toast.promise(resultPromise, {
      loading: 'Loading...',
      success: () => {
        setIsPending(false);
        queryClient.invalidateQueries({ queryKey: ['bookings', address] });
        return 'Booking cancelled!';
      },
      error: (err) => {
        setIsPending(false);
        return err.message;
      },
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="border-none bg-transparent	p-0 sm:max-w-full	">
        <Button
          disabled={isPending || guest !== address || (isMounted && !isConnected)}
          onClick={() => cancelBooking()}
        >
          <CalendarOff className="mr-2 h-4 w-4" />
          Cancel booking
        </Button>
      </PopoverContent>
    </Popover>
  );
}
