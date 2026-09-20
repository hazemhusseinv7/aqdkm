import "server-only";

import { Resend } from "resend";

export function resendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("[newsletter] RESEND_API_KEY missing, skipping contact sync");
    return null;
  }
  return new Resend(apiKey);
}

export function segmentId(): string | null {
  const value = process.env.RESEND_SEGMENT_ID?.trim();
  if (!value) {
    console.warn("[newsletter] RESEND_SEGMENT_ID missing, skipping segment");
    return null;
  }
  return value;
}

/**
 * Mirror a subscriber into the Resend delivery plane (newsletter segment).
 * Best-effort: Sanity stays the source of truth. Heals contacts that were
 * created before segment wiring existed. Returns the contact id.
 */
export async function syncContact(
  resend: Resend,
  email: string,
  subscription: "opt_in" | "opt_out",
): Promise<string | null> {
  const seg = segmentId();
  try {
    const { data, error } = await resend.contacts.create({
      email,
      unsubscribed: subscription !== "opt_in",
      ...(seg ? { segments: [{ id: seg }] } : {}),
    });
    if (!error && data?.id) return data.id;
    if (error && !/already exists/i.test(error.message)) {
      console.warn("[newsletter] contact create skipped:", error.message);
      return null;
    }
    // Contact predates wiring (or was created elsewhere) — patch it up.
    if (seg) {
      const { error: segError } = await resend.contacts.segments.add({
        email,
        segmentId: seg,
      });
      if (segError) {
        console.warn("[newsletter] contact segment skipped:", segError.message);
      }
    }
    const { data: existing, error: getError } =
      await resend.contacts.get(email);
    if (getError || !existing?.id) {
      if (getError)
        console.warn("[newsletter] contact lookup skipped:", getError.message);
      return null;
    }
    return existing.id;
  } catch (err) {
    console.warn("[newsletter] contact sync failed:", err);
    return null;
  }
}

/** Global opt-out by email. Works without a stored contact id. */
export async function setGlobalUnsubscribed(
  resend: Resend,
  email: string,
): Promise<void> {
  const { error } = await resend.contacts.update({
    email,
    unsubscribed: true,
  });
  if (error)
    console.warn("[newsletter] contact update skipped:", error.message);
}
