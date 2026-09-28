"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export function WordAnimator({
  words,
  interval = 2500,
  className,
}: {
  words: string[];
  interval?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();
  const longest = words.reduce(
    (a, b) => (b.length > a.length ? b : a),
    words[0] ?? "",
  );

  useEffect(() => {
    if (shouldReduceMotion || words.length < 2) return;
    const id = setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      interval,
    );
    return () => clearInterval(id);
  }, [shouldReduceMotion, words.length, interval]);

  return (
    <span className={cn("relative grid align-bottom", className)} role="text">
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
      >
        {longest}
      </span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={shouldReduceMotion ? "static" : index}
          className="col-start-1 row-start-1 justify-self-start whitespace-nowrap"
          initial={shouldReduceMotion ? false : { y: "60%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={shouldReduceMotion ? undefined : { y: "-60%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="border-border bg-default relative inline-block overflow-hidden rounded-md border pe-3">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 bg-[url(/images/noise.gif)] opacity-10"
            />
            <span className="from-accent/70 to-accent bg-linear-to-t bg-clip-text text-transparent">
              {words[shouldReduceMotion ? 0 : index]}
            </span>
          </span>
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
