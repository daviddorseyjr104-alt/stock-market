"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Route template: re-mounts on every in-app navigation, giving each page a
 * quick fade + slide-up entrance. Reduced-motion users get an instant render.
 * The transform is removed once the animation settles (framer-motion resets
 * it to `none`), so sticky positioning inside pages keeps working.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.21, 0.6, 0.35, 1] }}
    >
      {children}
    </motion.div>
  );
}
