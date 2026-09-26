"use client";

import { Typography, Tooltip } from "@heroui/react";
import {
  MdBadge,
  MdCheckCircle,
  MdGavel,
  MdHome,
  MdPayments,
  MdRateReview,
  MdReceiptLong,
  MdSave,
  MdSend,
} from "react-icons/md";
import { FaFileContract, FaUsers } from "react-icons/fa";
import { WordAnimator } from "./word-animator";
import { NewItemsLoading } from "./new-items-loading";
import { FloatingBadge } from "./floating-badge";
import { GlowBadge } from "./glow-badge";
import { SplitCta } from "@/components/home/split-cta";
import {
  SOCIAL_PLATFORMS,
  getPlatformFallbackIcon,
} from "@/sanity/lib/socialPlatforms";
import type { FooterSocialLink } from "@/components/shell/footer";

const rotatingWords = ["عقدك السكني", "عقدك التجاري", "عقد مكتبك", "عقد محلك"];

const features = [
  { icon: MdSave, label: "حفظ تلقائي للمسودة" },
  { icon: MdRateReview, label: "مراجعة قبل الإرسال" },
  { icon: MdReceiptLong, label: "عرض الرسوم مقدماً" },
];

const steps = [
  { name: "صفة مقدم الطلب", icon: MdBadge },
  { name: "بيانات الأطراف", icon: FaUsers },
  { name: "الصك والموقع", icon: MdGavel },
  { name: "شروط العقد", icon: FaFileContract },
  { name: "بيانات الوحدة", icon: MdHome },
  { name: "المراجعة والإرسال", icon: MdSend },
];

export function Hero({
  socialLinks,
}: {
  socialLinks?: FooterSocialLink[] | null;
}) {
  const links = (socialLinks ?? []).filter((l) => l.url);

  return (
    <section className="relative -mt-14 flex min-h-svh w-full flex-col justify-center overflow-hidden px-4 pt-14 pb-20 before:pointer-events-none before:absolute before:inset-0 before:z-10 before:bg-[url(/images/noise.gif)] before:bg-repeat before:opacity-[0.05] before:content-[''] sm:px-6 md:-mt-12.5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--accent)_30%,transparent)_1px,transparent_1px)] mask-[radial-gradient(70%_70%_at_50%_30%,black,transparent)] bg-size-[22px_22px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(85%_70%_at_50%_0%,color-mix(in_oklab,var(--accent)_45%,transparent),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_45%_at_50%_100%,color-mix(in_oklab,var(--accent)_25%,transparent),transparent)]"
      />
      <div className="relative mx-auto flex w-full flex-col items-center gap-6 text-center">
        <GlowBadge>توثيق عقود الإيجار - سكني وتجاري</GlowBadge>

        <Typography
          type="h1"
          weight="bold"
          className="flex max-w-3xl flex-wrap items-center justify-center gap-2 gap-x-3"
        >
          <span>قدّم طلب توثيق</span>
          <WordAnimator words={rotatingWords} className="text-accent" />
        </Typography>

        <Typography type="body" color="muted" className="max-w-2xl">
          بيانات الأطراف والصك والعقد بخطوات واضحة، مع حفظ تلقائي للمسودة
          ومراجعة قبل الإرسال.
        </Typography>

        <SplitCta />

        <div className="flex flex-col items-center gap-3">
          <p className="text-muted text-sm font-medium">
            ما هي خطوات تقديم الطلب؟
          </p>
          <div className="flex items-center justify-center -space-x-3 space-x-reverse">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Tooltip key={step.name} delay={0}>
                  <Tooltip.Trigger
                    aria-label={step.name}
                    className="rounded-full"
                  >
                    <div className="relative z-0 transition-transform hover:z-10 hover:scale-110">
                      <div className="border-border bg-card flex size-12 items-center justify-center overflow-hidden rounded-full border shadow-xs md:size-14">
                        <Icon
                          aria-hidden="true"
                          className="text-accent size-5"
                        />
                      </div>
                    </div>
                  </Tooltip.Trigger>
                  <Tooltip.Content showArrow>
                    <Tooltip.Arrow />
                    <p>{step.name}</p>
                  </Tooltip.Content>
                </Tooltip>
              );
            })}
          </div>
        </div>

        <ul className="text-muted flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          {features.map((f) => (
            <li key={f.label} className="flex items-center gap-1.5">
              <f.icon className="text-accent size-4" />
              {f.label}
            </li>
          ))}
        </ul>

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

        {links.length > 0 && (
          <div className="flex items-center justify-center gap-1">
            {links.map((l, i) => {
              const meta = SOCIAL_PLATFORMS[l.platform];
              const Icon = meta?.icon ?? getPlatformFallbackIcon();
              return (
                <a
                  key={`${l.platform}-${i}`}
                  href={l.url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={meta?.title ?? l.platform}
                  className="text-muted hover:bg-alt hover:text-alt-foreground inline-flex size-10 items-center justify-center rounded-full transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
