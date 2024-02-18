'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { Coins } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, usePublicClient } from 'wagmi';
import * as z from 'zod';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { hotelAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';

const formSchema = z.object({
  price: z.coerce.number().positive(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ChangeRoomPrice({ hotelAddress, roomId }: { hotelAddress: `0x${string}`; roomId: bigint }) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const txPromise = writeContract(config, {
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'changeRoomPrice',
      args: [roomId, parseEther(values.price.toString())],
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
        queryClient.invalidateQueries({ queryKey: ['rooms', roomId.toString()] });
        return 'Price changed!';
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
          <Coins className="mr-2 h-4 w-4" />
          Change price
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change room price</DialogTitle>
          <DialogDescription>
            Offer competitive rates & attract diverse guests. Cater to different budgets with strategic pricing to keep
            your property in demand. Fill rooms, fill your pockets!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New price</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>New price. Min $5.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Change price</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
