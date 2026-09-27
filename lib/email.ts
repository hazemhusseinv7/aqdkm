import "server-only";

import { Resend } from "resend";

import { NewsletterConfirm } from "@/emails/newsletter-confirm";
import { NewsletterWelcome } from "@/emails/newsletter-welcome";
import { NewPostBroadcast } from "@/emails/new-post";
import { NewRequestNotification } from "@/emails/new-request";
import { ContactNotification } from "@/emails/contact-notification";
import type { RequestDetail } from "@/lib/request-form";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getResend(): Resend {
  return new Resend(requireEnv("RESEND_API_KEY"));
}

export async function sendSubscribeConfirm(input: {
  to: string;
  confirmUrl: string;
  siteUrl: string;
  token: string;
}): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send(
    {
      from: requireEnv("RESEND_FROM"),
      to: input.to,
      subject: "أكّد اشتراكك في نشرة عقدكم",
      react: NewsletterConfirm({
        confirmUrl: input.confirmUrl,
        siteUrl: input.siteUrl,
      }),
      tags: [{ name: "category", value: "newsletter-confirm" }],
    },
    {
      idempotencyKey: `newsletter-confirm/${input.token}`,
    },
  );
  if (error) throw new Error(`Resend confirm failed: ${error.message}`);
}

export async function sendNewsletterWelcome(input: {
  to: string;
  subscriberId: string;
  unsubscribeUrl: string;
  siteUrl: string;
}): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send(
    {
      from: requireEnv("RESEND_FROM"),
      to: input.to,
      subject: "تم اشتراكك في نشرة عقدكم",
      react: NewsletterWelcome({
        unsubscribeUrl: input.unsubscribeUrl,
        siteUrl: input.siteUrl,
      }),
      tags: [{ name: "category", value: "newsletter-welcome" }],
    },
    {
      idempotencyKey: `newsletter-welcome/${input.subscriberId}`,
    },
  );
  if (error) throw new Error(`Resend welcome failed: ${error.message}`);
}

export async function sendNewRequestNotification(input: {
  to: string;
  detail: NonNullable<RequestDetail>;
  siteUrl: string;
}): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send(
    {
      from: requireEnv("RESEND_FROM"),
      to: input.to,
      subject: `طلب توثيق جديد: ${input.detail.requestNo}`,
      react: NewRequestNotification({
        detail: input.detail,
        siteUrl: input.siteUrl,
      }),
      tags: [{ name: "category", value: "new-request" }],
    },
    {
      idempotencyKey: `new-request/${input.detail.requestNo}`,
    },
  );
  if (error) throw new Error(`Resend new-request failed: ${error.message}`);
}

export async function sendContactNotification(input: {
  to: string;
  messageId: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  siteUrl: string;
}): Promise<void> {
  const resend = getResend();
  const { error } = await resend.emails.send(
    {
      from: requireEnv("RESEND_FROM"),
      to: input.to,
      replyTo: input.email || undefined,
      subject: `رسالة تواصل جديدة من ${input.name}`,
      react: ContactNotification({
        name: input.name,
        phone: input.phone,
        email: input.email ?? null,
        message: input.message,
        siteUrl: input.siteUrl,
      }),
      tags: [{ name: "category", value: "contact-notification" }],
    },
    {
      idempotencyKey: `contact-notification/${input.messageId}`,
    },
  );
  if (error) throw new Error(`Resend contact failed: ${error.message}`);
}

export async function sendNewPostBroadcast(input: {
  postSlug: string;
  title: string;
  excerpt: string;
  postUrl: string;
  siteUrl: string;
  coverUrl?: string | null;
}): Promise<{ broadcastId: string }> {
  const resend = getResend();
  const { data, error } = await resend.broadcasts.create({
    segmentId: requireEnv("RESEND_SEGMENT_ID"),
    from: requireEnv("RESEND_FROM"),
    subject: `مقال جديد: ${input.title}`,
    react: NewPostBroadcast({
      title: input.title,
      excerpt: input.excerpt,
      postUrl: input.postUrl,
      siteUrl: input.siteUrl,
      coverUrl: input.coverUrl,
    }),
    name: `new-post/${input.postSlug}`,
    send: true,
  });
  if (error) throw new Error(`Resend broadcast failed: ${error.message}`);
  if (!data?.id) throw new Error("Resend broadcast returned no id");
  return { broadcastId: data.id };
}
