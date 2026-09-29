import { Fragment } from "react";
import { SaudiRiyal } from "lucide-react";
import type { PortableTextBlock } from "@portabletext/react";

/**
 * Currency token replacement.
 *
 * Editors write "ريال" / "riyal" in CMS text; render surfaces swap the word
 * for the Lucide Saudi-riyal icon (mirrors the `Price` component). Arabic
 * forms are matched longest-first as substrings so بريال / الريال keep
 * their prefixes; English matches whole-word, case-insensitive.
 */
const TOKEN_SPLIT = /(ريالات|ريالين|ريال|riyals?\b)/gi;
const TOKEN_TEST = /^(?:ريالات|ريالين|ريال|riyals?)$/i;
const TOKEN_ANY = /ريالات|ريالين|ريال|riyals?/i;

const CURRENCY_MARK = "currency";

/** Icon-only currency glyph sized to the surrounding text. */
export function CurrencyIcon({ className }: { className?: string }) {
  return (
    <>
      <SaudiRiyal
        className={className ?? "size-[1em] shrink-0"}
        aria-hidden="true"
      />
      <span className="sr-only">ر.س</span>
    </>
  );
}

/** Render a plain CMS string with currency tokens replaced by the icon. */
export function CurrencyText({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  if (!TOKEN_ANY.test(text)) return <>{text}</>;
  return (
    <>
      {text.split(TOKEN_SPLIT).map((part, i) =>
        part === "" ? null : TOKEN_TEST.test(part) ? (
          <CurrencyIcon key={i} />
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}

/** Plain-text variant for metadata/OG descriptions (no JSX allowed). */
export function normalizeCurrencyText(
  text: string | null | undefined,
): string | undefined {
  if (!text) return undefined;
  return TOKEN_ANY.test(text) ? text.replace(TOKEN_SPLIT, "ر.س") : text;
}

type TextSpan = {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
};

/** Tag currency tokens inside Portable Text spans with a `currency` mark. */
export function annotateCurrencyBlocks(
  blocks: PortableTextBlock[] | null | undefined,
): PortableTextBlock[] {
  if (!blocks) return [];
  return blocks.map((block) => {
    if (block._type !== "block" || !Array.isArray(block.children)) {
      return block;
    }
    const children: TextSpan[] = [];
    for (const child of block.children as TextSpan[]) {
      if (child?._type !== "span" || typeof child.text !== "string") {
        children.push(child);
        continue;
      }
      if (!TOKEN_ANY.test(child.text)) {
        children.push(child);
        continue;
      }
      child.text.split(TOKEN_SPLIT).forEach((part, i) => {
        if (!part) return;
        const isToken = TOKEN_TEST.test(part);
        children.push({
          _type: "span",
          _key: `${child._key ?? "s"}-c${i}`,
          // Placeholder: the mark renderer draws only the icon.
          text: isToken ? "￾" : part,
          marks: isToken
            ? [...(child.marks ?? []), CURRENCY_MARK]
            : child.marks,
        });
      });
    }
    return { ...block, children };
  });
}

export { CURRENCY_MARK };
