import Link from "next/link";
import { Typography, Separator, Breadcrumbs, Accordion } from "@heroui/react";
import { MdArrowBack, MdQuiz } from "react-icons/md";
import { CurrencyText } from "@/lib/currency-text";
import { PostCardGrid } from "@/components/blog/post-card";
import { BlogBody } from "@/components/blog/portable-text";
import { Hero } from "@/components/hero/hero";
import type { LATEST_POSTS_QUERY_RESULT } from "@/sanity.types";
import type { HomeFaqs } from "@/app/(site)/page";
import Testimonials from "@/components/home/testimonials";
import type { TestimonialItem } from "@/components/home/testimonials";
import { Cta } from "@/components/cta";
import { Features } from "@/components/home/features";
import type { FeatureItem } from "@/components/home/features";
import { Licenses } from "@/components/home/licenses";
import type { LicenseItem } from "@/components/home/licenses";
import type { CtaFees } from "@/components/home/split-cta";
import type { MarketingPoint } from "@/components/hero/new-items-loading";
import type { FooterSocialLink } from "@/components/shell/footer";
import { ContractTypeTabs } from "@/components/home/contract-type-tabs";

export function HomeContent({
  latestPosts,
  faqs,
  socialLinks,
  testimonials,
  features,
  licenses,
  regaUrl,
  ctaFees,
  points,
}: {
  latestPosts: LATEST_POSTS_QUERY_RESULT;
  faqs: HomeFaqs;
  socialLinks: FooterSocialLink[] | null;
  testimonials: TestimonialItem[];
  features: FeatureItem[];
  licenses: LicenseItem[];
  regaUrl: string | null;
  ctaFees: CtaFees | null;
  points: MarketingPoint[];
}) {
  return (
    <>
      <Hero socialLinks={socialLinks} ctaFees={ctaFees} points={points} />
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6">
        <Breadcrumbs className="mt-14">
          <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
          <Breadcrumbs.Item>اختيار نوع العقد</Breadcrumbs.Item>
        </Breadcrumbs>

        <div className="flex flex-col items-start gap-3">
          <Typography type="h2" weight="bold" className="text-4xl">
            تقديم طلب توثيق عقد الإيجار
          </Typography>
          <Typography type="body" color="muted">
            يرجى تعبئة بيانات الأطراف والصك والعقد، ثم مراجعة الطلب قبل الإرسال.
          </Typography>
        </div>

        <ContractTypeTabs />

        <Separator />

        <Features items={features} />

        {faqs && faqs.length > 0 && (
          <Accordion variant="surface">
            {faqs.map((f) => (
              <Accordion.Item key={f._key} id={f._key}>
                <Accordion.Heading>
                  <Accordion.Trigger className="gap-2">
                    <MdQuiz className="text-accent size-4" aria-hidden="true" />
                    <CurrencyText text={f.question} />
                    <Accordion.Indicator />
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel>
                  <Accordion.Body>
                    <BlogBody body={f.answer} />
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        <Testimonials items={testimonials} />
        <Licenses items={licenses} regaUrl={regaUrl} />
        <Cta ctaFees={ctaFees} points={points} />
        {latestPosts.length > 0 && (
          <>
            <Separator />
            <div className="mt-8 flex flex-col gap-4">
              <Typography type="h2" weight="bold" className="mb-2">
                من المدونة
              </Typography>
              <PostCardGrid
                posts={latestPosts.slice(0, 3)}
                className="grid gap-4 lg:grid-cols-3"
              />
              {latestPosts.length > 3 && (
                <div className="relative">
                  <div className="mask-[linear-gradient(to_bottom,black_30%,transparent)]">
                    <PostCardGrid
                      posts={latestPosts.slice(3, 6)}
                      className="grid gap-4 lg:grid-cols-3"
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-2 z-10 flex justify-center">
                    <Link
                      href="/blog"
                      className="bg-primary text-primary-foreground pointer-events-auto inline-flex h-11 items-center gap-2 rounded-3xl px-6 text-sm font-medium whitespace-nowrap shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
                    >
                      عرض جميع المقالات
                      <MdArrowBack className="size-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
