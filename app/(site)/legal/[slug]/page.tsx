import { notFound } from "next/navigation";
import { Accordion, Breadcrumbs, Typography } from "@heroui/react";
import { MdQuiz } from "react-icons/md";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { LEGAL_PAGE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  LEGAL_PAGE_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import { BlogBody } from "@/components/blog/portable-text";
import { CurrencyText, normalizeCurrencyText } from "@/lib/currency-text";
import { decodeSlugParam } from "@/lib/blog";
import { Cta } from "@/components/cta";
import type { CtaFees } from "@/components/home/split-cta";
import type { MarketingPoint } from "@/components/hero/new-items-loading";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  const page = await getLegalPage(slug);
  if (!page) {
    return { title: "صفحة غير موجودة" };
  }
  return {
    title: page.title,
    description: normalizeCurrencyText(page.description),
  };
}

async function getLegalPage(slug: string) {
  const data = await client
    .fetch(
      LEGAL_PAGE_QUERY,
      { slug },
      { next: { tags: [BLOG_CACHE_TAG, "legalPage"] } },
    )
    .catch(() => null);
  return (stegaClean(data) as LEGAL_PAGE_QUERY_RESULT) ?? null;
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  const page = await getLegalPage(slug);
  if (!page) {
    notFound();
  }
  const accordion = page.accordion ?? [];
  let ctaFees: CtaFees | null = null;
  let points: MarketingPoint[] = [];
  try {
    const settingsData = await client.fetch(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
    );
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
    ctaFees = null;
    points = [];
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>{page.title}</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          {page.title}
        </Typography>
        <Typography type="body" color="muted">
          <CurrencyText text={page.description} />
        </Typography>
      </div>

      {page.content && page.content.length > 0 && (
        <BlogBody body={page.content} />
      )}

      {accordion.length > 0 && (
        <Accordion variant="surface">
          {accordion.map((s) => (
            <Accordion.Item key={s._key} id={s._key}>
              <Accordion.Heading>
                <Accordion.Trigger className="gap-2">
                  <MdQuiz className="text-accent size-4" />
                  <CurrencyText text={s.question} />
                  <Accordion.Indicator />
                </Accordion.Trigger>
              </Accordion.Heading>
              <Accordion.Panel>
                <Accordion.Body>
                  <BlogBody body={s.answer} />
                </Accordion.Body>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <Cta ctaFees={ctaFees} points={points} />
    </div>
  );
}
