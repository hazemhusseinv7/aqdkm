"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { playThemeTransition } from "@/lib/theme-transition";

export function ApplyThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only mount flag (avoids SSR hydration mismatch)
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.dataset.theme = resolvedTheme;
    }
  }, [resolvedTheme]);

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className="bg-default inline-block h-7 w-15.5 rounded-full"
      />
    );
  }

  return (
    <ThemeToggle
      checked={resolvedTheme === "dark"}
      onChange={(v) => playThemeTransition(() => setTheme(v ? "dark" : "light"))}
    />
  );
}
