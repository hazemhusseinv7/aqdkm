import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { MdPerson } from "react-icons/md";
import { BsCalendar2WeekFill } from "react-icons/bs";
import type { POSTS_INDEX_QUERY_RESULT } from "@/sanity.types";
import { formatPostDate } from "@/lib/blog";
import { PostCover } from "./post-cover";

export type BlogPostCard = POSTS_INDEX_QUERY_RESULT[number];

export function PostCard({ post }: { post: BlogPostCard }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full overflow-hidden">
        <PostCover
          cover={post.cover}
          title={post.title}
          className="rounded-t-xl rounded-b-xs"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Card.Header className="flex-col items-start gap-2">
          {(post.categories ?? []).length > 0 && (
            <span className="flex flex-wrap gap-1.5">
              {(post.categories ?? []).map((c) => (
                <Chip key={c._id} size="sm" variant="soft">
                  {c.title}
                </Chip>
              ))}
            </span>
          )}
          <h2 className="text-foreground text-lg leading-snug font-medium">
            {post.title}
          </h2>
          <Card.Description className="line-clamp-2">
            {post.excerpt}
          </Card.Description>
        </Card.Header>
        <Card.Content className="mt-auto">
          <span className="text-muted flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
            <span className="flex items-center gap-1">
              <BsCalendar2WeekFill className="size-3.5" />
              {formatPostDate(post.publishedAt)}
            </span>
            {post.author && (
              <span className="flex items-center gap-1">
                <MdPerson className="size-3.5" />
                {post.author.name}
              </span>
            )}
          </span>
        </Card.Content>
      </Card>
    </Link>
  );
}

export function PostCardGrid({
  posts,
  className,
}: {
  posts: BlogPostCard[];
  className?: string;
}) {
  return (
    <div className={className ?? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3"}>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
}

export function BlogEmptyState() {
  return (
    <Card variant="secondary" className="text-center">
      <Card.Header className="flex-col items-center gap-2 pt-8">
        <h2 className="text-foreground text-sm leading-6 font-medium">
          لا توجد مقالات بعد
        </h2>
        <Card.Description>سيتم نشر المقالات هنا قريباً.</Card.Description>
      </Card.Header>
    </Card>
  );
}
