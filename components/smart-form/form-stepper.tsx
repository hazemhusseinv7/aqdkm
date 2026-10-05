"use client";

import { Fragment, useEffect, useRef } from "react";
import {
  Button,
  Chip,
  Separator,
  Tooltip,
  Typography,
} from "@heroui/react";
import {
  MdBadge,
  MdCheckCircle,
  MdErrorOutline,
  MdHome,
  MdLocationOn,
  MdSave,
} from "react-icons/md";
import { FaFileContract, FaUsers } from "react-icons/fa";

export const STEP_TITLES = [
  "صفة مقدم الطلب",
  "بيانات الأطراف",
  "الصك والموقع",
  "شروط العقد",
  "بيانات الوحدة",
  "المراجعة والإرسال",
];

const STEP_ICONS = [
  FaUsers,
  MdBadge,
  MdLocationOn,
  FaFileContract,
  MdHome,
  MdCheckCircle,
];

export function FormStepper({
  step,
  total = 6,
  verified,
  canJump,
  onJump,
}: {
  step: number;
  total?: number;
  verified: boolean[];
  canJump: (s: number) => boolean;
  onJump: (s: number) => void;
}) {
  const CurrentIcon = STEP_ICONS[step];
  const currentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = currentRef.current;
    if (!el) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    try {
      el.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: reduce ? "auto" : "smooth",
      });
    } catch {
      /* non-critical: strip stays manually scrollable */
    }
  }, [step]);

  return (
    <div className="flex min-w-0 flex-col gap-4 overflow-x-clip">
      <div className="hidden sm:block" role="list" aria-label="خطوات النموذج">
        <div className="flex items-start">
          {STEP_TITLES.map((t, i) => {
            const Icon = STEP_ICONS[i];
            const isVerified = verified[i] ?? false;
            const visitedInvalid = i < step && !isVerified;
            const current = i === step;
            return (
              <Fragment key={t}>
                {i > 0 &&
                  (i <= step ? (
                    <span
                      aria-hidden="true"
                      className="bg-alt mx-1 mt-5 h-0.5 flex-1 rounded-full"
                    />
                  ) : (
                    <Separator className="mx-1 mt-5 flex-1" />
                  ))}
                <div
                  role="listitem"
                  className="flex min-w-22 flex-1 flex-col items-center gap-1.5"
                >
                  <Tooltip delay={0}>
                    <Tooltip.Trigger aria-label={t}>
                      <Button
                        isIconOnly
                        type="button"
                        aria-label={t}
                        size="md"
                        variant={
                          isVerified
                            ? "primary"
                            : current
                              ? "secondary"
                              : "tertiary"
                        }
                        className={
                          current
                            ? "bg-alt text-alt-foreground ring-alt rounded-full ring-2 ring-offset-2"
                            : visitedInvalid
                              ? "ring-danger rounded-full ring-2"
                              : "rounded-full"
                        }
                        isDisabled={!canJump(i)}
                        onPress={() => {
                          if (canJump(i)) onJump(i);
                        }}
                      >
                        {isVerified ? (
                          <MdCheckCircle className="size-5" aria-hidden="true" />
                        ) : visitedInvalid ? (
                          <MdErrorOutline className="size-5" aria-hidden="true" />
                        ) : (
                          <Icon className="size-5" aria-hidden="true" />
                        )}
                      </Button>
                    </Tooltip.Trigger>
                    <Tooltip.Content showArrow>
                      <Tooltip.Arrow />
                      <p>
                        {isVerified
                          ? `العودة إلى ${t}`
                          : visitedInvalid
                            ? `${t} - غير مكتملة`
                            : t}
                      </p>
                    </Tooltip.Content>
                  </Tooltip>
                  <Typography
                    type="body-xs"
                    weight={current ? "semibold" : "normal"}
                    color={current || isVerified ? "default" : "muted"}
                    className="hidden w-full truncate text-center md:block"
                  >
                    {t}
                  </Typography>
                </div>
              </Fragment>
            );
          })}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Chip color="success" variant="soft" size="sm">
            <MdSave className="size-3.5" />
            <span>حفظ تلقائي</span>
          </Chip>
          <Typography type="body-xs" color="muted">
            الخطوة {step + 1} من {total} - يتم حفظ المسودة تلقائياً
          </Typography>
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-3 sm:hidden">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="bg-alt text-alt-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
            <CurrentIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <Typography type="h2" weight="semibold" className="text-xl">
              {STEP_TITLES[step]}
            </Typography>
            <Typography type="body-sm" color="muted">
              الخطوة {step + 1} من {total} - يتم حفظ المسودة تلقائياً
            </Typography>
          </div>
          <Chip color="success" variant="soft" size="sm" className="ms-auto">
            <MdSave className="size-3.5" />
            <span>حفظ تلقائي</span>
          </Chip>
        </div>
        <div
          className="mx-auto w-full max-w-full touch-pan-x overflow-x-auto overscroll-x-contain p-4"
          role="list"
          aria-label="خطوات النموذج"
        >
          <div className="flex w-max items-center gap-1.5">
            {STEP_TITLES.map((t, i) => {
              const Icon = STEP_ICONS[i];
              const isVerified = verified[i] ?? false;
              const visitedInvalid = i < step && !isVerified;
              const current = i === step;
              return (
                <Fragment key={t}>
                  {i > 0 &&
                    (i <= step ? (
                      <span
                        aria-hidden="true"
                        className="bg-alt h-0.5 w-4 shrink-0 rounded-full"
                      />
                    ) : (
                      <Separator className="w-4 shrink-0" />
                    ))}
                  <div
                    role="listitem"
                    ref={current ? currentRef : undefined}
                  >
                    <Button
                      isIconOnly
                      type="button"
                      aria-label={t}
                      size="sm"
                      variant={
                        isVerified
                          ? "primary"
                          : current
                            ? "secondary"
                            : "tertiary"
                      }
                      className={
                        current
                          ? "bg-alt text-alt-foreground ring-alt rounded-full ring-2 ring-offset-2"
                          : visitedInvalid
                            ? "ring-danger rounded-full ring-2"
                            : "rounded-full"
                      }
                      isDisabled={!canJump(i)}
                      onPress={() => {
                        if (canJump(i)) onJump(i);
                      }}
                    >
                      {isVerified ? (
                        <MdCheckCircle className="size-4" aria-hidden="true" />
                      ) : visitedInvalid ? (
                        <MdErrorOutline className="size-4" aria-hidden="true" />
                      ) : (
                        <Icon className="size-4" aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
