"use client";

import { motion, useReducedMotion } from "motion/react";
export function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{
        type: "spring",
        stiffness: 90,
        damping: 22,
        mass: 0.6,
        delay: delay / 1000,
      }}
    >
      {children}
    </motion.div>
  );
}
