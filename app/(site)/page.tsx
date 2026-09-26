import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  LATEST_POSTS_QUERY,
  SITE_SETTINGS_QUERY,
  TESTIMONIALS_QUERY,
  FEATURES_QUERY,
  LICENSES_QUERY,
} from "@/sanity/lib/queries";
import type {
  LATEST_POSTS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  TESTIMONIALS_QUERY_RESULT,
  FEATURES_QUERY_RESULT,
  LICENSES_QUERY_RESULT,
} from "@/sanity.types";
import { HomeContent } from "@/components/home/home-content";
import type { FooterSocialLink } from "@/components/shell/footer";
import type { TestimonialItem } from "@/components/home/testimonials";
import type { FeatureItem } from "@/components/home/features";
import type { LicenseItem } from "@/components/home/licenses";

export const metadata = {
  title: "عقدكم - توثيق عقود الإيجار السكنية والتجارية",
  description:
    "قدّم طلب توثيق عقد الإيجار بخطوات واضحة مع حفظ تلقائي للمسودة ومراجعة قبل الإرسال",
};

export type HomeFaqs = NonNullable<SITE_SETTINGS_QUERY_RESULT>["faqs"];

export default async function HomePage() {
  let latestPosts: LATEST_POSTS_QUERY_RESULT = [];
  let faqs: HomeFaqs = null;
  let socialLinks: FooterSocialLink[] | null = null;
  let testimonials: TestimonialItem[] = [];
  let features: FeatureItem[] = [];
  let licenses: LicenseItem[] = [];
  try {
    const [
      postsData,
      settingsData,
      testimonialsData,
      featuresData,
      licensesData,
    ] = await Promise.all([
      client.fetch(
        LATEST_POSTS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "post"] } },
      ),
      client.fetch(
        SITE_SETTINGS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
      ),
      client.fetch(
        TESTIMONIALS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "testimonial"] } },
      ),
      client.fetch(
        FEATURES_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "feature"] } },
      ),
      client.fetch(
        LICENSES_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "license"] } },
      ),
    ]);
    latestPosts = (stegaClean(postsData) as LATEST_POSTS_QUERY_RESULT) ?? [];
    const settings = stegaClean(settingsData) as SITE_SETTINGS_QUERY_RESULT;
    faqs = settings?.faqs ?? null;
    socialLinks =
      settings?.socialLinks?.map((l) => ({
        platform: `${l.platform}`,
        url: l.url ? `${l.url}` : null,
      })) ?? null;
    testimonials = (
      (stegaClean(testimonialsData) as TESTIMONIALS_QUERY_RESULT)?.items ?? []
    ).map((t) => ({
      _key: t._key,
      name: t.name ?? "",
      role: t.role ?? "",
      city: t.city ?? "",
      quote: t.quote ?? "",
    }));
    features = (
      (stegaClean(featuresData) as FEATURES_QUERY_RESULT)?.items ?? []
    ).map((f) => ({
      _key: f._key,
      title: f.title ?? "",
      description: f.description ?? "",
      icon: f.icon ?? null,
    }));
    licenses = (
      (stegaClean(licensesData) as LICENSES_QUERY_RESULT)?.items ?? []
    ).map((l) => ({
      _key: l._key,
      title: l.title ?? "",
      issuer: l.issuer ?? "",
      description: l.description ?? "",
      number: l.number ?? null,
      icon: l.icon ?? null,
    }));
  } catch {
    latestPosts = [];
    faqs = null;
    socialLinks = null;
    testimonials = [];
    features = [];
    licenses = [];
  }
  return (
    <HomeContent
      latestPosts={latestPosts}
      faqs={faqs}
      socialLinks={socialLinks}
      testimonials={testimonials}
      features={features}
      licenses={licenses}
    />
  );
}
