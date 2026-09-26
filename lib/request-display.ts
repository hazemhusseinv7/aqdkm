import { formatDual, formatGregorian } from "@/lib/calendar";
import { formatCurrency } from "@/lib/fees";
import {
  EXTRA_LABELS,
  OPTION_VALUES,
  type OptionPair,
} from "@/lib/request-fields";

export function lookupOption(
  list: readonly OptionPair[],
  value?: string | null,
): string | null {
  if (!value) return null;
  const hit = list.find((o) => o.value === value || o.label === value);
  return hit ? hit.label : value;
}

export function resolveOtherOption(
  value: string | undefined,
  custom: string | undefined,
  list: readonly OptionPair[],
): string | null {
  if (!value) return null;
  if (value === "other") return custom?.trim() ? custom : "أخرى";
  return lookupOption(list, value);
}

export function formatDateValue(value?: string | null): string | null {
  if (!value) return null;
  return formatGregorian(value) ?? value;
}

export function formatDualDate(value?: string | null): string | null {
  if (!value) return null;
  return formatDual(value) ?? value;
}

export function formatMoney(value?: number | null): string | null {
  return value != null ? formatCurrency(value) : null;
}

export function monthWord(n: number): string {
  if (n === 1) return "شهر";
  if (n === 2) return "شهران";
  if (n >= 3 && n <= 10) return "أشهر";
  return "شهراً";
}

export function yesNo(value?: boolean | null): string | null {
  if (value == null) return null;
  return value ? "نعم" : "لا";
}

export function extrasText(extras?: string[] | null): string | null {
  if (!extras || extras.length === 0) return null;
  return extras.map((e) => EXTRA_LABELS[e] ?? e).join("، ");
}

export function durationText(
  duration?: string | null,
  customMonths?: number | null,
  list: readonly OptionPair[] = OPTION_VALUES.duration,
): string | null {
  if (!duration) return null;
  if (duration === "custom" || duration === "مخصص") {
    return customMonths != null
      ? `مخصص (${customMonths} ${monthWord(customMonths)})`
      : "مخصص";
  }
  return lookupOption(list, duration);
}

export function countText(
  value?: string | null,
  custom?: number | null,
): string | null {
  if (!value) return null;
  if (value === "other") return custom != null ? `${custom}` : "أخرى";
  return value;
}
