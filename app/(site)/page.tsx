import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { LATEST_POSTS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type {
  LATEST_POSTS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import { HomeContent } from "@/components/home/home-content";
import type { FooterSocialLink } from "@/components/shell/footer";

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
  try {
    const [postsData, settingsData] = await Promise.all([
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
    ]);
    latestPosts = (stegaClean(postsData) as LATEST_POSTS_QUERY_RESULT) ?? [];
    const settings = stegaClean(settingsData) as SITE_SETTINGS_QUERY_RESULT;
    faqs = settings?.faqs ?? null;
    socialLinks =
      settings?.socialLinks?.map((l) => ({
        platform: `${l.platform}`,
        url: l.url ? `${l.url}` : null,
      })) ?? null;
  } catch {
    latestPosts = [];
    faqs = null;
    socialLinks = null;
  }
  return (
    <HomeContent
      latestPosts={latestPosts}
      faqs={faqs}
      socialLinks={socialLinks}
    />
  );
}
