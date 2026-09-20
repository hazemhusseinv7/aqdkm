export function GlowBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="border-accent/30 bg-accent/10 text-accent inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-medium">
      <span className="relative flex size-2">
        <span className="bg-accent absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
        <span className="bg-accent relative inline-flex size-2 rounded-full" />
      </span>
      {children}
    </span>
  );
}
