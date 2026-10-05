"use client";

import { useEffect, useRef, useState } from "react";
import type { Variants } from "motion/react";
import { BlogPagination } from "@/components/blog/blog-pagination";
import {
  TestimonialCard,
  type TestimonialItem,
} from "@/components/home/testimonials";

const PAGE_SIZE = 12;

const TONES = ["default", "accent", "deep"] as const;

const revealVariants: Variants = {
  visible: (i: unknown) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      delay: Math.min((i as number) * 0.15, 1),
      duration: 0.5,
    },
  }),
  hidden: {
    filter: "blur(10px)",
    y: -20,
    opacity: 0,
  },
};

export function TestimonialsGrid({ items }: { items: TestimonialItem[] }) {
  const [page, setPage] = useState(1);
  const topRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const visible = items.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    topRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [current]);

  return (
    <div ref={topRef} className="flex scroll-mt-24 flex-col gap-8">
      <p aria-live="polite" className="sr-only">
        صفحة {current} من {totalPages}
      </p>
      <div
        ref={timelineRef}
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
      >
        {visible.map((item, i) => (
          <TestimonialCard
            key={item._key}
            item={item}
            tone={TONES[i % TONES.length]}
            index={i}
            timelineRef={timelineRef}
            revealVariants={revealVariants}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mx-auto">
          <BlogPagination
            page={current}
            totalPages={totalPages}
            label="التنقل بين صفحات الآراء"
            onNavigate={(p) => setPage(p)}
          />
        </div>
      )}
    </div>
  );
}
