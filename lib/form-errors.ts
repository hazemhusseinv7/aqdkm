import type { z } from "zod";

export function fieldErrorsFromIssues(
  issues: z.ZodError["issues"],
  exclude: string[] = ["honeypot"],
): { error: string; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = String(issue.path[0] ?? "");
    if (key && !exclude.includes(key) && !(key in fieldErrors)) {
      fieldErrors[key] = issue.message;
    }
  }
  const first = issues.find((i) => !exclude.includes(String(i.path[0] ?? "")));
  return {
    error: first?.message ?? "يرجى مراجعة الحقول المطلوبة",
    fieldErrors,
  };
}
