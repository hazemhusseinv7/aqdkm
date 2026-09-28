"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  MdEmail,
  MdGavel,
  MdMail,
  MdPhone,
  MdRateReview,
} from "react-icons/md";
import { FaBuilding, FaHome } from "react-icons/fa";
import { HiNewspaper, HiTicket } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { NewsletterSignup } from "@/components/newsletter/newsletter-signup";
import {
  SOCIAL_PLATFORMS,
  getPlatformFallbackIcon,
} from "@/sanity/lib/socialPlatforms";

export type FooterSocialLink = {
  platform: string;
  url: string | null;
};

export type FooterLegalLink = {
  title: string;
  href: string;
};

type FooterSection = {
  label: string;
  links: { title: string; href: string; icon: ReactNode }[];
};

const quickLinks: FooterSection = {
  label: "روابط سريعة",
  links: [
    { title: "عقد سكني", href: "/residential", icon: <FaHome /> },
    { title: "عقد تجاري", href: "/commercial", icon: <FaBuilding /> },
    { title: "المدونة", href: "/blog", icon: <HiNewspaper /> },
    { title: "آراء العملاء", href: "/testimonials", icon: <MdRateReview /> },
    { title: "تواصل معنا", href: "/contact", icon: <MdMail /> },
    { title: "تتبع الطلب", href: "/track", icon: <HiTicket /> },
  ],
};

export function Footer({
  socialLinks,
  legalLinks,
  supportPhone,
  email,
}: {
  socialLinks?: FooterSocialLink[] | null;
  legalLinks?: FooterLegalLink[] | null;
  supportPhone?: string | null;
  email?: string | null;
}) {
  const links = (socialLinks ?? []).filter((l) => l.url);
  return (
    <footer
      className={cn(
        "relative mx-auto mt-24 flex w-full max-w-6xl flex-col items-center justify-center overflow-hidden rounded-t-4xl border-t px-4 sm:px-6 md:rounded-t-[3rem]",
        "dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.1),transparent)]",
      )}
    >
      <div className="bg-foreground/20 absolute top-0 right-1/2 left-1/2 h-px w-1/3 -translate-x-1/2 -translate-y-1/2 rounded-full blur" />

      <div className="grid w-full gap-8 pt-6 md:pt-8 lg:grid-cols-3 lg:gap-8">
        <AnimatedContainer className="space-y-4">
          <Link href="/" aria-label="عقدكم - الرئيسية" className="inline-flex">
            <Logo />
          </Link>
          <p className="text-muted text-sm leading-7">
            خدمة لاستقبال طلبات توثيق عقود الإيجار السكنية والتجارية بخطوات
            واضحة. هذه الخدمة لاستقبال الطلبات ولا تعد توثيقاً نهائياً.
          </p>
          <NewsletterSignup />
        </AnimatedContainer>

        <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-2">
          <AnimatedContainer delay={0.2}>
            <div className="mb-10 md:mb-0">
              <h2 className="text-muted text-xs font-medium">
                {quickLinks.label}
              </h2>
              <ul className="text-muted mt-4 space-y-2 text-sm">
                {quickLinks.links.map((link) => (
                  <li key={link.title}>
                    <Link
                      className="hover:text-alt inline-flex items-center duration-200 [&_svg]:me-1.5 [&_svg]:size-3.5"
                      href={link.href}
                    >
                      {link.icon}
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </AnimatedContainer>

          {(legalLinks ?? []).length > 0 && (
            <AnimatedContainer delay={0.25}>
              <div className="mb-10 md:mb-0">
                <h2 className="text-muted text-xs font-medium">
                  الصفحات القانونية
                </h2>
                <ul className="text-muted mt-4 space-y-2 text-sm">
                  {(legalLinks ?? []).map((link) => (
                    <li key={link.href}>
                      <Link
                        className="hover:text-alt inline-flex items-center duration-200 [&_svg]:me-1.5 [&_svg]:size-3.5"
                        href={link.href}
                      >
                        <MdGavel />
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedContainer>
          )}

          {(supportPhone || email) && (
            <AnimatedContainer delay={0.3}>
              <div className="mb-10 md:mb-0">
                <h2 className="text-muted text-xs font-medium">تواصل</h2>
                <ul className="text-muted mt-4 space-y-2 text-sm">
                  {supportPhone && (
                    <li>
                      <a
                        className="hover:text-alt inline-flex items-center duration-200 [&_svg]:me-1.5 [&_svg]:size-3.5"
                        href={`tel:${supportPhone.replace(/[\s-]/g, "")}`}
                      >
                        <MdPhone />
                        <span dir="ltr">{supportPhone}</span>
                      </a>
                    </li>
                  )}
                  {email && (
                    <li>
                      <a
                        className="hover:text-alt inline-flex items-center duration-200 [&_svg]:me-1.5 [&_svg]:size-3.5"
                        href={`mailto:${email}`}
                      >
                        <MdEmail />
                        <span dir="ltr">{email}</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </AnimatedContainer>
          )}

        </div>
      </div>

      {links.length > 0 && (
        <AnimatedContainer
          delay={0.4}
          className="flex w-full flex-col items-center gap-3 pb-6"
        >
          <h2 className="text-muted text-xs font-medium">تابعنا</h2>
          <div className="flex max-w-full flex-wrap items-center justify-center gap-1.5">
            {links.map((l, i) => {
              const meta = SOCIAL_PLATFORMS[l.platform];
              const Icon = meta?.icon ?? getPlatformFallbackIcon();
              return (
                <a
                  key={`${l.platform}-${i}`}
                  href={l.url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={meta?.title ?? l.platform}
                  className="text-muted hover:bg-alt hover:text-alt-foreground inline-flex size-9 items-center justify-center rounded-full transition-colors"
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </AnimatedContainer>
      )}

      <div className="via-border h-px w-full bg-linear-to-r" />

      <div className="flex w-full items-center justify-center py-4">
        <p className="text-muted text-sm">
          &copy; {new Date().getFullYear()} عقدكم - جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
}

function AnimatedContainer({
  className,
  delay = 0.1,
  children,
}: {
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return children;
  }

  return (
    <motion.div
      className={className}
      initial={{ filter: "blur(4px)", translateY: -8, opacity: 0 }}
      transition={{ delay, duration: 0.8 }}
      viewport={{ once: true }}
      whileInView={{ filter: "blur(0px)", translateY: 0, opacity: 1 }}
    >
      {children}
    </motion.div>
  );
}
