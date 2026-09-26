"use client";

import { Typography } from "@heroui/react";
import {
  MdCheckCircle,
  MdPayments,
  MdRateReview,
  MdReceiptLong,
  MdSave,
} from "react-icons/md";
import { WordAnimator } from "@/components/hero/word-animator";
import { NewItemsLoading } from "@/components/hero/new-items-loading";
import { FloatingBadge } from "@/components/hero/floating-badge";
import { GlowBadge } from "@/components/hero/glow-badge";
import { SplitCta } from "@/components/home/split-cta";

const rotatingWords = ["عقدك السكني", "عقدك التجاري", "عقد مكتبك", "عقد محلك"];

const features = [
  { icon: MdSave, label: "حفظ تلقائي للمسودة" },
  { icon: MdRateReview, label: "مراجعة قبل الإرسال" },
  { icon: MdReceiptLong, label: "عرض الرسوم مقدماً" },
];

export function Cta() {
  return (
    <section className="border-border bg-surface relative overflow-hidden rounded-3xl border before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-[url(/images/noise.gif)] before:bg-repeat before:opacity-[0.05] before:content-['']">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--accent)_30%,transparent)_1px,transparent_1px)] mask-[radial-gradient(70%_70%_at_50%_30%,black,transparent)] bg-size-[22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent)]"
      />
      <div className="relative grid items-center gap-8 p-6 md:p-10 lg:grid-cols-2">
        <div className="flex flex-col items-start gap-4">
          <GlowBadge>توثيق عقود الإيجار - سكني وتجاري</GlowBadge>
          <Typography
            type="h2"
            weight="bold"
            className="flex flex-wrap items-center gap-2 gap-x-3"
          >
            <span>تحتاج توثيق</span>
            <WordAnimator words={rotatingWords} className="text-accent" />
          </Typography>
          <Typography type="body" color="muted">
            قدّم طلبك بخطوات واضحة مع حفظ تلقائي للمسودة ومراجعة قبل الإرسال.
          </Typography>
          <SplitCta />
          <ul className="text-muted flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-1.5">
                <f.icon className="text-accent size-4" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <FloatingBadge
            className="inset-s-0 -top-3"
            icon={MdPayments}
            label="رسوم محسوبة مقدماً"
            duration={4}
          />
          <FloatingBadge
            className="inset-e-2 -bottom-3"
            icon={MdCheckCircle}
            label="متابعة برقم الطلب"
            duration={5}
          />
          <NewItemsLoading />
        </div>
      </div>
    </section>
  );
}
