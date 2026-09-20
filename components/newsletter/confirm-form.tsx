"use client";

import NextLink from "next/link";
import { useState } from "react";
import { HiCheckCircle, HiExclamationTriangle } from "react-icons/hi2";

import { confirmSubscription } from "@/lib/newsletter-actions";
import { cn } from "@/lib/utils";

/**
 * Confirm requires an explicit click (POST-style): auto-confirming on page
 * load would let link scanners and preview bots confirm subscriptions
 * without a human ever opening the mail.
 */
export function ConfirmForm({ token }: { token: string }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<
    { ok: boolean; message: string } | undefined
  >();

  async function handleConfirm() {
    setPending(true);
    try {
      setResult(await confirmSubscription(token));
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="border-border bg-surface shadow-surface rounded-none border p-8 text-center">
        {result ? (
          result.ok ? (
            <HiCheckCircle
              className="text-accent mx-auto size-10"
              aria-hidden="true"
            />
          ) : (
            <HiExclamationTriangle
              className="text-danger mx-auto size-10"
              aria-hidden="true"
            />
          )
        ) : null}
        <h1 className="font-display mt-4 text-2xl font-bold">
          {result
            ? result.ok
              ? "تم تأكيد الاشتراك"
              : "تعذر التأكيد"
            : "تأكيد الاشتراك"}
        </h1>
        <p className="text-muted mt-2 text-sm leading-7">
          {result?.message ?? "اضغط الزر التالي لتأكيد اشتراكك في نشرة عقدكم."}
        </p>
        {!result?.ok ? (
          <button
            type="button"
            onClick={handleConfirm}
            disabled={pending}
            className="bg-accent mt-6 rounded-none px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending
              ? "جارٍ التأكيد…"
              : result
                ? "إعادة المحاولة"
                : "تأكيد الاشتراك"}
          </button>
        ) : null}
        <div>
          <NextLink
            href="/"
            className={cn(
              "mt-6 inline-block rounded-none border px-5 py-2.5 text-sm font-bold transition-colors",
              result?.ok
                ? "bg-accent text-white hover:opacity-90"
                : "border-border hover:text-accent",
            )}
          >
            العودة للرئيسية
          </NextLink>
        </div>
      </div>
    </div>
  );
}
