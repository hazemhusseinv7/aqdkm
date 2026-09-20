"use client";

import { toast } from "@heroui/react";
import { useState } from "react";

import {
  type SubscribeState,
  unsubscribeNewsletterAction,
} from "@/lib/newsletter-actions";

export function UnsubscribeForm({
  initialEmail = "",
}: {
  initialEmail?: string;
}) {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubscribeState>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const next = await unsubscribeNewsletterAction(
        {},
        new FormData(e.currentTarget),
      );
      if (next.error) toast(next.error, { variant: "danger" });
      else if (next.message) toast.success(next.message);
      setState(next);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="border-border bg-surface shadow-surface rounded-none border p-8">
        <h1 className="font-display text-2xl font-bold">إلغاء الاشتراك</h1>
        <p className="text-muted mt-2 text-sm leading-7">
          أدخل بريدك الإلكتروني لإيقاف رسائل النشرة.
        </p>
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <input
            type="email"
            required
            name="email"
            defaultValue={initialEmail}
            placeholder="بريدك الإلكتروني"
            aria-label="بريدك الإلكتروني"
            className="border-border bg-background text-foreground placeholder:text-muted focus:border-accent w-full border px-3 py-2.5 text-sm outline-none"
          />
          <input
            type="text"
            name="honeypot"
            autoComplete="off"
            tabIndex={-1}
            aria-hidden="true"
            className="hidden"
          />
          <button
            type="submit"
            disabled={pending}
            className="bg-accent rounded-none px-5 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "جارٍ الإلغاء…" : "إلغاء الاشتراك"}
          </button>
          {state.message ? (
            <p className="text-accent text-sm font-bold">{state.message}</p>
          ) : null}
          {state.error ? (
            <p className="text-danger text-sm font-bold">{state.error}</p>
          ) : null}
          {state.fieldErrors?.email ? (
            <p className="text-danger text-sm font-bold">
              {state.fieldErrors.email}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}
