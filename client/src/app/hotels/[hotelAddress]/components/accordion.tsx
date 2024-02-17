import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

export function AccordionComponent({
  usefulInfo,
  contacts,
  cancellationDelay,
}: {
  usefulInfo: string | undefined;
  contacts: string | undefined;
  cancellationDelay: string | undefined;
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Useful info</AccordionTrigger>
        {usefulInfo ? <AccordionContent>{usefulInfo}</AccordionContent> : <Skeleton className="h-16" />}
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Contacts</AccordionTrigger>
        {contacts ? <AccordionContent>{contacts}</AccordionContent> : <Skeleton className="h-16" />}
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Cancellation delay</AccordionTrigger>
        {cancellationDelay ? (
          <AccordionContent>{Number(cancellationDelay) / 1000} hours</AccordionContent>
        ) : (
          <Skeleton className="h-16" />
        )}
      </AccordionItem>
    </Accordion>
  );
}
