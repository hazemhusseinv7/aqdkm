import { Card, Skeleton } from "@heroui/react";

export function PostCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden" aria-hidden="true">
      <Skeleton className="aspect-2/1 w-full rounded-t-xl rounded-b-none" />
      <Card.Header className="flex-col items-start gap-2">
        <span className="flex flex-wrap gap-1.5">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </span>
        <Skeleton className="h-6 w-11/12 rounded-lg" />
        <Skeleton className="h-6 w-2/3 rounded-lg" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-5/6 rounded-full" />
      </Card.Header>
      <Card.Content className="mt-auto">
        <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="flex items-center gap-1">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-3 w-20 rounded-full" />
          </span>
          <span className="flex items-center gap-1">
            <Skeleton className="size-3.5 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </span>
        </span>
      </Card.Content>
    </Card>
  );
}

export function PostCardGridSkeleton({ count = 9 }: { count?: number }) {
  return (
    <>
      <span role="status" className="sr-only">
        جارٍ تحميل المقالات…
      </span>
      <div
        aria-hidden="true"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {Array.from({ length: count }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
