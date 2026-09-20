import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, Chip, Typography } from "@heroui/react";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  CATEGORIES_QUERY,
  POSTS_COUNT_QUERY,
  POSTS_INDEX_QUERY,
} from "@/sanity/lib/queries";
import type {
  CATEGORIES_QUERY_RESULT,
  POSTS_INDEX_QUERY_RESULT,
} from "@/sanity.types";
import { BlogEmptyState, PostCardGrid } from "@/components/blog/post-card";
import { BlogCta } from "@/components/blog/blog-cta";
import { BlogPagination } from "@/components/blog/blog-pagination";

const PAGE_SIZE = 9;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parsePage((await searchParams).page);
  if (page > 1) {
    return {
      title: `المدونة — صفحة ${page}`,
      description: "مقالات وشروحات حول عقود الإيجار والتوثيق",
    };
  }
  return {
    title: "المدونة",
    description: "مقالات وشروحات حول عقود الإيجار والتوثيق",
  };
}

function parsePage(raw: string | undefined): number {
  if (!raw) return 1;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : NaN;
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const page = parsePage((await searchParams).page);
  if (!Number.isInteger(page) || page < 1) {
    notFound();
  }
  const offset = (page - 1) * PAGE_SIZE;
  const [postsData, catsData, countData] = await Promise.all([
    client.fetch(
      POSTS_INDEX_QUERY,
      { offset, end: offset + PAGE_SIZE },
      { next: { tags: [BLOG_CACHE_TAG, "post"] } },
    ),
    client.fetch(
      CATEGORIES_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "category"] } },
    ),
    client.fetch(
      POSTS_COUNT_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "post"] } },
    ),
  ]).catch(() => [null, null, null]);
  const posts = (stegaClean(postsData) as POSTS_INDEX_QUERY_RESULT) ?? [];
  const categories = (stegaClean(catsData) as CATEGORIES_QUERY_RESULT) ?? [];
  const total = typeof countData === "number" ? countData : posts.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  if (page > totalPages) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>المدونة</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          المدونة
        </Typography>
        <Typography type="body" color="muted">
          مقالات وشروحات حول عقود الإيجار وإجراءات التوثيق.
        </Typography>
      </div>

      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Link key={c._id} href={`/blog/category/${c.slug}`}>
              <Chip
                size="lg"
                variant="soft"
                className="bg-accent/10 text-accent"
              >
                {c.title}
                {typeof c.postCount === "number" ? ` (${c.postCount})` : ""}
              </Chip>
            </Link>
          ))}
        </div>
      )}

      {posts.length > 0 ? <PostCardGrid posts={posts} /> : <BlogEmptyState />}

      {totalPages > 1 && <BlogPagination page={page} totalPages={totalPages} />}

      <BlogCta />
    </div>
  );
}
