"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  MdCheckCircle,
  MdHourglassTop,
  MdInfo,
  MdPayments,
} from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/fees";

const STAGE_DELAYS = [500, 1100];

function SkeletonRows() {
  return (
    <div
      className="border-border bg-surface flex flex-col gap-2 rounded-2xl border p-3"
      aria-hidden="true"
    >
      <span className="flex items-center gap-1.5">
        <span className="bg-muted/40 size-4 shrink-0 animate-pulse rounded-full" />
        <span className="bg-muted/40 h-4 w-28 animate-pulse rounded-full" />
      </span>
      <span className="flex items-center justify-between">
        <span className="bg-muted/40 h-3 w-20 animate-pulse rounded-full" />
        <span className="bg-muted/40 h-3 w-24 animate-pulse rounded-full" />
      </span>
      <span className="flex items-center justify-between">
        <span className="bg-muted/40 h-3 w-14 animate-pulse rounded-full" />
        <span className="bg-muted/25 h-3 w-20 animate-pulse rounded-full" />
      </span>
    </div>
  );
}

function FinalCard() {
  return (
    <div className="border-border bg-surface flex flex-col gap-2 rounded-2xl border p-3">
      <span className="flex items-center gap-1.5 text-sm font-medium">
        <MdCheckCircle className="text-accent size-4 shrink-0" />
        تم استلام الطلب
      </span>
      <span className="text-muted flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <FaHome className="text-accent size-3.5 shrink-0" />
          عقد سكني
        </span>
        <strong className="flex items-center gap-1 tabular-nums">
          <MdPayments className="text-accent size-3.5 shrink-0" />
          {formatCurrency(250)}
        </strong>
      </span>
      <span className="text-muted flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5">
          <MdInfo className="text-accent size-3.5 shrink-0" />
          الحالة
        </span>
        <span className="flex items-center gap-1.5">
          <MdHourglassTop className="text-accent size-3.5 shrink-0" />
          قيد المراجعة
        </span>
      </span>
    </div>
  );
}

export function NewItemsLoading({ className }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState(shouldReduceMotion ? 2 : 0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timers = STAGE_DELAYS.map((delay, i) =>
      setTimeout(() => setStage(i + 1), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  return (
    <div className={cn("min-h-24", className)} aria-live="polite">
      {stage < 2 ? (
        <motion.div
          key={`stage-${stage}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          <SkeletonRows />
        </motion.div>
      ) : (
        <motion.div
          key="final"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <FinalCard />
        </motion.div>
      )}
    </div>
  );
}
