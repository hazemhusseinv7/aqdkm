import { stegaClean } from "next-sanity";
import { Breadcrumbs, Typography } from "@heroui/react";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  TESTIMONIALS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import type { TestimonialItem } from "@/components/home/testimonials";
import { TestimonialsGrid } from "./grid";
import { Cta } from "@/components/cta";
import type { CtaFees } from "@/components/home/split-cta";
import type { MarketingPoint } from "@/components/hero/new-items-loading";

export const metadata = {
  title: "آراء العملاء",
  description: "تجارب حقيقية لملاك ومستأجرين وثّقوا عقودهم عبر عقدكم",
};

export default async function TestimonialsPage() {
  let items: TestimonialItem[] = [];
  let ctaFees: CtaFees | null = null;
  let points: MarketingPoint[] = [];
  try {
    const [testimonialsData, settingsData] = await Promise.all([
      client.fetch(
        TESTIMONIALS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "testimonial"] } },
      ),
      client.fetch(
        SITE_SETTINGS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
      ),
    ]);
    items = (
      (stegaClean(testimonialsData) as TESTIMONIALS_QUERY_RESULT)?.items ?? []
    ).map((t) => ({
      _key: t._key,
      name: t.name ?? "",
      role: t.role ?? "",
      city: t.city ?? "",
      date: t.date ?? null,
      rating: t.rating ?? null,
      quote: t.quote ?? "",
    }));
    const settings = stegaClean(settingsData) as SITE_SETTINGS_QUERY_RESULT;
    if (settings) {
      ctaFees = {
        note: settings.cta?.note ?? null,
        resFrom: settings.cta?.residentialFrom ?? null,
        comFrom: settings.cta?.commercialFrom ?? null,
      };
      points = (settings.marketingPoints ?? [])
        .map((p) => ({ text: p.text ?? "", icon: p.icon ?? null }))
        .filter((p) => p.text);
    }
  } catch {
    items = [];
    ctaFees = null;
    points = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>آراء العملاء</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          ماذا يقول عملاؤنا؟
        </Typography>
        <Typography type="body" color="muted">
          تجارب حقيقية لملاك ومستأجرين وثّقوا عقودهم عبر عقدكم
        </Typography>
      </div>

      {items.length > 0 ? (
        <TestimonialsGrid items={items} />
      ) : (
        <Typography type="body" color="muted">
          لا توجد آراء بعد.
        </Typography>
      )}

      <Cta ctaFees={ctaFees} points={points} />
    </div>
  );
}
