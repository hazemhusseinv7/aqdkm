import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { BLOG_CACHE_TAG } from "@/lib/constants";

const TAG_MAP: Record<string, string[]> = {
  post: [BLOG_CACHE_TAG, "post"],
  author: [BLOG_CACHE_TAG, "post"],
  category: [BLOG_CACHE_TAG, "category"],
  legalPage: [BLOG_CACHE_TAG, "legalPage"],
  siteSettings: [BLOG_CACHE_TAG, "siteSettings"],
  testimonials: [BLOG_CACHE_TAG, "testimonial"],
  features: [BLOG_CACHE_TAG, "feature"],
  licenses: [BLOG_CACHE_TAG, "license"],
};

export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "Missing environment variable: SANITY_REVALIDATE_SECRET" },
      { status: 500 },
    );
  }
  try {
    const { isValidSignature, body } = await parseBody<{
      _id: string;
      _type: string;
    }>(request, secret);

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (!body?._id || !body?._type) {
      return NextResponse.json(
        { error: "Missing _id or _type" },
        { status: 400 },
      );
    }

    // Private high-frequency writes must never drive the public cache:
    // rental requests, contact messages, and subscribers are excluded.
    // Draft autosaves carry the normal _type, so they are excluded here too
    // (the dashboard GROQ filter remains as belt-and-braces).
    // Every other publish expires exactly the tags that carry its data.
    if (
      body._id.startsWith("drafts.") ||
      body._type === "rentalRequest" ||
      body._type === "contactMessage" ||
      body._type === "subscriber"
    ) {
      return NextResponse.json({ message: "ignored" });
    }

    const tags = TAG_MAP[body._type] ?? [BLOG_CACHE_TAG];
    for (const tag of tags) {
      // Webhook invalidation must expire immediately: { expire: 0 } forces a
      // blocking regen on next visit instead of background revalidation.
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidated: "all",
      _type: body._type,
      _id: body._id,
      tags,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
