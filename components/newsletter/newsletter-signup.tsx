"use client";

import { toast } from "@heroui/react";
import { useState } from "react";
import { HiArrowLeft, HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import { MdMarkEmailRead } from "react-icons/md";

import {
  type SubscribeState,
  subscribeNewsletterAction,
} from "@/lib/newsletter-actions";

export function NewsletterSignup() {
  const [pending, setPending] = useState(false);
  const [state, setState] = useState<SubscribeState>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    try {
      const next = await subscribeNewsletterAction(
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

  const error = state.error ?? state.fieldErrors?.email;

  return (
    <div className="border-border bg-surface max-w-sm rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="bg-accent/10 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl">
          <MdMarkEmailRead className="size-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-foreground text-sm font-bold">النشرة البريدية</p>
          <p className="text-muted mt-0.5 text-xs leading-6">
            اشترك ليصلك جديد المقالات.
          </p>
        </div>
      </div>
      <form className="mt-4 flex items-stretch gap-2" onSubmit={handleSubmit}>
        <input
          type="email"
          required
          name="newsletter_email"
          placeholder="بريدك الإلكتروني"
          aria-label="بريدك الإلكتروني"
          className="border-border bg-surface-secondary/60 text-foreground placeholder:text-muted min-w-0 flex-1 rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-transparent focus:ring-2 focus:ring-[var(--focus)]"
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
          aria-label="اشترك في النشرة البريدية"
          className="bg-accent flex w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-white transition-colors hover:bg-[var(--alt)] disabled:opacity-50"
        >
          <HiArrowLeft className="size-4" aria-hidden="true" />
        </button>
      </form>
      {state.message ? (
        <p
          role="status"
          className="text-accent mt-3 flex items-center gap-1.5 text-sm font-bold"
        >
          <HiCheckCircle className="size-4 shrink-0" aria-hidden="true" />
          {state.message}
        </p>
      ) : null}
      {error ? (
        <p
          role="alert"
          className="text-danger mt-3 flex items-center gap-1.5 text-sm font-bold"
        >
          <HiExclamationCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
