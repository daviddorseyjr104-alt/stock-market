import type { Transition, Variants } from "framer-motion";

/**
 * Shared framer-motion presets, the single source of truth for motion
 * across Campus Capital. Import these instead of hand-rolling variants so
 * every page animates with the same physics.
 *
 * Usage:
 *   <motion.div variants={fadeUp} initial="hidden" animate="show" />
 *
 *   <motion.ul variants={staggerContainer} initial="hidden" whileInView="show" viewport={viewportOnce}>
 *     <motion.li variants={fadeUp} />
 *   </motion.ul>
 */

/** Soft, premium spring, use as `transition={springSoft}` for hovers, pops, layout. */
export const springSoft: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 0.9,
};

/** Rise-and-fade entrance. Pairs with `staggerContainer` for lists. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.6, 0.35, 1] },
  },
};

/** Plain opacity entrance for backdrops, overlays, and secondary content. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.45, ease: "easeOut" } },
};

/** Parent wrapper that staggers `fadeUp` / `pop` children. */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

/** Springy scale-in for badges, stats, and celebratory moments. */
export const pop: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: springSoft },
};

/** Standard `viewport` prop for whileInView reveals, fire once, slightly early. */
export const viewportOnce = { once: true, margin: "-40px" } as const;
