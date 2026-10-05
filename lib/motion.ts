// FIXED FILE — do not edit. Shared framer-motion variants; intensity (1-10)
// comes from content/site.json. States are always "hidden" -> "visible".
import type { Variants } from "framer-motion";
import { MOTION } from "@/lib/data";

export const MOTION_DISTANCE = 8 + MOTION.intensity * 3;
export const MOTION_DURATION = 0.35 + MOTION.intensity * 0.03;

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: MOTION_DISTANCE },
  visible: { opacity: 1, y: 0, transition: { duration: MOTION_DURATION, ease: "easeOut" } },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: MOTION_DURATION, ease: "easeOut" } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: { opacity: 1, scale: 1, transition: { duration: MOTION_DURATION, ease: "easeOut" } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 + MOTION.intensity * 0.01 } },
};
