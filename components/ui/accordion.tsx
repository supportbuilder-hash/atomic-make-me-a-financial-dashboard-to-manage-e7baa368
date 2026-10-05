// FIXED FILE — do not edit. Accordion on native <details>/<summary>: keyboard + screen-reader
// support built in, no client JS. Usage:
// <Accordion><AccordionItem><AccordionTrigger>Q</AccordionTrigger><AccordionContent>A</AccordionContent></AccordionItem></Accordion>
import { ChevronDown } from 'lucide-react';
import type { DetailsHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("divide-y divide-border rounded-lg border border-border", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: DetailsHTMLAttributes<HTMLDetailsElement>) {
  return <details className={cn("group px-5", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <summary
      className={cn(
        "flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-medium text-foreground",
        "rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden",
        className,
      )}
      {...props}
    >
      {children}
      <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
    </summary>
  );
}

export function AccordionContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("pb-4 text-sm leading-relaxed text-muted-foreground", className)} {...props} />;
}

export default Accordion;
