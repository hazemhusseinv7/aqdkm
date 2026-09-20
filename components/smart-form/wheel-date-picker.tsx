"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { Button, Drawer } from "@heroui/react";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { cn } from "@/lib/utils";

const ITEM_H = 40;
const VISIBLE_ROWS = 5;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function daysInMonthGregorian(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

type WheelColumnProps = {
  label: string;
  items: number[];
  format: (n: number) => string;
  index: number;
  onPick: (i: number, scroll: boolean) => void;
  register: (el: HTMLDivElement | null) => void;
};

function WheelColumn({
  label,
  items,
  format,
  index,
  onPick,
  register,
}: WheelColumnProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div
        ref={(el) => {
          innerRef.current = el;
          register(el);
        }}
        role="listbox"
        aria-label={label}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") {
            e.preventDefault();
            onPick(index - 1, true);
          }
          if (e.key === "ArrowDown") {
            e.preventDefault();
            onPick(index + 1, true);
          }
        }}
        onScroll={() => {
          const el = innerRef.current;
          if (!el) return;
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => {
            const i = Math.min(
              items.length - 1,
              Math.max(0, Math.round(el.scrollTop / ITEM_H)),
            );
            onPick(i, false);
          }, 90);
        }}
        className="wheel__viewport max-w-full overflow-y-auto"
        style={{ height: ITEM_H * VISIBLE_ROWS }}
      >
        <div style={{ height: (ITEM_H * VISIBLE_ROWS - ITEM_H) / 2 }} />
        {items.map((n, i) => (
          <div
            key={n}
            role="option"
            aria-selected={i === index}
            onClick={() => onPick(i, true)}
            className={cn(
              "wheel__item flex cursor-pointer items-center justify-center tabular-nums",
              i === index
                ? "text-foreground text-lg font-bold"
                : "text-muted/50 text-base",
            )}
            style={{ height: ITEM_H }}
          >
            {format(n)}
          </div>
        ))}
        <div style={{ height: (ITEM_H * VISIBLE_ROWS - ITEM_H) / 2 }} />
      </div>
    </div>
  );
}

export function WheelDatePicker({
  label,
  value,
  onChange,
  minYear,
  maxYear,
}: {
  label: string;
  value: CalendarDate | null;
  onChange: (v: CalendarDate | null) => void;
  minYear?: number;
  maxYear?: number;
}) {
  const currentYear = new Date().getFullYear();
  const loYear = minYear ?? currentYear - 100;
  const hiYear = maxYear ?? currentYear + 10;
  const years = useMemo(() => range(loYear, hiYear), [loYear, hiYear]);
  const months = useMemo(() => range(1, 12), []);

  const [open, setOpen] = useState(false);
  const [temp, setTemp] = useState({ y: currentYear, m: 1, d: 1 });
  const scrollers = useRef<{
    y: HTMLDivElement | null;
    m: HTMLDivElement | null;
    d: HTMLDivElement | null;
  }>({
    y: null,
    m: null,
    d: null,
  });
  const pendingScroll = useRef({ y: currentYear, m: 1, d: 1 });

  const openPicker = () => {
    const base = value ?? new CalendarDate(currentYear, 1, 1);
    const y = Math.min(hiYear, Math.max(loYear, base.year));
    const m = Math.min(12, Math.max(1, base.month));
    const d = Math.min(daysInMonthGregorian(y, m), Math.max(1, base.day));
    setTemp({ y, m, d });
    pendingScroll.current = { y, m, d };
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => {
      const t = pendingScroll.current;
      scrollers.current.y?.scrollTo({ top: (t.y - loYear) * ITEM_H });
      scrollers.current.m?.scrollTo({ top: (t.m - 1) * ITEM_H });
      scrollers.current.d?.scrollTo({ top: (t.d - 1) * ITEM_H });
    });
    return () => cancelAnimationFrame(raf);
  }, [open, loYear]);

  const days = useMemo(
    () => range(1, daysInMonthGregorian(temp.y, temp.m)),
    [temp.y, temp.m],
  );

  const scrollTo = (which: "y" | "m" | "d", i: number, smooth: boolean) => {
    scrollers.current[which]?.scrollTo({
      top: i * ITEM_H,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const clampIndex = (i: number, len: number) =>
    Math.min(len - 1, Math.max(0, i));

  const pickY = (i: number, scroll: boolean) => {
    const y = years[clampIndex(i, years.length)];
    setTemp((t) => ({
      ...t,
      y,
      d: Math.min(t.d, daysInMonthGregorian(y, t.m)),
    }));
    if (scroll) scrollTo("y", clampIndex(i, years.length), true);
  };

  const pickM = (i: number, scroll: boolean) => {
    const m = clampIndex(i, 12) + 1;
    setTemp((t) => ({
      ...t,
      m,
      d: Math.min(t.d, daysInMonthGregorian(t.y, m)),
    }));
    if (scroll) scrollTo("m", clampIndex(i, 12), true);
  };

  const pickD = (i: number, scroll: boolean) => {
    const d = clampIndex(i, days.length) + 1;
    setTemp((t) => ({ ...t, d }));
    if (scroll) scrollTo("d", clampIndex(i, days.length), true);
  };

  const confirm = () => {
    onChange(new CalendarDate(temp.y, temp.m, temp.d));
    setOpen(false);
  };

  const display = value
    ? `${pad(value.day)}/${pad(value.month)}/${value.year}`
    : "اختر التاريخ";

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={openPicker}
        className="input flex w-full cursor-pointer items-center justify-between gap-2 text-start"
      >
        <span dir="ltr" className={value ? "tabular-nums" : "text-muted"}>
          {display}
        </span>
        <BsCalendar2WeekFill className="text-muted size-4 shrink-0" />
      </button>
      <Drawer.Backdrop isOpen={open} onOpenChange={setOpen}>
        <Drawer.Content placement="bottom">
          <Drawer.Dialog>
            <Drawer.Handle />
            <Drawer.CloseTrigger />
            <Drawer.Header>
              <Drawer.Heading>{label}</Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div dir="ltr" className="relative flex gap-2">
                <div
                  aria-hidden="true"
                  className="border-separator pointer-events-none absolute inset-x-0"
                  style={{
                    top: `calc(50% - ${ITEM_H / 2}px)`,
                    borderTopWidth: 1,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="border-separator pointer-events-none absolute inset-x-0"
                  style={{
                    top: `calc(50% + ${ITEM_H / 2}px)`,
                    borderTopWidth: 1,
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-14"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--surface), transparent)",
                  }}
                />
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-14"
                  style={{
                    background:
                      "linear-gradient(to top, var(--surface), transparent)",
                  }}
                />
                <WheelColumn
                  label="السنة"
                  items={years}
                  format={(n) => String(n)}
                  index={temp.y - loYear}
                  onPick={pickY}
                  register={(el) => {
                    scrollers.current.y = el;
                  }}
                />
                <WheelColumn
                  label="الشهر"
                  items={months}
                  format={pad}
                  index={temp.m - 1}
                  onPick={pickM}
                  register={(el) => {
                    scrollers.current.m = el;
                  }}
                />
                <WheelColumn
                  label="اليوم"
                  items={days}
                  format={pad}
                  index={temp.d - 1}
                  onPick={pickD}
                  register={(el) => {
                    scrollers.current.d = el;
                  }}
                />
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <div dir="ltr" className="grid w-full grid-cols-2 gap-3">
                <Button variant="tertiary" slot="close" className="w-full">
                  إلغاء
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full"
                  onPress={confirm}
                >
                  تأكيد التاريخ
                </Button>
              </div>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </>
  );
}
