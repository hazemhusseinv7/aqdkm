import { createClient, type SanityClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "../env";

/**
 * Reads for private document types (rentalRequest, subscriber,
 * contactMessage). Those docs live ONLY as Sanity drafts - anonymous
 * queries can never see drafts (verified against the public API), so any
 * server-side read of them must use a tokened client with `perspective:
 * "raw"`.
 *
 * Shares SANITY_API_TOKEN with writeClient (server-only, never bundled).
 */
export const PRIVATE_DOC_TYPES = [
  "rentalRequest",
  "subscriber",
  "contactMessage",
] as const;

let cached: SanityClient | null = null;

export function getPrivateClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_TOKEN. Add a token with read access to .env.local.",
    );
  }
  if (!cached) {
    cached = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token,
    });
  }
  return cached;
}

/** GROQ fetch that can see draft-only documents (`perspective: "raw"`). */
export function fetchPrivate<T>(
  query: string,
  params: Record<string, unknown> = {},
): Promise<T> {
  return getPrivateClient().fetch<T>(query, params, {
    perspective: "raw",
  });
}
