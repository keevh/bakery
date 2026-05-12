"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Reveals its children with a fade + slide-up when scrolled into view (once).
 * Honors prefers-reduced-motion.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.5, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Fade + slide-up on mount (for above-the-fold hero content). */
export function FadeIn({
  children,
  delay = 0,
  y = 16,
  className,
  ...rest
}: { children: ReactNode; delay?: number; y?: number } & HTMLMotionProps<"div">) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
