import { Fragment, type Key, type ReactNode } from "react";
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
const DIGITS = "\\d\\u0660-\\u0669\\u06F0-\\u06F9";
const SINGULAR = "ريال(?![\\u0627-\\u064A])|riyal\\b";
const PLURAL = "ريالين|ريالات|riyals\\b";

export const CURRENCY_SPLIT_RE = new RegExp(
  `(${SINGULAR})|([${DIGITS}][${DIGITS}\\s.,٬٫]*?)\\s*(${PLURAL})`,
  "gi",
);

const CURRENCY_ANY_RE = new RegExp(
  `${SINGULAR}|[${DIGITS}][${DIGITS}\\s.,٬٫]*?\\s*(?:${PLURAL})`,
  "i",
);

export const CURRENCY_STANDALONE_RE = /^(?:ريالين|ريالات|riyals)$/i;

const CURRENCY_MARK = "currency";

/** Icon-only currency glyph sized to the surrounding text. */
export function CurrencyIcon({ className }: { className?: string }) {
  return (
    <span
      className={
        className ??
        "inline-flex size-[1em] shrink-0 items-center justify-center align-[-0.13em]"
      }
    >
      <SaudiRiyal className="block size-full" aria-hidden="true" />
      <span className="sr-only">ر.س</span>
    </span>
  );
}

const GLUE_PUNCT_RE = /^([.,،!؟?:;…)\]}»«]+)([\s\S]*)$/;
const STANDALONE_WITH_PUNCT_RE =
  /^(ريالات|ريالين|ريال|riyals?)([.,،!؟?:;…)\]}»«]*)$/i;

function GlueIcon({ punct, k }: { punct: string; k: Key }) {
  return (
    <span key={k} className="whitespace-nowrap">
      <CurrencyIcon />
      {punct}
    </span>
  );
}

export function CurrencyText({ text }: { text: string | null | undefined }) {
  if (!text) return null;
  const alone = text.trim().match(STANDALONE_WITH_PUNCT_RE);
  if (alone) {
    return alone[2] ? <GlueIcon punct={alone[2]} k="solo" /> : <CurrencyIcon />;
  }
  if (!CURRENCY_ANY_RE.test(text)) return <>{text}</>;
  CURRENCY_SPLIT_RE.lastIndex = 0;
  const parts = text.split(CURRENCY_SPLIT_RE);
  const out: ReactNode[] = [];
  let i = 0;
  while (i < parts.length) {
    const part = parts[i];
    if (!part) {
      i++;
      continue;
    }
    const mod = i % 4;
    if (mod === 1 || mod === 3) {
      let j = i + 1;
      while (j < parts.length && !parts[j]) j++;
      if (j < parts.length && j % 4 === 0) {
        const m = parts[j]!.match(GLUE_PUNCT_RE);
        if (m) {
          parts[j] = m[2];
          out.push(<GlueIcon k={i} punct={m[1]} />);
          i++;
          continue;
        }
      }
      out.push(<CurrencyIcon key={i} />);
    } else {
      out.push(<Fragment key={i}>{part}</Fragment>);
    }
    i++;
  }
  return <>{out}</>;
}

/** Plain-text variant for metadata/OG descriptions (no JSX allowed). */
export function normalizeCurrencyText(
  text: string | null | undefined,
): string | undefined {
  if (!text) return undefined;
  const alone = text.trim().match(STANDALONE_WITH_PUNCT_RE);
  if (alone) return `ر.س${alone[2] ?? ""}`;
  if (!CURRENCY_ANY_RE.test(text)) return text;
  CURRENCY_SPLIT_RE.lastIndex = 0;
  return text.replace(CURRENCY_SPLIT_RE, (_m, singular, number, _plural) =>
    singular ? "ر.س" : `${number ?? ""}ر.س`,
  );
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
      if (!CURRENCY_ANY_RE.test(child.text)) {
        const alone = child.text.trim().match(STANDALONE_WITH_PUNCT_RE);
        if (alone) {
          children.push({
            _type: "span",
            _key: `${child._key ?? "s"}-c0`,
            text: `￾${alone[2] ?? ""}`,
            marks: [...(child.marks ?? []), CURRENCY_MARK],
          });
        } else {
          children.push(child);
        }
        continue;
      }
      CURRENCY_SPLIT_RE.lastIndex = 0;
      child.text.split(CURRENCY_SPLIT_RE).forEach((part, i) => {
        if (!part) return;
        const mod = i % 4;
        const isToken = mod === 1 || mod === 3;
        children.push({
          _type: "span",
          _key: `${child._key ?? "s"}-c${i}`,
          text: isToken ? "￾" : part,
          marks: isToken
            ? [...(child.marks ?? []), CURRENCY_MARK]
            : child.marks,
        });
      });
    }
    return { ...block, children: glueTrailingPunct(children) };
  });
}

function glueTrailingPunct(children: TextSpan[]): TextSpan[] {
  for (let k = 0; k < children.length - 1; k++) {
    const cur = children[k];
    if (!cur.marks?.includes(CURRENCY_MARK)) continue;
    const nxt = children[k + 1];
    if (nxt._type === "span" && typeof nxt.text === "string") {
      const m = nxt.text.match(GLUE_PUNCT_RE);
      if (m) {
        cur.text = `${cur.text ?? ""}${m[1]}`;
        nxt.text = m[2];
        if (!nxt.text) children.splice(k + 1, 1);
      }
    }
  }
  return children;
}

export { CURRENCY_MARK };
