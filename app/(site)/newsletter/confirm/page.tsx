import type { Metadata } from "next";
import NextLink from "next/link";
import { HiExclamationTriangle } from "react-icons/hi2";

import { ConfirmForm } from "@/components/newsletter/confirm-form";

export const metadata: Metadata = {
  title: "تأكيد الاشتراك - عقدكم",
  robots: { index: false, follow: false },
};

export default async function ConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="border-border bg-surface shadow-surface rounded-none border p-8 text-center">
          <HiExclamationTriangle
            className="text-danger mx-auto size-10"
            aria-hidden="true"
          />
          <h1 className="font-display mt-4 text-2xl font-bold">تعذر التأكيد</h1>
          <p className="text-muted mt-2 text-sm leading-7">
            الرابط غير صالح أو منتهي الصلاحية.
          </p>
          <NextLink
            href="/"
            className="border-border hover:text-accent mt-6 inline-block rounded-none border px-5 py-2.5 text-sm font-bold transition-colors"
          >
            العودة للرئيسية
          </NextLink>
        </div>
      </div>
    );
  }

  return <ConfirmForm token={token} />;
}
