import {
  createImageUrlBuilder,
  type SanityImageSource,
} from "@sanity/image-url";

import { dataset, projectId } from "../env";

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset });

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};

export function safeImageUrl(
  source: unknown,
  width = 1200,
  quality = 80,
): string | null {
  try {
    const ref = (source as { asset?: { _ref?: unknown } } | null)?.asset?._ref;
    if (typeof ref !== "string" || !ref) return null;
    return urlFor(source as SanityImageSource)
      .width(width)
      .quality(quality)
      .url();
  } catch {
    return null;
  }
}
