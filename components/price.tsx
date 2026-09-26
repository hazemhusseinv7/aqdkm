import { SaudiRiyal } from "lucide-react";

import { formatCurrency, formatCurrencyParts } from "@/lib/fees";
import { cn } from "@/lib/utils";

/** Clipboard/plain-text price: "30,000 ر.س". */
export function priceText(value: number | null | undefined): string | null {
  if (value == null) return null;
  return formatCurrency(value);
}

/** Web price: grouped digits + Lucide Saudi-riyal icon (font-independent). */
export function Price({
  value,
  className,
  iconClassName,
}: {
  value: number;
  className?: string;
  iconClassName?: string;
}) {
  const parts = formatCurrencyParts(value);
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span dir="ltr">{parts.amount}</span>
      <SaudiRiyal
        className={cn("size-4 shrink-0", iconClassName)}
        aria-hidden="true"
      />
      <span className="sr-only">ر.س</span>
    </span>
  );
}
