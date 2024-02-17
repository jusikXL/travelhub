'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { getAddress, isAddress, parseEventLogs } from 'viem';
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
import { organisationAbi } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';
import addHotel, { AddHotel } from '../api-interactions/add-hotel';

const formSchema = z.object({
  hotelAddress: z.coerce
    .string()
    .trim()
    .refine((value) => isAddress(value))
    .transform((value) => getAddress(value)),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateHotel({ organisationAddress }: { organisationAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (newHotel: AddHotel) => {
      return addHotel(organisationAddress, newHotel);
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const txPromise = writeContract(config, {
      address: organisationAddress,
      abi: organisationAbi,
      functionName: 'removeHotel',
      args: [values.hotelAddress],
    });

    const resultPromise = txPromise.then((tx) => {
      return client.waitForTransactionReceipt({
        hash: tx,
      });
    });

    toast.promise(resultPromise, {
      loading: 'Removing hotel...',

      success: () => {
        setIsPending(false);
        queryClient.invalidateQueries({ queryKey: ['organisations', organisationAddress] });
        queryClient.invalidateQueries({ queryKey: ['hotels'], exact: true });
        return 'Hotel removed!';
      },

      error: () => {
        setIsPending(false);
        return 'Failed to remove the hotel!';
      },
    });

    setOpen(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isPending || (isMounted && !isConnected)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Remove hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Remove the hotel</DialogTitle>
          <DialogDescription>
            Streamline your offerings: Delete outdated or underperforming hotels to focus resources on high-potential
            properties. Prioritize what resonates with guests and maximize returns!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="hotelAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel address</FormLabel>
                    <FormControl>
                      <Input placeholder="0x0000000000000000000000000000000000000000" {...field} />
                    </FormControl>
                    <FormDescription>The hotel to remove.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Remove hotel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
