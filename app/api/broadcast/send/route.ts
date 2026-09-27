import { timingSafeEqual } from "node:crypto";

import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { maybeBroadcastNewPost } from "@/lib/broadcast";

const bodySchema = z.object({
  postId: z.string().min(1),
  token: z.string().min(1),
});

function tokensMatch(provided: string, expected: string): boolean {
  const a = Buffer.from(provided, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Studio-triggered broadcast. Called by the wrapped publish action in the
 * Studio (same origin, so it works on localhost with no tunnel).
 *
 * Auth is a shared editor-visible token (NEXT_PUBLIC_BROADCAST_TOKEN): it
 * authorizes exactly one idempotent operation - broadcasting an
 * already-published, unflagged post. Editors are trusted; rotate by
 * changing the value and rebuilding.
 */
export async function POST(req: NextRequest) {
  const expected = process.env.NEXT_PUBLIC_BROADCAST_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: "Broadcast token not configured" },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  if (!tokensMatch(parsed.data.token, expected)) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const result = await maybeBroadcastNewPost(parsed.data.postId);
    return NextResponse.json({ ok: true, result });
  } catch (err) {
    console.error("[broadcast-send]", err);
    return NextResponse.json(
      { error: "Broadcast failed. Flags left unset - retry." },
      { status: 502 },
    );
  }
}
