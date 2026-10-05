import { Breadcrumbs, Typography } from "@heroui/react";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  CATEGORIES_QUERY,
  POSTS_BY_CATEGORY_QUERY,
} from "@/sanity/lib/queries";
import type {
  CATEGORIES_QUERY_RESULT,
  POSTS_BY_CATEGORY_QUERY_RESULT,
} from "@/sanity.types";
import { BlogEmptyState, PostCardGrid } from "@/components/blog/post-card";
import { decodeSlugParam } from "@/lib/blog";

export const metadata = {
  title: "تصنيفات المدونة",
  description: "مقالات عقدكم حسب التصنيف",
};

export async function generateStaticParams() {
  try {
    const data = await client.fetch(
      CATEGORIES_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "category"] } },
    );
    const categories = (stegaClean(data) as CATEGORIES_QUERY_RESULT) ?? [];
    return categories.map((c) => ({ slug: `${c.slug}` }));
  } catch {
    return [];
  }
}

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  let categories: CATEGORIES_QUERY_RESULT = [];
  let posts: POSTS_BY_CATEGORY_QUERY_RESULT = [];
  try {
    const [catsData, postsData] = await Promise.all([
      client.fetch(
        CATEGORIES_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "category"] } },
      ),
      client.fetch(
        POSTS_BY_CATEGORY_QUERY,
        { categorySlug: slug },
        { next: { tags: [BLOG_CACHE_TAG, "post"] } },
      ),
    ]);
    categories = (stegaClean(catsData) as CATEGORIES_QUERY_RESULT) ?? [];
    posts = (stegaClean(postsData) as POSTS_BY_CATEGORY_QUERY_RESULT) ?? [];
  } catch {
    categories = [];
    posts = [];
  }

  const category = categories.find((c) => `${c.slug}` === slug);
  if (!category) notFound();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item href="/blog">المدونة</Breadcrumbs.Item>
        <Breadcrumbs.Item>{category.title}</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          {category.title}
        </Typography>
        {category.description && (
          <Typography type="body" color="muted">
            {category.description}
          </Typography>
        )}
      </div>

      {posts.length > 0 ? <PostCardGrid posts={posts} /> : <BlogEmptyState />}
    </div>
  );
}
