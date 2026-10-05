// FIXED FILE — do not edit. Native <select> styled with theme role tokens.
// Pass `options` OR <option> children.
import { forwardRef, type SelectHTMLAttributes } from "react";
import { fieldClass } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, options, placeholder, children, ...props },
  ref,
) {
  return (
    <select ref={ref} className={cn("h-10", fieldClass, className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {(options ?? []).map((o, i) => (
        <option key={i} value={o.value}>
          {o.label}
        </option>
      ))}
      {children}
    </select>
  );
});

export default Select;
