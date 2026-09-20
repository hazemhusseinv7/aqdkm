import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils";

function hrefFor(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

function pageNumbers(page: number, totalPages: number): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | "ellipsis")[] = [1];
  if (page > 3) pages.push("ellipsis");
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (page < totalPages - 2) pages.push("ellipsis");
  pages.push(totalPages);
  return pages;
}

const itemClass =
  "inline-flex size-9 items-center justify-center rounded-xl text-sm transition-colors";
const linkClass = "text-muted hover:bg-default hover:text-foreground";
const activeClass = "bg-accent text-accent-foreground font-medium";

export function BlogPagination({
  page,
  totalPages,
}: {
  page: number;
  totalPages: number;
}) {
  return (
    <nav aria-label="التنقل بين صفحات المدونة" className="flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              aria-label="الصفحة السابقة"
              className={cn(itemClass, linkClass)}
            >
              <MdChevronRight className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(itemClass, "text-muted opacity-40")}
            >
              <MdChevronRight className="size-4" />
            </span>
          )}
        </li>
        {pageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true">
              <span className={cn(itemClass, "text-muted")}>…</span>
            </li>
          ) : (
            <li key={p}>
              <Link
                href={hrefFor(p)}
                aria-label={`صفحة ${p}`}
                aria-current={p === page ? "page" : undefined}
                className={cn(itemClass, p === page ? activeClass : linkClass)}
              >
                <span className="tabular-nums">{p}</span>
              </Link>
            </li>
          ),
        )}
        <li>
          {page < totalPages ? (
            <Link
              href={hrefFor(page + 1)}
              aria-label="الصفحة التالية"
              className={cn(itemClass, linkClass)}
            >
              <MdChevronLeft className="size-4" />
            </Link>
          ) : (
            <span
              aria-hidden="true"
              className={cn(itemClass, "text-muted opacity-40")}
            >
              <MdChevronLeft className="size-4" />
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
