import { createClient, type SanityClient } from "@sanity/client";

import { apiVersion, dataset, projectId } from "../env";

let cached: SanityClient | null = null;

export function getWriteClient(): SanityClient {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) {
    throw new Error(
      "Missing SANITY_API_TOKEN. Add an Editor-role token to .env.local.",
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
