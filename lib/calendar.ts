import {
  CalendarDate,
  GregorianCalendar,
  IslamicUmalquraCalendar,
  getLocalTimeZone,
  toCalendar,
  today,
} from "@internationalized/date";
import type { Calendar } from "@internationalized/date";

export const GREGORIAN = new GregorianCalendar();
export const HIJRI = new IslamicUmalquraCalendar();

export type CalendarSystem = "gregory" | "islamic-umalqura";

export function calendarObject(system: CalendarSystem): Calendar {
  return system === "islamic-umalqura" ? HIJRI : GREGORIAN;
}

export function calendarSystemOf(date: CalendarDate): CalendarSystem {
  return date.calendar.identifier === "islamic-umalqura"
    ? "islamic-umalqura"
    : "gregory";
}

export function reviveCalendarDate(v: unknown): CalendarDate | null {
  if (v !== null && typeof v === "object" && "year" in v && "month" in v && "day" in v) {
    const o = v as {
      year: unknown;
      month: unknown;
      day: unknown;
      calendar?: { identifier?: unknown };
    };
    if (
      typeof o.year === "number" &&
      typeof o.month === "number" &&
      typeof o.day === "number"
    ) {
      const system: CalendarSystem =
        o.calendar?.identifier === "islamic-umalqura"
          ? "islamic-umalqura"
          : "gregory";
      return new CalendarDate(calendarObject(system), o.year, o.month, o.day);
    }
  }
  return null;
}

export function daysInCalendarMonth(
  cal: Calendar,
  year: number,
  month: number,
): number {
  return cal.getDaysInMonth(new CalendarDate(cal, year, month, 1));
}

export function currentYear(system: CalendarSystem): number {
  return toCalendar(today(getLocalTimeZone()), calendarObject(system)).year;
}

export function convertCalendar(
  y: number,
  m: number,
  d: number,
  from: CalendarSystem,
  to: CalendarSystem,
): { y: number; m: number; d: number } {
  const converted = toCalendar(
    new CalendarDate(calendarObject(from), y, m, d),
    calendarObject(to),
  );
  return { y: converted.year, m: converted.month, d: converted.day };
}

const hijriFmt = new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const gregFmt = new Intl.DateTimeFormat("ar-SA-u-ca-gregory", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function gregorianISOToDate(iso: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatGregorian(iso: string): string | null {
  const d = gregorianISOToDate(iso);
  return d ? gregFmt.format(d) : null;
}

export function formatDual(iso: string): string | null {
  const d = gregorianISOToDate(iso);
  if (!d) return null;
  return `${hijriFmt.format(d)} / ${gregFmt.format(d)}`;
}

export function isAdult18(date: CalendarDate | null): boolean {
  if (!date) return false;
  const g = toCalendar(date, GREGORIAN);
  const cutoff = today(getLocalTimeZone()).subtract({ years: 18 });
  return g.compare(cutoff) <= 0;
}

export function isPastDay(date: CalendarDate | null): boolean {
  if (!date) return false;
  const g = toCalendar(date, GREGORIAN);
  return g.compare(today(getLocalTimeZone())) < 0;
}
