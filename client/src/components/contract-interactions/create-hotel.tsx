'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { Building2 } from 'lucide-react';
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
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import addHotel, { AddHotel } from '../api-interactions/add-hotel';
import { Textarea } from '../ui/textarea';

const formSchema = z.object({
  owner: z.coerce
    .string()
    .trim()
    .refine((value) => isAddress(value))
    .transform((value) => getAddress(value)),
  title: z.string().min(1).max(100),
  subtitle: z.string().min(1).max(100),
  description: z.string().min(1).max(600),
  contacts: z.string().min(1).max(100),
  city: z.string().min(1).max(100),
  location: z.string().min(1).max(500),
  usefulInfo: z.string().min(1).max(300),
  image: z.coerce
    .string()
    .url()
    .refine((value) => {
      return ACCEPTED_IMAGE_TYPES.some((acceptedType) => value.includes(acceptedType));
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateHotel({ organisationAddress }: { organisationAddress: `0x${string}` }) {
  const isMounted = useMounted();
  const { isConnected, address } = useAccount();
  const client = usePublicClient();

  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      owner: address,
    },
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
      functionName: 'createHotel',
      args: [values.owner],
      gas: BigInt(10000000),
    });
    const resultPromise = txPromise.then((tx) => {
      return client.waitForTransactionReceipt({
        hash: tx,
      });
    });

    toast.promise(resultPromise, {
      loading: 'Creating hotel...',

      success: (receipt) => {
        const logs = parseEventLogs({
          abi: organisationAbi,
          eventName: 'HotelCreated',
          logs: receipt.logs,
        });

        const apiPromise = mutateAsync({
          contacts: values.contacts,
          owner: values.owner,
          address: logs[0].args.hotelAddress,
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          image: values.image,
          city: values.city,
          location: values.location,
          organisation: organisationAddress,
          cancellation_delay: 86400,
          useful_info: values.usefulInfo,
        });

        toast.promise(apiPromise, {
          loading: 'Attaching metadata...',

          success: () => {
            setIsPending(false);
            queryClient.invalidateQueries({ queryKey: ['organisations', organisationAddress] });
            queryClient.invalidateQueries({ queryKey: ['hotels'], exact: true });
            return 'Hotel metadata attached!';
          },

          error: (err: any) => {
            setIsPending(false);
            console.error(err);
            return 'Failed to attach metadata!';
          },
        });
        return 'Hotel created!';
      },

      error: () => {
        setIsPending(false);
        return 'Failed to create a hotel!';
      },
    });

    setOpen(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isPending || (isMounted && !isConnected)}>
          <Building2 className="mr-2 h-4 w-4" />
          Create hotel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new hotel</DialogTitle>
          <DialogDescription>
            Expand your reach & revenue. Attract new guests by adding exciting options to your portfolio. Let&apos;s
            grow together!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-6 pb-6">
              <FormField
                control={form.control}
                name="owner"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <Input placeholder="0x0000000000000000000000000000000000000000" {...field} />
                    </FormControl>
                    <FormDescription>The owner of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Hilton Incorporated" {...field} />
                    </FormControl>
                    <FormDescription>The title of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="subtitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subtitle</FormLabel>
                    <FormControl>
                      <Input placeholder="Best hotel" {...field} />
                    </FormControl>
                    <FormDescription>The subtitle of the new hotel.</FormDescription>
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
                      <Textarea
                        placeholder="Tell us a little bit about your hotel"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The description of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="usefulInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Useful info</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Include any useful information about your hotel"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The useful info of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contacts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contacts</FormLabel>
                    <FormControl>
                      <Input placeholder="+38012432131" {...field} />
                    </FormControl>
                    <FormDescription>The contacts of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Dubai" {...field} />
                    </FormControl>
                    <FormDescription>The city of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Smith's street 15/A" {...field} />
                    </FormControl>
                    <FormDescription>The location of the new hotel.</FormDescription>
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
                    <FormDescription>The image of the new hotel.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Create hotel</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
