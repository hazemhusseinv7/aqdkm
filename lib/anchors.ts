import { arabicSlugify } from "@/sanity/lib/arabicSlug";

export function linkAnchorProps(
  href: string,
): Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
  if (
    href.startsWith("#") ||
    href.startsWith("/") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return {};
  }
  return { target: "_blank", rel: "noreferrer" };
}

export function headingAnchorId(
  text: string,
  level: string,
  used: Set<string>,
  explicit?: string,
): string {
  const base = explicit
    ? explicit
    : (arabicSlugify(text) || `${level}-heading`).slice(0, 96);
  let id = base;
  for (let i = 2; used.has(id); i++) {
    id = `${base}-${i}`;
  }
  used.add(id);
  return id;
}
