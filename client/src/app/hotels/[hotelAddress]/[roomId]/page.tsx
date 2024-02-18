'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { readContract, writeContract } from '@wagmi/core';
import { addDays } from 'date-fns';
import { CalendarPlus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useAccount, usePublicClient } from 'wagmi';
import * as z from 'zod';
import { getHotel, getRoom } from '@/components/api-interactions';
import { CardComponent } from '@/components/card';
import { ChangeRoomPrice, RemoveRoom } from '@/components/contract-interactions';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { hotelAbi, stablecoinConfig } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';

const formSchema = z.object({
  date: z.object({
    from: z.date(),
    to: z.date(),
  }),
  pastBookingId: z.string().min(1),
  nextBookingId: z.string().min(1),
});

type FormValues = z.infer<typeof formSchema>;

export default function RoomPage({
  params: { hotelAddress, roomId },
}: {
  params: { hotelAddress: `0x${string}`; roomId: string };
}) {
  const [isPending, setIsPending] = useState(false);
  const isMounted = useMounted();
  const { isConnected, address } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();

  const { data: room } = useQuery({
    queryKey: ['rooms', hotelAddress, roomId],
    queryFn: async () => {
      const response = await getRoom(hotelAddress, roomId);
      return response.data;
    },
  });

  const { data: hotel } = useQuery({
    queryKey: ['hotels', hotelAddress],
    queryFn: async () => {
      const response = await getHotel(hotelAddress);
      return response.data;
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: {
        from: new Date(2024, 1, 16),
        to: addDays(new Date(2024, 1, 16), 2),
      },
    },
  });

  async function onSubmit(values: FormValues) {
    const checkIn = BigInt(values.date.from.getTime() / 1000);
    const checkOut = BigInt(values.date.to.getTime() / 1000);
    const nights = (checkOut - checkIn) / BigInt(86400);

    setIsPending(true);

    console.log(checkIn, checkOut);

    let price;
    try {
      price = await readContract(config, {
        abi: hotelAbi,
        address: hotelAddress,
        functionName: 'prices',
        args: [BigInt(roomId)],
      });
      const totalPrice = nights * price;

      await approve(totalPrice);
      await book(checkIn, checkOut, BigInt(values.pastBookingId), BigInt(values.nextBookingId));
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  }

  async function approve(amount: bigint) {
    try {
      const txPromise = writeContract(config, {
        ...stablecoinConfig,
        functionName: 'approve',
        args: [hotelAddress, amount],
      });

      const resultPromise = txPromise.then((tx) => {
        return client.waitForTransactionReceipt({
          hash: tx,
        });
      });

      await resultPromise;

      toast.success('Approved!');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  async function book(checkIn: bigint, checkOut: bigint, pastBookingId: bigint, nextBookingId: bigint) {
    try {
      const txPromise = writeContract(config, {
        address: hotelAddress,
        abi: hotelAbi,
        functionName: 'book',
        args: [BigInt(roomId), checkIn, checkOut, pastBookingId, nextBookingId],
      });

      const resultPromise = txPromise.then((tx) => {
        return client.waitForTransactionReceipt({
          hash: tx,
        });
      });

      await resultPromise;

      queryClient.invalidateQueries({ queryKey: ['bookings', address] });
      toast.success('Booked!');
    } catch (err: any) {
      throw new Error(err.message);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-1 space-y-4">
        {room ? (
          <CardComponent kind="roomFull" data={{ ...room }} />
        ) : (
          <Card>
            <CardHeader className="space-y-6">
              <Skeleton className="h-96 rounded-md" />
              <Skeleton className="h-24 rounded-md" />
            </CardHeader>
          </Card>
        )}
        {hotel?.owner === address && isMounted && (
          <Card>
            <CardHeader>
              <CardTitle>Manage your room</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <RemoveRoom hotelAddress={hotelAddress} roomId={BigInt(roomId)} />
              <ChangeRoomPrice hotelAddress={hotelAddress} roomId={BigInt(roomId)} />
            </CardContent>
          </Card>
        )}
      </div>
      <Card className="col-span-2 max-w-2xl">
        <CardHeader>
          <CardTitle>Book the room and enjoy your trip</CardTitle>
          <CardDescription>
            Unlock your dream stay! Find the perfect room for your needs and secure your spot for an unforgettable
            experience. Book now and get ready to relax!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6 pb-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Check in - out</FormLabel>
                      <FormControl>
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={field.value.from}
                          selected={field.value}
                          onSelect={field.onChange}
                          numberOfMonths={2}
                        />
                      </FormControl>
                      <FormDescription>Your check in and check out dates.</FormDescription>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pastBookingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="1" {...field} />
                        </FormControl>
                        <FormDescription>Past booking.</FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nextBookingId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Booking ID</FormLabel>
                        <FormControl>
                          <Input placeholder="2" {...field} />
                        </FormControl>
                        <FormDescription>Next booking.</FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <CardFooter className="p-0">
                <Button type="submit" disabled={isPending || (isMounted && !isConnected)}>
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Book
                </Button>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
