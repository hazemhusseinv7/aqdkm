import type { Metadata } from "next";

import { UnsubscribeForm } from "@/components/newsletter/unsubscribe-form";

export const metadata: Metadata = {
  title: "إلغاء الاشتراك - عقدكم",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  return <UnsubscribeForm initialEmail={email ?? ""} />;
}
