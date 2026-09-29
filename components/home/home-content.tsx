"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  Chip,
  Typography,
  Tabs,
  Separator,
  Breadcrumbs,
  Accordion,
  buttonVariants,
} from "@heroui/react";
import {
  MdCheckCircle,
  MdArrowBack,
  MdQuiz,
  MdPayments,
  MdRateReview,
} from "react-icons/md";
import { SharedElementTransition } from "react-aria-components";
import { FaBuilding, FaFileContract, FaHome, FaLandmark } from "react-icons/fa";
import { PiSpeedometerFill } from "react-icons/pi";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { CurrencyText } from "@/lib/currency-text";
import { HiDocumentCheck } from "react-icons/hi2";
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
  const [key, setKey] = useState("res");
  const [animReady, setAnimReady] = useState(false);
  useEffect(() => {
    let on = true;
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 1500)),
    ]).then(() => {
      if (on) setAnimReady(true);
    });
    return () => {
      on = false;
    };
  }, []);
  const pill = (id: string) =>
    animReady ? (
      <Tabs.Indicator />
    ) : (
      key === id && (
        <span
          data-slot="tabs-indicator"
          className="tabs__indicator"
          aria-hidden="true"
        />
      )
    );
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

        <div id="contract-type" className="w-full scroll-mt-24">
          <SharedElementTransition>
            <Tabs
              className="w-full"
              selectedKey={key}
              onSelectionChange={(k) => setKey(String(k))}
            >
              <Tabs.ListContainer>
                <Tabs.List aria-label="نوع العقد">
                  <Tabs.Tab id="res">
                    <span className="flex items-center gap-2">
                      <FaHome /> سكني
                    </span>
                    {pill("res")}
                  </Tabs.Tab>
                  <Tabs.Tab id="com">
                    <span className="flex items-center gap-2">
                      <FaBuilding /> تجاري
                    </span>
                    {pill("com")}
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
              <Tabs.Panel id="res">
                <TypeCard
                  href="/residential"
                  icon={<FaHome className="size-7" />}
                  title="عقد إيجار سكني معتمد"
                  desc="للشقق والفلل والأدوار - بما فيها تفاصيل السكن"
                  cta="وثّق عقدك السكني الآن"
                  points={[
                    {
                      text: "وسيط عقاري معتمد رسمياً عبر منصة إيجار",
                      icon: <RiVerifiedBadgeFill />,
                    },
                    {
                      text: "ادفع بعد معاينة نسخة العقد والتأكد من البيانات",
                      icon: <MdPayments />,
                    },
                    {
                      text: "توثيق إلكتروني فوري بدون الحاجة لزيارة مكتب",
                      icon: <HiDocumentCheck />,
                    },
                  ]}
                />
              </Tabs.Panel>
              <Tabs.Panel id="com">
                <TypeCard
                  href="/commercial"
                  icon={<FaBuilding className="size-7" />}
                  title="عقد إيجار تجاري معتمد"
                  desc="للمحلات والمكاتب والمستودعات - للأفراد والمنشآت"
                  cta="وثّق عقدك التجاري الآن"
                  points={[
                    {
                      text: "معتمد لدى بلدي، وزارة التجارة، والجهات الحكومية",
                      icon: <FaLandmark />,
                    },
                    {
                      text: "معاينة نسخة العقد أولاً قبل إتمام عملية الدفع",
                      icon: <MdRateReview />,
                    },
                    { text: "إنجاز سريع ومضمون", icon: <PiSpeedometerFill /> },
                  ]}
                />
              </Tabs.Panel>
            </Tabs>
          </SharedElementTransition>
        </div>

        <Separator />

        <Features items={features} />

        {faqs && faqs.length > 0 && (
          <Accordion variant="surface">
            {faqs.map((f) => (
              <Accordion.Item key={f._key} id={f._key}>
                <Accordion.Heading>
                  <Accordion.Trigger className="gap-2">
                    <MdQuiz className="text-accent size-4" />
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
                      <MdArrowBack className="size-4" />
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

function TypeCard({
  href,
  icon,
  title,
  desc,
  cta,
  points,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  cta: string;
  points: { text: string; icon?: React.ReactNode }[];
}) {
  return (
    <Card variant="secondary" className="mt-3">
      <Card.Header className="gap-3">
        <span className="bg-accent text-accent-foreground shadow-accent/25 flex size-14 items-center justify-center rounded-2xl shadow-md">
          {icon}
        </span>
        <div>
          <Card.Title>{title}</Card.Title>
          <Card.Description>{desc}</Card.Description>
        </div>
        <Chip color="success" variant="soft" className="ms-auto">
          <FaFileContract /> نموذج ذكي
        </Chip>
      </Card.Header>
      <Card.Content>
        <ul className="flex flex-col gap-1.5">
          {points.map((p, i) => (
            <li
              key={`${p.text}-${i}`}
              className="text-muted flex items-center gap-2 text-sm"
            >
              <span className="text-accent inline-flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
                {p.icon ?? <MdCheckCircle />}
              </span>
              {p.text}
            </li>
          ))}
        </ul>
      </Card.Content>
      <Card.Footer>
        <Link
          href={href}
          className={buttonVariants({
            variant: "primary",
            className: "w-full",
          })}
        >
          {cta}
          <MdArrowBack className="size-4" />
        </Link>
      </Card.Footer>
    </Card>
  );
}
