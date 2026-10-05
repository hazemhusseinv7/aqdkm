"use client";

import { motion, useReducedMotion } from "motion/react";
import { MdCheckCircle } from "react-icons/md";

export function FloatingBadge({
  className,
  icon: Icon,
  label,
  duration = 4,
}: {
  className?: string;
  icon: typeof MdCheckCircle;
  label: string;
  duration?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={`border-border bg-surface text-muted absolute z-10 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs shadow-lg ${className ?? ""}`}
      animate={shouldReduceMotion ? undefined : { y: [0, -8, 0] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <Icon className="text-accent size-4" />
      {label}
    </motion.span>
  );
}
