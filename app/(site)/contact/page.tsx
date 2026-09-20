import { Breadcrumbs, Card, Typography } from "@heroui/react";
import { stegaClean } from "next-sanity";
import { MdEmail, MdPhone } from "react-icons/md";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";
import {
  SOCIAL_PLATFORMS,
  getPlatformFallbackIcon,
} from "@/sanity/lib/socialPlatforms";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "تواصل معنا",
  description: "تواصل مع فريق عقدكم عبر الهاتف أو البريد أو نموذج التواصل",
};

export default async function ContactPage() {
  const settingsData = await client
    .fetch(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
    )
    .catch(() => null);
  const settings = stegaClean(settingsData) as SITE_SETTINGS_QUERY_RESULT;
  const supportPhone = settings?.supportPhone
    ? `${settings.supportPhone}`
    : null;
  const email = settings?.email ? `${settings.email}` : null;
  const socialLinks = (settings?.socialLinks ?? []).filter((l) => l.url);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>تواصل معنا</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          تواصل معنا
        </Typography>
        <Typography type="body" color="muted">
          يسعدنا استقبال استفساراتكم عبر القنوات التالية أو نموذج التواصل.
        </Typography>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Card>
          <Card.Header>
            <h2 className="text-foreground text-sm leading-6 font-medium">
              نموذج التواصل
            </h2>
            <Card.Description>
              املأ البيانات التالية وسنرد عليك في أقرب وقت.
            </Card.Description>
          </Card.Header>
          <Card.Content>
            <ContactForm />
          </Card.Content>
        </Card>

        <div className="flex min-w-0 flex-col gap-4 self-start">
          {supportPhone && (
            <Card>
              <Card.Header>
                <span className="bg-accent/10 text-accent mb-1 flex size-9 items-center justify-center rounded-xl">
                  <MdPhone className="size-5" />
                </span>
                <div>
                  <h2 className="text-foreground text-sm leading-6 font-medium">
                    الهاتف
                  </h2>
                  <Card.Description>
                    <a
                      href={`tel:${supportPhone.replace(/[\s-]/g, "")}`}
                      className="hover:text-foreground"
                    >
                      <span dir="ltr">{supportPhone}</span>
                    </a>
                  </Card.Description>
                </div>
              </Card.Header>
            </Card>
          )}
          {email && (
            <Card>
              <Card.Header>
                <span className="bg-accent/10 text-accent mb-1 flex size-9 items-center justify-center rounded-xl">
                  <MdEmail className="size-5" />
                </span>
                <div>
                  <h2 className="text-foreground text-sm leading-6 font-medium">
                    البريد الإلكتروني
                  </h2>
                  <Card.Description>
                    <a
                      href={`mailto:${email}`}
                      className="hover:text-foreground"
                    >
                      <span dir="ltr">{email}</span>
                    </a>
                  </Card.Description>
                </div>
              </Card.Header>
            </Card>
          )}
          {socialLinks.length > 0 && (
            <Card>
              <Card.Header>
                <div>
                  <h2 className="text-foreground text-sm leading-6 font-medium">
                    تابعنا
                  </h2>
                  <Card.Description>
                    حساباتنا على منصات التواصل الاجتماعي.
                  </Card.Description>
                </div>
              </Card.Header>
              <Card.Content>
                <div className="flex flex-wrap items-center gap-1">
                  {socialLinks.map((l, i) => {
                    const platform = `${l.platform}`;
                    const url = l.url ? `${l.url}` : undefined;
                    const meta = SOCIAL_PLATFORMS[platform];
                    const Icon = meta?.icon ?? getPlatformFallbackIcon();
                    return (
                      <a
                        key={`${platform}-${i}`}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={meta?.title ?? platform}
                        className="text-muted hover:bg-alt hover:text-alt-foreground inline-flex size-10 items-center justify-center rounded-full transition-colors"
                      >
                        <Icon className="size-4" />
                      </a>
                    );
                  })}
                </div>
              </Card.Content>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
