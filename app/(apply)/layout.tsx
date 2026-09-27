import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { Toast } from "@heroui/react";
import "../globals.css";
import { Providers } from "@/components/shell/providers";
import { WhatsappFloat } from "@/components/shell/whatsapp-float";
import { Analytics } from "@/components/analytics";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "عقدكم - تقديم طلبات توثيق عقود الإيجار",
  description:
    "تقديم طلبات توثيق عقود الإيجار السكنية والتجارية بخطوات واضحة مع مراجعة الطلب قبل الإرسال",
  icons: {
    icon: [
      { url: "/logo/favicon.ico" },
      { url: "/logo/favicon-alt.ico", media: "(prefers-color-scheme: dark)" },
    ],
  },
};

export default async function ApplyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let analytics: {
    gaMeasurementId: string | null;
    gtmId: string | null;
  } | null = null;
  let whatsappUrl: string | null = null;
  try {
    const data = await client.fetch(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
    );
    const settings = data as SITE_SETTINGS_QUERY_RESULT;
    analytics = settings
      ? {
          gaMeasurementId: settings.gaMeasurementId
            ? `${settings.gaMeasurementId}`
            : null,
          gtmId: settings.gtmId ? `${settings.gtmId}` : null,
        }
      : null;
    whatsappUrl =
      settings?.socialLinks?.find((l) => l.platform === "whatsapp" && l.url)
        ?.url ?? null;
  } catch {
    analytics = null;
    whatsappUrl = null;
  }

  return (
    <html
      lang="ar"
      dir="rtl"
      className={cn(arabic.variable, inter.variable)}
      suppressHydrationWarning
    >
      <body className="site-shell flex min-h-full flex-col antialiased">
        <Providers>
          <Toast.Provider placement="bottom" />
          <Analytics settings={analytics} />
          <main className="min-h-screen w-full flex-1 overflow-x-clip">
            {children}
          </main>
          {whatsappUrl ? <WhatsappFloat href={whatsappUrl} /> : null}
        </Providers>
      </body>
    </html>
  );
}
