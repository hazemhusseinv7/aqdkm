import "server-only";

import { client } from "@/sanity/lib/client";
import { safeImageUrl } from "@/sanity/lib/image";
import { BROADCAST_CANDIDATE_QUERY } from "@/sanity/lib/queries";
import { getWriteClient } from "@/sanity/lib/writeClient";

import { sendNewPostBroadcast } from "./email";
import { SITE_URL as siteUrlValue } from "./blog";

function siteUrl(): string {
  return siteUrlValue.replace(/\/$/, "");
}

interface BroadcastCandidate {
  _id: string;
  title: string;
  slug: string | null;
  excerpt: string;
  cover?: unknown | null;
  publishedAt: string;
  broadcastSentAt?: string | null;
  broadcastId?: string | null;
}

/**
 * Send the new-post broadcast once per post via the Broadcast API. Safe to
 * call on every post webhook: drafts, already-sent posts, and future-dated
 * posts are skipped. Resend resolves recipients from the segment and enforces
 * topic preferences - Sanity only records the broadcast id + timestamp.
 * Throws on send failure with the flags unset so the next webhook retries.
 */
export async function maybeBroadcastNewPost(
  rawId: string,
): Promise<{ broadcastId: string } | { skipped: string }> {
  if (rawId.startsWith("drafts.")) return { skipped: "draft" };

  const post = await client.fetch<BroadcastCandidate | null>(
    BROADCAST_CANDIDATE_QUERY,
    { id: rawId },
  );
  if (!post) return { skipped: "not-found" };
  if (post.broadcastSentAt || post.broadcastId)
    return { skipped: "already-sent" };
  if (!post.slug) return { skipped: "no-slug" };
  if (!post.publishedAt || Date.parse(post.publishedAt) > Date.now()) {
    return { skipped: "not-yet-published" };
  }

  const base = siteUrl();
  const coverUrl = safeImageUrl(post.cover, 1280);

  const { broadcastId } = await sendNewPostBroadcast({
    postSlug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    postUrl: `${base}/blog/${post.slug}`,
    siteUrl: base,
    coverUrl,
  });

  await getWriteClient()
    .patch(rawId)
    .set({
      broadcastSentAt: new Date().toISOString(),
      broadcastId,
    })
    .commit();
  return { broadcastId };
}
