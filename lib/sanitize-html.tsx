import { Fragment, type ReactNode } from "react";

import { CurrencyText } from "./currency-text";

const ALLOWED_TAGS = new Set([
  "p",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "ul",
  "ol",
  "li",
  "a",
  "h2",
  "h3",
  "h4",
  "blockquote",
  "br",
  "hr",
  "span",
  "div",
  "table",
  "caption",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
]);

const DROP_WITH_CONTENT = new Set([
  "script",
  "style",
  "iframe",
  "object",
  "embed",
  "form",
  "input",
  "button",
  "select",
  "option",
  "textarea",
  "link",
  "meta",
  "base",
  "title",
  "noscript",
  "video",
  "audio",
  "source",
  "track",
  "canvas",
  "svg",
  "math",
  "picture",
  "frame",
  "frameset",
  "applet",
  "marquee",
]);

const HREF_SAFE = /^(https?:|mailto:|tel:|#|\/)/i;
const NUMERIC = /^\d+$/;

type Attrs = Record<string, string>;

export type HtmlNode =
  | { kind: "text"; text: string }
  | { kind: "el"; tag: string; attrs: Attrs; children: HtmlNode[] };

function decodeEntities(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => {
      const code = Number.parseInt(n, 10);
      return Number.isSafeInteger(code) ? String.fromCodePoint(code) : "";
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => {
      const code = Number.parseInt(n, 16);
      return Number.isSafeInteger(code) ? String.fromCodePoint(code) : "";
    })
    .replace(/&amp;/g, "&");
}

function parseAttrs(tag: string, raw: string): Attrs {
  const attrs: Attrs = {};
  const re = /([a-zA-Z-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(raw)) !== null) {
    const name = m[1].toLowerCase();
    const value = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
    if (tag === "a" && name === "href") {
      if (HREF_SAFE.test(value.trim())) attrs.href = value.trim();
    } else if (
      (tag === "td" || tag === "th") &&
      (name === "colspan" || name === "rowspan") &&
      NUMERIC.test(value.trim())
    ) {
      attrs[name] = value.trim();
    } else if (
      name === "dir" &&
      (value === "auto" || value === "rtl" || value === "ltr")
    ) {
      attrs.dir = value;
    }
  }
  return attrs;
}

export function parseTree(html: string): HtmlNode[] {
  const root: HtmlNode[] = [];
  const stack: { tag: string; attrs: Attrs; children: HtmlNode[] }[] = [];
  let depth = 0;
  const push = (node: HtmlNode) => {
    if (stack.length > 0) {
      stack[stack.length - 1].children.push(node);
    } else {
      root.push(node);
    }
  };
  const tokenRe =
    /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9]*)\b([^<>]*)>|[^<]+/g;
  let m: RegExpExecArray | null;
  while ((m = tokenRe.exec(html)) !== null) {
    const token = m[0];
    if (token.startsWith("<!--")) continue;
    if (!token.startsWith("<")) {
      const text = decodeEntities(token);
      if (text) push({ kind: "text", text });
      continue;
    }
    const isClose = token[1] === "/";
    const tag = (m[1] ?? "").toLowerCase();
    if (!tag) continue;
    if (isClose) {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          const frames = stack.splice(i);
          const closed = frames[0];
          depth -= frames.length;
          push({ kind: "el", ...closed });
          break;
        }
      }
      continue;
    }
    if (DROP_WITH_CONTENT.has(tag)) {
      const skipRe = new RegExp(
        `<${tag}\\b[^<>]*>|[\\s\\S]*?<\\/${tag}\\s*>`,
        "gi",
      );
      skipRe.lastIndex = tokenRe.lastIndex;
      const skipped = skipRe.exec(html);
      tokenRe.lastIndex = skipped ? skipRe.lastIndex : html.length;
      continue;
    }
    if (!ALLOWED_TAGS.has(tag)) continue;
    if (tag === "br" || tag === "hr") {
      push({ kind: "el", tag, attrs: {}, children: [] });
      continue;
    }
    if (depth >= 60) continue;
    depth++;
    stack.push({ tag, attrs: parseAttrs(tag, m[2] ?? ""), children: [] });
  }
  while (stack.length > 0) {
    const closed = stack.pop();
    if (closed) {
      depth--;
      push({ kind: "el", ...closed });
    }
  }
  return root;
}

let keyCounter = 0;
const nextKey = (base: string) => `${base}-${keyCounter++}`;

function renderNodes(nodes: HtmlNode[], base: string): ReactNode[] {
  return nodes.map((node) => {
    if (node.kind === "text") {
      return (
        <Fragment key={nextKey(base)}>
          <CurrencyText text={node.text} />
        </Fragment>
      );
    }
    const key = nextKey(base);
    const { tag, attrs, children } = node;
    const inner = renderNodes(children, base);
    switch (tag) {
      case "strong":
      case "b":
        return <strong key={key}>{inner}</strong>;
      case "em":
      case "i":
        return <em key={key}>{inner}</em>;
      case "u":
        return <u key={key}>{inner}</u>;
      case "h2":
        return (
          <h2 key={key} className="pt-4 text-2xl font-bold">
            {inner}
          </h2>
        );
      case "h3":
        return (
          <h3 key={key} className="pt-3 text-xl font-bold">
            {inner}
          </h3>
        );
      case "h4":
        return (
          <h4 key={key} className="pt-2 text-lg font-bold">
            {inner}
          </h4>
        );
      case "blockquote":
        return (
          <blockquote
            key={key}
            className="border-accent bg-surface text-muted rounded-2xl border-s-4 px-4 py-3 leading-8"
          >
            {inner}
          </blockquote>
        );
      case "ul":
        return (
          <ul
            key={key}
            className="marker:text-accent flex list-disc flex-col gap-2 ps-5"
          >
            {inner}
          </ul>
        );
      case "ol":
        return (
          <ol
            key={key}
            className="marker:text-accent flex list-decimal flex-col gap-2 ps-5"
          >
            {inner}
          </ol>
        );
      case "li":
        return <li key={key}>{inner}</li>;
      case "a":
        return attrs.href ? (
          <a
            key={key}
            href={attrs.href}
            target="_blank"
            rel="noreferrer"
            className="text-accent underline underline-offset-4"
          >
            {inner}
          </a>
        ) : (
          <Fragment key={key}>{inner}</Fragment>
        );
      case "br":
        return <br key={key} />;
      case "hr":
        return <hr key={key} className="border-border my-2" />;
      case "table":
        return (
          <div key={key} className="overflow-x-auto rounded-2xl border">
            <table className="border-border w-full border-collapse text-sm">
              {inner}
            </table>
          </div>
        );
      case "thead":
        return <thead key={key}>{inner}</thead>;
      case "tbody":
        return <tbody key={key}>{inner}</tbody>;
      case "tfoot":
        return <tfoot key={key}>{inner}</tfoot>;
      case "caption":
        return (
          <caption key={key} className="text-muted p-2 text-center text-sm">
            {inner}
          </caption>
        );
      case "tr": {
        const cells = children.filter(
          (c) => c.kind === "el" && (c.tag === "td" || c.tag === "th"),
        );
        if (cells.length === 0) return <Fragment key={key}>{inner}</Fragment>;
        return <tr key={key}>{inner}</tr>;
      }
      case "th":
        return (
          <th
            key={key}
            colSpan={attrs.colspan ? Number(attrs.colspan) : undefined}
            rowSpan={attrs.rowspan ? Number(attrs.rowspan) : undefined}
            className="border-border bg-surface border p-3 text-start font-bold"
          >
            {inner}
          </th>
        );
      case "td":
        return (
          <td
            key={key}
            colSpan={attrs.colspan ? Number(attrs.colspan) : undefined}
            rowSpan={attrs.rowspan ? Number(attrs.rowspan) : undefined}
            className="border-border border p-3 align-top"
          >
            {inner}
          </td>
        );
      case "p":
        return (
          <p key={key} className="text-foreground/90 leading-8">
            {inner}
          </p>
        );
      default:
        return <Fragment key={key}>{inner}</Fragment>;
    }
  });
}

export function renderSanitizedHtml(html: string, keyBase = "h"): ReactNode {
  if (!html || !html.trim()) return null;
  return <>{renderNodes(parseTree(html), keyBase)}</>;
}

export function renderTree(nodes: HtmlNode[], keyBase = "h"): ReactNode {
  if (!nodes || nodes.length === 0) return null;
  return <>{renderNodes(nodes, keyBase)}</>;
}
