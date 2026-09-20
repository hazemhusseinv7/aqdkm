import { Skeleton } from "@heroui/react";
import { PostCardGridSkeleton } from "@/components/blog/post-card-skeleton";

export default function BlogLoading() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Skeleton className="h-5 w-48 rounded-full" />
      <div className="flex flex-col items-start gap-2">
        <Skeleton className="h-9 w-40 rounded-lg" />
        <Skeleton className="h-5 w-72 max-w-full rounded-full" />
      </div>
      <PostCardGridSkeleton />
    </div>
  );
}
