import { stegaClean } from "next-sanity";
import { Breadcrumbs, Typography } from "@heroui/react";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { TESTIMONIALS_QUERY } from "@/sanity/lib/queries";
import type { TESTIMONIALS_QUERY_RESULT } from "@/sanity.types";
import type { TestimonialItem } from "@/components/home/testimonials";
import { TestimonialsGrid } from "./grid";
import { Cta } from "@/components/cta";

export const metadata = {
  title: "آراء العملاء",
  description: "تجارب حقيقية لملاك ومستأجرين وثّقوا عقودهم عبر عقدكم",
};

export default async function TestimonialsPage() {
  let items: TestimonialItem[] = [];
  try {
    const data = await client.fetch(
      TESTIMONIALS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "testimonial"] } },
    );
    items = ((stegaClean(data) as TESTIMONIALS_QUERY_RESULT)?.items ?? []).map(
      (t) => ({
        _key: t._key,
        name: t.name ?? "",
        role: t.role ?? "",
        city: t.city ?? "",
        date: t.date ?? null,
        rating: t.rating ?? null,
        quote: t.quote ?? "",
      }),
    );
  } catch {
    items = [];
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

      <Cta />
    </div>
  );
}
