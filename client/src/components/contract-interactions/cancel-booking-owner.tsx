'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { writeContract } from '@wagmi/core';
import { CalendarOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { hotelAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';
import { Input } from '../ui/input';

const formSchema = z.object({
  id: z.coerce.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function CancelBookingOwner({ hotelAddress }: { hotelAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: '1',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const txPromise = writeContract(config, {
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'cancelBooking',
      args: [BigInt(values.id)],
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
        return 'Booking cancelled!';
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
          <CalendarOff className="mr-2 h-4 w-4" />
          Cancel booking
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cancel the guest&apos;s booking</DialogTitle>
          <DialogDescription>
            Convert cancellations into opportunities: Offer alternative dates, room options, or special promotions to
            incentivize rebooking and potentially recover lost revenue. Turn challenges into wins! (administration)
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Booking ID</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier of the booking.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Cancel booking</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
