"use client";
import { useRef } from "react";
import Link from "next/link";
import { buttonVariants } from "@heroui/react";
import type { Variants } from "framer-motion";
import {
  FaQuoteLeft,
  FaQuoteRight,
  FaStar,
  FaUser,
  FaUserCheck,
} from "react-icons/fa";
import { MdArrowBack, MdLocationOn } from "react-icons/md";
import { TimelineAnimation } from "@/components/ui/timeline-animation";
import { formatDualDate } from "@/lib/request-display";
import { CurrencyText } from "@/lib/currency-text";
import { cn } from "@/lib/utils";

type Tone = "default" | "accent" | "deep";

export type TestimonialItem = {
  _key: string;
  quote: string;
  name: string;
  role: string;
  city: string;
  date: string | null;
  rating: number | null;
};

const SLOT_TONES: Tone[] = [
  "default",
  "accent",
  "deep",
  "deep",
  "deep",
  "accent",
  "default",
];

const toneCard: Record<Tone, string> = {
  default: "bg-surface text-foreground",
  accent: "bg-accent text-white",
  deep: "border-accent/20 bg-accent/10 text-foreground",
};

const toneAvatar: Record<Tone, string> = {
  default: "bg-accent/10 text-accent",
  accent: "bg-white/20 text-white",
  deep: "bg-alt/20 text-alt",
};

const toneRole: Record<Tone, string> = {
  default: "text-muted",
  accent: "opacity-70",
  deep: "text-muted",
};

const toneNameIcon: Record<Tone, string> = {
  default: "text-accent",
  accent: "text-white",
  deep: "text-accent",
};

const toneLocationIcon: Record<Tone, string> = {
  default: "text-muted",
  accent: "text-white/70",
  deep: "text-muted",
};

const toneStar: Record<Tone, string> = {
  default: "text-accent",
  accent: "text-white",
  deep: "text-accent",
};

const toneStarEmpty: Record<Tone, string> = {
  default: "text-muted opacity-40",
  accent: "text-white opacity-40",
  deep: "text-muted opacity-40",
};

type CardProps = {
  item: TestimonialItem;
  tone: Tone;
  index: number;
  timelineRef: React.RefObject<HTMLDivElement | null>;
  revealVariants: Variants;
  className?: string;
  avatarSize?: string;
  gridOverlay?: boolean;
};

export function TestimonialCard({
  item,
  tone,
  index,
  timelineRef,
  revealVariants,
  className,
  avatarSize = "h-16 w-16",
  gridOverlay = false,
}: CardProps) {
  const rating =
    item.rating == null
      ? null
      : Math.min(5, Math.max(1, Math.round(item.rating)));
  return (
    <TimelineAnimation
      animationNum={index}
      customVariants={revealVariants}
      timelineRef={timelineRef}
      className={cn(
        "border-border relative flex flex-col justify-between overflow-hidden rounded-2xl border p-5",
        toneCard[tone],
        className,
      )}
    >
      {gridOverlay && (
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 bottom-0 left-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--accent)_18%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--accent)_18%,transparent)_1px,transparent_1px)] mask-[radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] bg-size-[50px_56px]"
        />
      )}
      <div className="relative mt-auto">
        {rating != null && (
          <span
            className="flex items-center gap-0.5 pb-2"
            role="img"
            aria-label={`التقييم ${rating} من 5`}
          >
            {[1, 2, 3, 4, 5].map((s) => (
              <FaStar
                key={s}
                aria-hidden="true"
                className={cn(
                  "size-4",
                  s <= rating ? toneStar[tone] : toneStarEmpty[tone],
                )}
              />
            ))}
          </span>
        )}
        <p className="text-sm leading-7 2xl:text-base">
          <FaQuoteRight
            className="me-1 inline size-4 opacity-60"
            aria-hidden="true"
          />
          <CurrencyText text={item.quote} />
          <FaQuoteLeft
            className="ms-1 inline size-4 opacity-60"
            aria-hidden="true"
          />
        </p>
        <div className="flex items-end justify-between pt-5">
          <div className="space-y-1">
            <h3 className="flex items-center gap-1.5 text-lg font-bold lg:text-xl">
              <FaUserCheck
                className={cn("size-4 shrink-0", toneNameIcon[tone])}
                aria-hidden="true"
              />
              {item.name}
            </h3>
            {[item.role, item.city].filter(Boolean).length > 0 && (
              <p
                className={cn(
                  "flex items-center gap-1.5 text-sm lg:text-base",
                  toneRole[tone],
                )}
              >
                <MdLocationOn
                  className={cn("size-4 shrink-0", toneLocationIcon[tone])}
                  aria-hidden="true"
                />
                {[item.role, item.city].filter(Boolean).join(" - ")}
              </p>
            )}
            {item.date && (
              <p className={cn("text-xs lg:text-sm", toneRole[tone])}>
                <time dateTime={item.date}>
                  {formatDualDate(item.date) ?? item.date}
                </time>
              </p>
            )}
          </div>
          <span
            aria-hidden="true"
            className={cn(
              "flex shrink-0 items-center justify-center rounded-xl",
              avatarSize,
              toneAvatar[tone],
            )}
          >
            <FaUser className="size-7" aria-hidden="true" />
          </span>
        </div>
      </div>
    </TimelineAnimation>
  );
}

const SLOT_LAYOUT: {
  className?: string;
  avatarSize?: string;
  gridOverlay?: boolean;
}[] = [
  { className: "flex-6 lg:flex-7" },
  { className: "flex-4 lg:h-fit lg:flex-3 lg:shrink-0" },
  { avatarSize: "h-12 w-12 lg:h-16 lg:w-16" },
  { avatarSize: "h-12 w-12 lg:h-16 lg:w-16" },
  { avatarSize: "h-12 w-12 lg:h-16 lg:w-16" },
  { className: "flex-4 lg:flex-3" },
  { className: "flex-6 lg:flex-7", gridOverlay: true },
];

const SLOT_COLUMNS: number[][] = [
  [0, 1],
  [2, 3, 4],
  [5, 6],
];

function Testimonials({ items }: { items: TestimonialItem[] }) {
  const testimonialRef = useRef<HTMLDivElement>(null);

  if (items.length === 0) {
    return null;
  }
  const slots = items.slice(0, 7);

  const revealVariants: Variants = {
    visible: (i: unknown) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: (i as number) * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  return (
    <section
      className="relative h-full rounded-2xl py-14"
      ref={testimonialRef}
      aria-label="آراء العملاء"
    >
      <div className="mx-auto space-y-2 text-center">
        <TimelineAnimation
          as="h2"
          className="text-3xl font-bold xl:text-4xl"
          animationNum={0}
          customVariants={revealVariants}
          timelineRef={testimonialRef}
        >
          ماذا يقول عملاؤنا؟
        </TimelineAnimation>
        <TimelineAnimation
          as="p"
          className="text-muted mx-auto"
          animationNum={1}
          customVariants={revealVariants}
          timelineRef={testimonialRef}
        >
          تجارب حقيقية لملاك ومستأجرين وثّقوا عقودهم عبر عقدكم
        </TimelineAnimation>
      </div>
      <div className="p flex w-full flex-col gap-2 pt-10 pb-4 lg:grid lg:grid-cols-3 lg:py-10">
        {SLOT_COLUMNS.map((column, ci) => (
          <div
            key={ci}
            className={
              ci === 1
                ? "flex h-fit flex-col gap-2 md:flex lg:h-full lg:flex-col lg:gap-0 lg:space-y-2"
                : "flex h-full flex-col gap-2 md:flex lg:flex-col lg:gap-0 lg:space-y-2"
            }
          >
            {column.map(
              (si) =>
                slots[si] && (
                  <TestimonialCard
                    key={si}
                    item={slots[si]}
                    tone={SLOT_TONES[si]}
                    index={si}
                    timelineRef={testimonialRef}
                    revealVariants={revealVariants}
                    className={SLOT_LAYOUT[si].className}
                    avatarSize={SLOT_LAYOUT[si].avatarSize}
                    gridOverlay={SLOT_LAYOUT[si].gridOverlay}
                  />
                ),
            )}
          </div>
        ))}
      </div>
      {items.length > slots.length && (
        <div className="flex justify-center pt-8">
          <Link
            href="/testimonials"
            className={buttonVariants({ variant: "primary", size: "lg" })}
          >
            عرض جميع الآراء
            <MdArrowBack className="size-4" />
          </Link>
        </div>
      )}
    </section>
  );
}

export default Testimonials;
