"use client";

// FIXED FILE — do not edit. Wrap every top-level section in <Reveal>.
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { fadeInUp } from "@/lib/motion";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [alreadyVisible, setAlreadyVisible] = useState(false);

  // Sections already on-screen at first paint never get a scroll-into-view
  // event; animate them immediately instead of leaving them at opacity 0.
  useEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight && rect.bottom > 0) setAlreadyVisible(true);
  }, []);

  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      ref={ref}
      className={className}
      variants={fadeInUp}
      initial="hidden"
      {...(alreadyVisible
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: { once: true, margin: "-80px" } })}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}

export default Reveal;
