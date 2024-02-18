'use client';

import { useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAccount, usePublicClient } from 'wagmi';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { hotelAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';

export default function RemoveRoom({ hotelAddress, roomId }: { hotelAddress: `0x${string}`; roomId: bigint }) {
  const router = useRouter();
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  async function removeRoom() {
    setIsPending(true);

    const txPromise = writeContract(config, {
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'removeRoom',
      args: [roomId],
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
        queryClient.invalidateQueries({ queryKey: ['hotels', hotelAddress] });
        router.push(`/hotels/${hotelAddress}`);
        return 'Room removed!';
      },
      error: (err) => {
        setIsPending(false);
        return err.message;
      },
    });

    setOpen(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isPending || (isMounted && !isConnected)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Remove room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove the room from your hotel</DialogTitle>
          <DialogDescription>
            Streamline your online presence: Reduce confusion and simplify browsing by removing outdated or unavailable
            rooms from your catalog. Present a clear and concise selection to potential guests.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="grid grid-cols-2 gap-4 ">
          <Button onClick={removeRoom}>Remove room</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
