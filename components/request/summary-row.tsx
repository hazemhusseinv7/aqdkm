"use client";

import { cn } from "@/lib/utils";

/** Shared label/value row for request summary cards (track + success). */
export function SummaryRow({
  icon,
  label,
  children,
  highlight = false,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-2xl p-3 text-sm",
        highlight ? "bg-accent/10" : "bg-surface",
        className,
      )}
    >
      <span
        className={cn(
          "flex items-center gap-1.5",
          highlight ? "font-semibold" : "text-muted",
        )}
      >
        <span className="text-accent inline-flex [&_svg]:size-4">{icon}</span>
        {label}
      </span>
      {children}
    </div>
  );
}
