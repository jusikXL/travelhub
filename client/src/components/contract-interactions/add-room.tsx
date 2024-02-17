'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { parseEther } from 'viem';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
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
import { useMounted } from '@/hooks/use-mounted';
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import addRoom, { AddRoom } from '../api-interactions/add-room';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  id: z.coerce.number().positive(),
  price: z.coerce.number().min(5),
  description: z.string().min(1).max(600),
  image: z.coerce
    .string()
    .url()
    .refine((value) => {
      return ACCEPTED_IMAGE_TYPES.some((acceptedType) => value.includes(acceptedType));
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function AddRoom({ hotelAddress }: { hotelAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const { isConnected } = useAccount();
  const client = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 1,
      price: 5,
    },
  });

  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation({
    mutationFn: (newRoom: AddRoom) => {
      return addRoom(hotelAddress, newRoom);
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const txPromise = writeContractAsync({
      address: hotelAddress,
      abi: hotelAbi,
      functionName: 'addRoom',
      args: [BigInt(values.id), parseEther(values.price.toString())],
    });
    const resultPromise = txPromise.then((tx) => {
      return client.waitForTransactionReceipt({
        hash: tx,
      });
    });

    toast.promise(resultPromise, {
      loading: 'Creating room...',

      success: () => {
        const apiPromise = mutateAsync({
          id: values.id.toString(),
          price: parseEther(values.price.toString()).toString(),
          description: values.description,
          image: values.image,
          hotel: hotelAddress,
        });

        toast.promise(apiPromise, {
          loading: 'Attaching metadata...',

          success: () => {
            setIsPending(false);
            queryClient.invalidateQueries({ queryKey: ['hotels', hotelAddress] });
            return 'Room metadata attached!';
          },

          error: (err: any) => {
            setIsPending(false);
            console.error(err);
            return 'Failed to attach metadata!';
          },
        });
        return 'Room created!';
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
          <Plus className="mr-2 h-4 w-4" />
          Add room
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new room to your hotel</DialogTitle>
          <DialogDescription>
            Maximize guest capacity & comfort. Offer more options for larger groups or solo travelers seeking space.
            Increase revenue and exceed expectations!
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
                    <FormLabel>Room ID</FormLabel>
                    <FormControl>
                      <Input placeholder="1" {...field} />
                    </FormControl>
                    <FormDescription>Unique identifier of the new room.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input placeholder="5" {...field} />
                    </FormControl>
                    <FormDescription>Price per night. Min $5</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about your room" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>The description of the new room.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://sth.png" {...field} />
                    </FormControl>
                    <FormDescription>The image of the new room.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Add room</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
