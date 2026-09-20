import type {
  POSTS_INDEX_QUERY_RESULT,
} from "@/sanity.types";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function formatPostDate(iso: string): string {
  return new Intl.DateTimeFormat("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}

type CoverSource = POSTS_INDEX_QUERY_RESULT[number]["cover"];

export function postCoverImage(cover: CoverSource): {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string | null;
} | null {
  if (!cover?.asset?.url) return null;
  const dims = cover.asset.metadata?.dimensions;
  return {
    src: cover.asset.url,
    width: dims?.width ?? 1200,
    height: dims?.height ?? 630,
    alt: cover.alt,
    caption: cover.caption,
  };
}
