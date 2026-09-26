import type { Metadata } from "next";
import Link from "next/link";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
import { Card, Toast } from "@heroui/react";
import { MdSearchOff } from "react-icons/md";
import "./globals.css";
import { Header } from "@/components/shell/header";
import { Footer } from "@/components/shell/footer";
import { WhatsappFloat } from "@/components/shell/whatsapp-float";
import { Providers } from "@/components/shell/providers";
import { Analytics } from "@/components/analytics";
import { cn } from "@/lib/utils";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  LEGAL_PAGES_NAV_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  LEGAL_PAGES_NAV_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import type {
  FooterLegalLink,
  FooterSocialLink,
} from "@/components/shell/footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "404 - الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها ربما نُقلت أو غير موجودة.",
};

export default async function GlobalNotFound() {
  let socialLinks: FooterSocialLink[] | null = null;
  let legalLinks: FooterLegalLink[] | null = null;
  let supportPhone: string | null = null;
  let email: string | null = null;
  let whatsappUrl: string | null = null;
  let analytics: {
    gaMeasurementId: string | null;
    gtmId: string | null;
  } | null = null;
  try {
    const [settingsData, legalData] = await Promise.all([
      client.fetch(
        SITE_SETTINGS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
      ),
      client.fetch(
        LEGAL_PAGES_NAV_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "legalPage"] } },
      ),
    ]);
    const settings = settingsData as SITE_SETTINGS_QUERY_RESULT;
    const legal = legalData as LEGAL_PAGES_NAV_QUERY_RESULT;
    socialLinks =
      settings?.socialLinks?.map((l) => ({
        platform: `${l.platform}`,
        url: l.url ? `${l.url}` : null,
      })) ?? null;
    analytics = settings
      ? {
          gaMeasurementId: settings.gaMeasurementId
            ? `${settings.gaMeasurementId}`
            : null,
          gtmId: settings.gtmId ? `${settings.gtmId}` : null,
        }
      : null;
    supportPhone = settings?.supportPhone ? `${settings.supportPhone}` : null;
    email = settings?.email ? `${settings.email}` : null;
    whatsappUrl =
      settings?.socialLinks?.find((l) => l.platform === "whatsapp" && l.url)
        ?.url ?? null;
    legalLinks =
      legal
        ?.filter((p) => p.slug)
        .map((p) => ({ title: `${p.title}`, href: `/legal/${p.slug}` })) ??
      null;
  } catch {
    socialLinks = null;
    legalLinks = null;
    supportPhone = null;
    email = null;
    whatsappUrl = null;
    analytics = null;
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
          <Header />
          <main className="min-h-screen w-full flex-1 overflow-x-clip">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
              <Card variant="secondary" className="mx-auto max-w-2xl text-center">
                <Card.Header className="flex-col items-center gap-2 pt-8">
                  <span className="bg-accent/15 text-accent flex size-14 items-center justify-center rounded-full">
                    <MdSearchOff className="size-8" />
                  </span>
                  <h1 className="text-foreground text-sm leading-6 font-medium">
                    الصفحة غير موجودة
                  </h1>
                  <Card.Description>
                    الرابط الذي تحاول الوصول إليه غير متوفر أو تم نقله.
                  </Card.Description>
                </Card.Header>
                <Card.Footer className="justify-center pb-8">
                  <Link
                    href="/"
                    className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center gap-2 rounded-3xl px-4 text-sm font-medium whitespace-nowrap transition-transform outline-none hover:brightness-110 focus-visible:brightness-110 active:scale-[0.98]"
                  >
                    العودة إلى الرئيسية
                  </Link>
                </Card.Footer>
              </Card>
            </div>
          </main>
          <Footer
            socialLinks={socialLinks}
            legalLinks={legalLinks}
            supportPhone={supportPhone}
            email={email}
          />
          {whatsappUrl ? <WhatsappFloat href={`${whatsappUrl}`} /> : null}
        </Providers>
      </body>
    </html>
  );
}
