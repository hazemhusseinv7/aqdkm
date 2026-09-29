"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { featureIcon } from "@/components/home/section-icons";
import { CurrencyText } from "@/lib/currency-text";

export type MarketingPoint = {
  text: string;
  icon: string | null;
};

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

function FinalCard({ points }: { points: MarketingPoint[] }) {
  return (
    <div className="border-border bg-surface relative flex flex-col gap-2 overflow-hidden rounded-2xl border p-3">
      <Image
        src="/logo/logo.svg"
        alt=""
        aria-hidden="true"
        width={512}
        height={348}
        className="pointer-events-none absolute inset-e-0 -bottom-8.5 size-28 opacity-40 select-none dark:hidden"
      />
      <Image
        src="/logo/logo-alt.svg"
        alt=""
        aria-hidden="true"
        width={512}
        height={348}
        className="pointer-events-none absolute inset-e-0 -bottom-8.5 hidden size-28 opacity-20 select-none dark:block"
      />
      {points.map((point, i) => {
        const Icon = featureIcon(point.icon);
        return (
          <span
            key={point.text}
            className={
              i === 0
                ? "flex items-center gap-1.5 text-sm font-medium"
                : "text-muted flex items-center gap-1.5 text-xs"
            }
          >
            <Icon
              className={
                i === 0
                  ? "text-accent size-4 shrink-0"
                  : "text-accent size-3.5 shrink-0"
              }
            />
            <CurrencyText text={point.text} />
          </span>
        );
      })}
    </div>
  );
}

export function NewItemsLoading({
  className,
  points,
}: {
  className?: string;
  points?: MarketingPoint[] | null;
}) {
  const shouldReduceMotion = useReducedMotion();
  const [stage, setStage] = useState(shouldReduceMotion ? 2 : 0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timers = STAGE_DELAYS.map((delay, i) =>
      setTimeout(() => setStage(i + 1), delay),
    );
    return () => timers.forEach(clearTimeout);
  }, [shouldReduceMotion]);

  if (!points?.length) return null;

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
          <FinalCard points={points} />
        </motion.div>
      )}
    </div>
  );
}
