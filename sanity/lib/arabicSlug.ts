export function arabicSlugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\u0600-\u06FF-]+/gi, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

export function validateArabicSlug(slug?: { current?: string }): true | string {
  if (!slug?.current) return "مطلوب";
  if (!/^[a-z0-9\u0600-\u06FF-]+$/i.test(slug.current)) {
    return "الرابط يجب أن يحتوي على أحرف عربية أو إنجليزية أو أرقام أو شرطات فقط";
  }
  return true;
}
