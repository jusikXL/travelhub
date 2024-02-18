'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeContract } from '@wagmi/core';
import { FilePlus2 } from 'lucide-react';
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
import { organisationFactoryConfig } from '@/config/contracts';
import { config } from '@/config/wagmi';
import { useMounted } from '@/hooks/use-mounted';
import { ACCEPTED_IMAGE_TYPES } from '@/lib/constants';
import { addOrganisation } from '../api-interactions';
import { AddOrganisation } from '../api-interactions/add-organisation';
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
  image: z.coerce
    .string()
    .url()
    .refine((value) => {
      return ACCEPTED_IMAGE_TYPES.some((acceptedType) => value.includes(acceptedType));
    }),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateOrganisation() {
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
    mutationFn: (newOrganisation: AddOrganisation) => {
      return addOrganisation(newOrganisation);
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);

    const txPromise = writeContract(config, {
      ...organisationFactoryConfig,
      functionName: 'createOrganisation',
      args: [values.owner],
      gas: BigInt(10000000),
    });

    const resultPromise = txPromise.then((tx) => {
      return client.waitForTransactionReceipt({
        hash: tx,
      });
    });

    toast.promise(resultPromise, {
      loading: 'Creating organisation...',

      success: (receipt) => {
        const logs = parseEventLogs({
          abi: organisationFactoryConfig.abi,
          eventName: 'OrganisationCreated',
          logs: receipt.logs,
        });

        const apiPromise = mutateAsync({
          contacts: values.contacts,
          owner: values.owner,
          address: logs[0].args.organisationAddress,
          title: values.title,
          subtitle: values.subtitle,
          description: values.description,
          image: values.image,
        });

        toast.promise(apiPromise, {
          loading: 'Attaching metadata...',

          success: () => {
            setIsPending(false);
            queryClient.invalidateQueries({ queryKey: ['organisations'], exact: true });
            queryClient.invalidateQueries({ queryKey: ['organisations', values.owner] });
            return 'Organisation metadata attached!';
          },

          error: (err: any) => {
            setIsPending(false);
            console.error(err);
            return 'Failed to attach metadata!';
          },
        });
        return 'Organisation created!';
      },

      error: () => {
        setIsPending(false);
        return 'Failed to create an organisation!';
      },
    });

    setOpen(false);
  }

  return (
    <Dialog onOpenChange={setOpen} open={open} modal={true}>
      <DialogTrigger asChild>
        <Button disabled={isPending || (isMounted && !isConnected)}>
          <FilePlus2 className="mr-2 h-4 w-4" />
          Create organisation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-scroll sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new organisation</DialogTitle>
          <DialogDescription>
            Bring your idea to life! Start a new organization to collaborate with others and make a difference.
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
                    <FormDescription>The owner of the new organisation.</FormDescription>
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
                    <FormDescription>The title of the new organisation.</FormDescription>
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
                      <Input placeholder="Best organisation" {...field} />
                    </FormControl>
                    <FormDescription>The subtitle of the new organisation.</FormDescription>
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
                        placeholder="Tell us a little bit about your organisation"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>The description of the new organisation.</FormDescription>
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
                    <FormDescription>The contacts of the new organisation.</FormDescription>
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
                    <FormDescription>The image of the new organisation.</FormDescription>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="grid grid-cols-2 gap-4 ">
              <Button type="submit">Create organisation</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
