"use client";

import { I18nProvider } from "react-aria-components";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider locale="ar-SA-u-nu-latn">{children}</I18nProvider>
    </NextThemesProvider>
  );
}
