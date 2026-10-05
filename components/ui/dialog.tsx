"use client";

// FIXED FILE — do not edit. Modal dialog on the native <dialog> element (focus trap,
// Escape-to-close and top-layer stacking come from the browser). Controlled
// (`open` + `onOpenChange`) or uncontrolled with a `trigger` label.
import { X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DialogProps {
  title: string;
  description?: string;
  children?: ReactNode;
  /** Label of the button that opens the dialog (omit when controlling `open` yourself). */
  trigger?: ReactNode;
  triggerVariant?: ButtonVariant;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeLabel?: string;
  className?: string;
}

/** Shared by Dialog and Sheet: `panelClassName` sets size/position. */
export function ModalShell({
  title,
  description,
  children,
  trigger,
  triggerVariant = "default",
  open,
  onOpenChange,
  closeLabel = "Close",
  className,
  panelClassName,
}: DialogProps & { panelClassName: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [inner, setInner] = useState(false);
  const isOpen = open ?? inner;
  const titleId = useId();
  const setOpen = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (isOpen && !el.open) el.showModal();
    if (!isOpen && el.open) el.close();
  }, [isOpen]);

  // A click on the ::backdrop targets the <dialog> itself (the panel content sits in an inner div).
  const onBackdrop = (e: MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <>
      {trigger != null && (
        <Button variant={triggerVariant} onClick={() => setOpen(true)} aria-haspopup="dialog">
          {trigger}
        </Button>
      )}
      <dialog
        ref={ref}
        aria-labelledby={titleId}
        onClose={() => setOpen(false)}
        onClick={onBackdrop}
        className={cn(
          "border border-border bg-background p-0 text-foreground shadow-xl backdrop:bg-foreground/50",
          panelClassName,
        )}
      >
        <div className={cn("relative h-full p-6", className)}>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={closeLabel}
            className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X className="h-4 w-4" />
          </button>
          <h2 id={titleId} className="pr-8 font-display text-lg font-semibold">
            {title}
          </h2>
          {description && <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>}
          {children != null && <div className="mt-4">{children}</div>}
        </div>
      </dialog>
    </>
  );
}

export function Dialog(props: DialogProps) {
  return <ModalShell {...props} panelClassName="w-full max-w-lg rounded-lg" />;
}

export default Dialog;
