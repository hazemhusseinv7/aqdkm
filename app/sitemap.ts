import type { MetadataRoute } from "next";
import { stegaClean } from "next-sanity";
import { SITE_URL } from "@/lib/blog";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  CATEGORIES_QUERY,
  LEGAL_PAGES_NAV_QUERY,
  POST_SLUGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  CATEGORIES_QUERY_RESULT,
  LEGAL_PAGES_NAV_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
} from "@/sanity.types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = ["", "/blog", "/testimonials", "/residential", "/commercial", "/contact", "/track"].map(
    (route) => ({ url: `${SITE_URL}${route}`, lastModified: new Date() }),
  );
  try {
    const [slugsData, catsData, legalData] = await Promise.all([
      client.fetch(
        POST_SLUGS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "post"] } },
      ),
      client.fetch(
        CATEGORIES_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "category"] } },
      ),
      client.fetch(
        LEGAL_PAGES_NAV_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "legalPage"] } },
      ),
    ]);
    const slugs = (stegaClean(slugsData) as POST_SLUGS_QUERY_RESULT) ?? [];
    const categories =
      (stegaClean(catsData) as CATEGORIES_QUERY_RESULT) ?? [];
    const legalPages =
      (stegaClean(legalData) as LEGAL_PAGES_NAV_QUERY_RESULT) ?? [];
    return [
      ...staticRoutes,
      ...slugs.map((slug) => ({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: new Date(),
      })),
      ...categories.map((c) => ({
        url: `${SITE_URL}/blog/category/${c.slug}`,
        lastModified: new Date(),
      })),
      ...legalPages
        .filter((p) => p.slug)
        .map((p) => ({
          url: `${SITE_URL}/legal/${p.slug}`,
          lastModified: new Date(),
        })),
    ];
  } catch {
    return staticRoutes;
  }
}
