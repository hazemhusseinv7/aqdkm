import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

import { BLOG_CACHE_TAG } from "@/lib/constants";

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
    if (
      body._type === "rentalRequest" ||
      body._type === "contactMessage" ||
      body._type === "subscriber"
    ) {
      return NextResponse.json({ message: "ignored" });
    }

    revalidateTag(BLOG_CACHE_TAG, "max");
    revalidateTag(body._type, "max");

    return NextResponse.json({
      revalidated: [BLOG_CACHE_TAG, body._type],
      _id: body._id,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
