import Link from "next/link";
import type { Metadata } from "next";
import { Breadcrumbs, Card, Chip, Typography } from "@heroui/react";
import { MdArrowForward, MdPerson } from "react-icons/md";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { notFound } from "next/navigation";
import { stegaClean } from "next-sanity";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import {
  POST_DETAIL_QUERY,
  POST_SLUGS_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";
import type {
  POST_DETAIL_QUERY_RESULT,
  POST_SLUGS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import { BlogBody } from "@/components/blog/portable-text";
import { Cta } from "@/components/cta";
import { PostCover } from "@/components/blog/post-cover";
import { formatPostDate, postCoverImage, decodeSlugParam } from "@/lib/blog";
import { normalizeCurrencyText, CurrencyText } from "@/lib/currency-text";
import type { CtaFees } from "@/components/home/split-cta";
import type { MarketingPoint } from "@/components/hero/new-items-loading";

export async function generateStaticParams() {
  try {
    const data = await client.fetch(
      POST_SLUGS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "post"] } },
    );
    const slugs = (stegaClean(data) as POST_SLUGS_QUERY_RESULT) ?? [];
    return slugs.map((slug) => ({ slug: `${slug}` }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  try {
    const data = await client.fetch(
      POST_DETAIL_QUERY,
      { slug },
      { next: { tags: [BLOG_CACHE_TAG, "post"] } },
    );
    const post = stegaClean(data) as POST_DETAIL_QUERY_RESULT;
    if (!post) return { title: "المقال غير موجود" };
    const cover = postCoverImage(post.cover);
    const description = normalizeCurrencyText(post.excerpt);
    return {
      title: `${post.title} | المدونة`,
      description,
      openGraph: {
        title: post.title,
        description,
        ...(cover ? { images: [{ url: cover.src }] } : {}),
      },
    };
  } catch {
    return { title: "المدونة" };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  let post: POST_DETAIL_QUERY_RESULT = null;
  let ctaFees: CtaFees | null = null;
  let points: MarketingPoint[] = [];
  try {
    const [postData, settingsData] = await Promise.all([
      client.fetch(
        POST_DETAIL_QUERY,
        { slug },
        { next: { tags: [BLOG_CACHE_TAG, "post"] } },
      ),
      client.fetch(
        SITE_SETTINGS_QUERY,
        {},
        { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
      ),
    ]);
    post = stegaClean(postData) as POST_DETAIL_QUERY_RESULT;
    const settings = stegaClean(settingsData) as SITE_SETTINGS_QUERY_RESULT;
    if (settings) {
      ctaFees = {
        note: settings.cta?.note ?? null,
        resFrom: settings.cta?.residentialFrom ?? null,
        comFrom: settings.cta?.commercialFrom ?? null,
      };
      points = (settings.marketingPoints ?? [])
        .map((p) => ({ text: p.text ?? "", icon: p.icon ?? null }))
        .filter((p) => p.text);
    }
  } catch {
    post = null;
  }
  if (!post) notFound();

  return (
    <>
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
        <Breadcrumbs>
          <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
          <Breadcrumbs.Item href="/blog">المدونة</Breadcrumbs.Item>
          <Breadcrumbs.Item>{post.title}</Breadcrumbs.Item>
        </Breadcrumbs>
        <div className="border-border bg-surface flex flex-col gap-6 rounded-3xl border p-6 sm:p-8">
          {(post.categories ?? []).length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-muted text-sm">التصنيفات:</span>
              {(post.categories ?? []).map((c) => (
                <Link key={c._id} href={`/blog/category/${c.slug}`}>
                  <Chip
                    size="lg"
                    variant="soft"
                    className="bg-accent/10 text-accent"
                  >
                    {c.title}
                  </Chip>
                </Link>
              ))}
            </div>
          )}
          <div className="flex flex-col items-start gap-3">
            <Typography type="h1" weight="bold">
              {post.title}
            </Typography>
            <span className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="flex items-center gap-1">
                <BsCalendar2WeekFill className="size-4" />
                {formatPostDate(post.publishedAt)}
              </span>
              {post.author && (
                <span className="flex items-center gap-1">
                  <MdPerson className="size-4" />
                  {post.author.name}
                  {post.author.role ? ` · ${post.author.role}` : ""}
                </span>
              )}
            </span>
          </div>

          <figure className="group flex flex-col gap-2">
            <PostCover
              cover={post.cover}
              title={post.title}
              className="rounded-3xl"
              titleClassName="text-2xl"
              sizes="(max-width: 1024px) 100vw, 768px"
              priority
            />
            {post.cover?.caption && (
              <figcaption className="text-muted text-center text-sm">
                <CurrencyText text={post.cover.caption} />
              </figcaption>
            )}
          </figure>

          <BlogBody body={post.body} />

          {post.author?.bio && (
            <Card variant="secondary">
              <Card.Header className="gap-3">
                <span className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
                  <MdPerson className="size-6" />
                </span>
                <div>
                  <Card.Title>{post.author.name}</Card.Title>
                  <Card.Description>
                    <CurrencyText text={post.author.bio} />
                  </Card.Description>
                </div>
              </Card.Header>
            </Card>
          )}

          <Link href="/blog" className="w-fit">
            <span className="text-accent flex items-center gap-1 text-sm">
              <MdArrowForward className="size-4" />
              العودة إلى المدونة
            </span>
          </Link>
        </div>
      </article>
      <div className="mx-auto w-full max-w-6xl px-4 pb-8 sm:px-6">
        <Cta ctaFees={ctaFees} points={points} />
      </div>
    </>
  );
}
