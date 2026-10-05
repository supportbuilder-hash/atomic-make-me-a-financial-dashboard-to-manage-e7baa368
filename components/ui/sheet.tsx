"use client";

// FIXED FILE — do not edit. Side panel (drawer) — same API as Dialog plus `side`.
import { ModalShell, type DialogProps } from "@/components/ui/dialog";

export type SheetSide = "left" | "right" | "top" | "bottom";

export interface SheetProps extends DialogProps {
  side?: SheetSide;
}

const SIDES: Record<SheetSide, string> = {
  right: "m-0 ml-auto h-full max-h-full w-[85vw] max-w-sm border-y-0 border-r-0",
  left: "m-0 mr-auto h-full max-h-full w-[85vw] max-w-sm border-y-0 border-l-0",
  top: "m-0 mb-auto w-full max-w-full border-x-0 border-t-0",
  bottom: "m-0 mt-auto w-full max-w-full border-x-0 border-b-0",
};

export function Sheet({ side = "right", ...props }: SheetProps) {
  return <ModalShell {...props} panelClassName={SIDES[side]} />;
}

export default Sheet;
