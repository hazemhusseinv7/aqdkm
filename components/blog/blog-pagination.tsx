import Link from "next/link";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import { cn } from "@/lib/utils";

function defaultHrefFor(page: number): string {
  return page <= 1 ? "/blog" : `/blog?page=${page}`;
}

function pageNumbers(
  page: number,
  totalPages: number,
): (number | "ellipsis")[] {
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

function PageItem({
  label,
  active,
  href,
  onNavigate,
  children,
}: {
  label: string;
  active?: boolean;
  href?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}) {
  if (onNavigate) {
    return (
      <li>
        <button
          type="button"
          aria-label={label}
          aria-current={active ? "page" : undefined}
          onClick={onNavigate}
          className={cn(
            itemClass,
            "cursor-pointer",
            active ? activeClass : linkClass,
          )}
        >
          {children}
        </button>
      </li>
    );
  }
  if (!href) return null;
  return (
    <li>
      <Link
        href={href}
        aria-label={label}
        aria-current={active ? "page" : undefined}
        className={cn(itemClass, active ? activeClass : linkClass)}
      >
        {children}
      </Link>
    </li>
  );
}

export function BlogPagination({
  page,
  totalPages,
  label = "التنقل بين صفحات المدونة",
  hrefFor = defaultHrefFor,
  onNavigate,
}: {
  page: number;
  totalPages: number;
  label?: string;
  hrefFor?: (page: number) => string;
  onNavigate?: (page: number) => void;
}) {
  const target = (p: number) =>
    onNavigate ? { onNavigate: () => onNavigate(p) } : { href: hrefFor(p) };
  return (
    <nav aria-label={label} className="flex justify-center">
      <ul className="flex items-center gap-1">
        {page > 1 ? (
          <PageItem label="الصفحة السابقة" {...target(page - 1)}>
            <MdChevronRight className="size-4" />
          </PageItem>
        ) : (
          <li>
            <span
              role="img"
              aria-label="لا توجد صفحة سابقة"
              className={cn(itemClass, "text-muted opacity-40")}
            >
              <MdChevronRight className="size-4" />
            </span>
          </li>
        )}
        {pageNumbers(page, totalPages).map((p, i) =>
          p === "ellipsis" ? (
            <li key={`ellipsis-${i}`} aria-hidden="true">
              <span className={cn(itemClass, "text-muted")}>…</span>
            </li>
          ) : (
            <PageItem
              key={p}
              label={`صفحة ${p}`}
              active={p === page}
              {...target(p)}
            >
              <span className="tabular-nums">{p}</span>
            </PageItem>
          ),
        )}
        {page < totalPages ? (
          <PageItem label="الصفحة التالية" {...target(page + 1)}>
            <MdChevronLeft className="size-4" />
          </PageItem>
        ) : (
          <li>
            <span
              role="img"
              aria-label="لا توجد صفحة تالية"
              className={cn(itemClass, "text-muted opacity-40")}
            >
              <MdChevronLeft className="size-4" />
            </span>
          </li>
        )}
      </ul>
    </nav>
  );
}
