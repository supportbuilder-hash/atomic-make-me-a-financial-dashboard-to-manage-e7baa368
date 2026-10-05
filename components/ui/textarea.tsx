// FIXED FILE — do not edit. Textarea primitive (theme role tokens only).
import { forwardRef, type TextareaHTMLAttributes } from "react";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea({ className, rows = 4, ...props }, ref) {
  return <textarea ref={ref} rows={rows} className={cn("min-h-24", fieldClass, className)} {...props} />;
});

export default Textarea;
