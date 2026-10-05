import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

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

    // Private high-frequency writes and draft autosaves must never drive the
    // public cache (the dashboard GROQ filter remains as belt-and-braces).
    if (
      body._id.startsWith("drafts.") ||
      body._type === "rentalRequest" ||
      body._type === "contactMessage" ||
      body._type === "subscriber"
    ) {
      return NextResponse.json({ message: "ignored" });
    }

    revalidatePath("/", "layout");

    return NextResponse.json({
      revalidated: true,
      _id: body._id,
      _type: body._type,
      now: Date.now(),
    });
  } catch (err) {
    console.error("Revalidation error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
