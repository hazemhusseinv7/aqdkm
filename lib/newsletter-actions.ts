"use server";

import { z } from "zod";

import { sendNewsletterWelcome, sendSubscribeConfirm } from "./email";
import {
  resendClient,
  setGlobalUnsubscribed,
  syncContact,
} from "./resend-contacts";
import { SITE_URL as siteUrlValue } from "./blog";
import {
  confirmSubscriber,
  findSubscriberByEmail,
  setResendContactId,
  setSubscriberStatus,
  upsertPendingSubscriber,
} from "./subscribers";
import { fieldErrorsFromIssues } from "./form-errors";

function siteUrl(): string {
  return siteUrlValue.replace(/\/$/, "");
}

const subscribeSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.string().email("البريد الإلكتروني غير صالح").max(254)),
  honeypot: z.string().max(0, "spam").optional(),
});

export interface SubscribeState {
  ok?: boolean;
  message?: string;
  error?: string;
  fieldErrors?: Record<string, string>;
}

export async function subscribeNewsletterAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("newsletter_email"),
    honeypot: formData.get("honeypot") ?? "",
  });

  // Honeypot filled → pretend success (spam trap, nothing created).
  if (
    !parsed.success &&
    parsed.error.issues.some((i) => i.path.join() === "honeypot")
  ) {
    return { ok: true, message: "تحقق من بريدك الإلكتروني لتأكيد الاشتراك." };
  }
  if (!parsed.success) return fieldErrorsFromIssues(parsed.error.issues);

  const email = parsed.data.email;

  // Fail fast when email sending is unconfigured: validate before any
  // Sanity write so a missing RESEND_API_KEY never leaves a stale pending
  // record behind while the UI reports an error.
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.error("[newsletter-subscribe] missing email configuration");
    return { error: "تعذر إتمام الاشتراك. حاول مجدداً لاحقاً." };
  }
  if (
    process.env.NODE_ENV === "production" &&
    /localhost|127\.0\.0\.1/.test(siteUrl())
  ) {
    console.error("[newsletter-subscribe] site URL is not production");
    return { error: "تعذر إتمام الاشتراك. حاول مجدداً لاحقاً." };
  }

  try {
    const existing = await findSubscriberByEmail(email);
    if (existing?.status === "confirmed") {
      // Sanity says confirmed, but Resend may not (e.g. unsubscribed via a
      // broadcast footer, which never syncs back). Heal silently so a
      // resubscribe actually resubscribes.
      try {
        const resend = resendClient();
        if (resend) {
          const { error } = await resend.contacts.update({
            email,
            unsubscribed: false,
          });
          if (error) throw new Error(error.message);
          const contactId = await syncContact(resend, email, "opt_in");
          if (contactId) await setResendContactId(existing._id, contactId);
        }
      } catch (err) {
        console.warn("[newsletter-resubscribe] contact sync failed:", err);
      }
      return { ok: true, message: "هذا البريد مشترك مسبقاً. أهلاً بك!" };
    }

    const { subscriber, token } = await upsertPendingSubscriber(
      email,
      "footer",
    );

    // Pending = no marketing yet: contact joins the segment opted out.
    const resend = resendClient();
    if (resend) {
      const contactId = await syncContact(resend, email, "opt_out");
      if (contactId) await setResendContactId(subscriber._id, contactId);
    }

    await sendSubscribeConfirm({
      to: email,
      confirmUrl: `${siteUrl()}/newsletter/confirm?token=${token}`,
      siteUrl: siteUrl(),
      token,
    });
    return {
      ok: true,
      message: "تم! تحقق من بريدك الإلكتروني لتأكيد الاشتراك.",
    };
  } catch (err) {
    console.error("[newsletter-subscribe]", err);
    return { error: "تعذر إتمام الاشتراك. حاول مجدداً لاحقاً." };
  }
}

export async function confirmSubscription(
  token: string,
): Promise<{ ok: boolean; message: string }> {
  try {
    const sub = await confirmSubscriber(token);
    if (!sub) {
      return { ok: false, message: "الرابط غير صالح أو منتهي الصلاحية." };
    }
    const results = await Promise.allSettled([
      (async () => {
        const resend = resendClient();
        if (!resend) return;
        const { error } = await resend.contacts.update({
          email: sub.email,
          unsubscribed: false,
        });
        if (error) throw new Error(error.message);
        const contactId = await syncContact(resend, sub.email, "opt_in");
        if (contactId) await setResendContactId(sub._id, contactId);
      })(),
      sendNewsletterWelcome({
        to: sub.email,
        subscriberId: sub._id,
        unsubscribeUrl: `${siteUrl()}/newsletter/unsubscribe?email=${encodeURIComponent(sub.email)}`,
        siteUrl: siteUrl(),
      }),
    ]);
    for (const r of results) {
      if (r.status === "rejected") {
        console.warn("[newsletter-confirm] background task failed:", r.reason);
      }
    }
    return {
      ok: true,
      message: "تم تأكيد اشتراكك بنجاح. أهلاً بك في نشرة عقدكم!",
    };
  } catch (err) {
    console.error("[newsletter-confirm]", err);
    return { ok: false, message: "تعذر تأكيد الاشتراك. حاول مجدداً لاحقاً." };
  }
}

export async function unsubscribeNewsletterAction(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const parsed = subscribeSchema.safeParse({
    email: formData.get("email"),
    honeypot: formData.get("honeypot") ?? "",
  });
  if (
    !parsed.success &&
    parsed.error.issues.some((i) => i.path.join() === "honeypot")
  ) {
    return { ok: true, message: "تم إلغاء الاشتراك." };
  }
  if (!parsed.success) return fieldErrorsFromIssues(parsed.error.issues);

  const email = parsed.data.email;
  try {
    const sub = await findSubscriberByEmail(email);
    // Same message either way — don't leak which emails are subscribed.
    if (sub) {
      await setSubscriberStatus(sub._id, "unsubscribed");
      // Global opt-out: single mail stream, so this equals unsubscribing
      // from everything. Transactional mail keeps working regardless.
      try {
        const resend = resendClient();
        if (resend) await setGlobalUnsubscribed(resend, email);
      } catch (err) {
        console.warn("[newsletter] contact sync failed:", err);
      }
    }
    return { ok: true, message: "تم إلغاء الاشتراك." };
  } catch (err) {
    console.error("[newsletter-unsubscribe]", err);
    return { error: "تعذر إلغاء الاشتراك. حاول مجدداً لاحقاً." };
  }
}
