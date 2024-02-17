'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { CalendarX2 } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { hotelAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  multiplier: z.coerce.number().positive(),
  timeInterval: z.coerce.string(),
});

type FormValues = z.infer<typeof formSchema>;

export default function UpdateCancellationDelay({ hotelAddress }: { hotelAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();
  const queryClient = useQueryClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      multiplier: 12,
      timeInterval: '3600',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const newDelay = values.multiplier * Number(values.timeInterval);

    const txPromise = writeContract(config, {
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'updateCancellationDelay',
      args: [BigInt(newDelay)],
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
        return 'Cancellation delay updated!';
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
          <CalendarX2 className="mr-2 h-4 w-4" />
          Update delay
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update cancellation delay.</DialogTitle>
          <DialogDescription>
            Increase booking confidence: Flexible cancellation policies attract hesitant travelers, leading to higher
            booking volumes and overall revenue. Be competitive, attract more guests!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormLabel>Delay</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <FormField
                  control={form.control}
                  name="multiplier"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="1" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="timeInterval"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a time interval" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Seconds</SelectItem>
                          <SelectItem value="60">Minutes</SelectItem>
                          <SelectItem value="3600">Hours</SelectItem>
                          <SelectItem value="86400">Days</SelectItem>
                          <SelectItem value="604800">Weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <FormDescription className="pb-6 pt-2">Choose the multiplier and time interval.</FormDescription>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Update delay</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
