import Image from "next/image";
import { cn } from "@/lib/utils";
import { postCoverImage } from "@/lib/blog";
import type { POSTS_INDEX_QUERY_RESULT } from "@/sanity.types";
import { PostCoverSvg } from "./post-cover-svg";

type Cover = POSTS_INDEX_QUERY_RESULT[number]["cover"];

export function PostCover({
  cover,
  title,
  className,
  titleClassName,
  sizes = "(max-width: 640px) 100vw, 400px",
  priority = false,
}: {
  cover?: Cover | null;
  title: string;
  className?: string;
  titleClassName?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const image = postCoverImage(cover ?? null);
  if (!image) {
    return (
      <div
        className={cn(
          "texture-panel relative flex aspect-2/1 w-full items-center justify-center overflow-hidden p-6",
          className,
        )}
      >
        <PostCoverSvg className="absolute inset-0 size-full transition-transform duration-700 ease-out group-hover:scale-105" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(closest-side,color-mix(in_oklab,var(--surface)_55%,transparent),transparent)]"
        />
        <div className="relative z-1 flex max-w-[85%] flex-col items-center justify-center gap-2 px-4 text-center">
          <div aria-hidden="true" className="flex items-center gap-2">
            <span className="bg-accent h-px w-6" />
            <span className="border-accent bg-accent size-1.5 rotate-45 border" />
            <span className="bg-accent h-px w-6" />
          </div>
          <p
            className={cn(
              "text-accent line-clamp-3 text-center text-xl leading-8 font-bold sm:leading-9",
              titleClassName,
            )}
            style={{
              fontFamily:
                'var(--font-arabic), "IBM Plex Sans Arabic", Tahoma, sans-serif',
            }}
          >
            {title}
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={cn("relative aspect-2/1 w-full overflow-hidden", className)}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      />
    </div>
  );
}
