import { Fragment, type ReactNode } from "react";
import DOMPurify from "isomorphic-dompurify";
import { CurrencyIcon } from "@/lib/currency-text";
import { BlogHtmlTable } from "@/components/blog/html-table";
import type { HtmlTableData } from "@/components/blog/html-table";

const TOKEN_RE = /ريالات|ريالين|ريال|riyals?\b/gi;
const CODE_CURRENCY_MARKER = "￾";

function markTokens(html: string): string {
  return html
    .split(/(<[^>]*>)/g)
    .map((part, i) =>
      i % 2 === 0 ? part.replace(TOKEN_RE, CODE_CURRENCY_MARKER) : part,
    )
    .join("");
}

function richNodes(html: string, keyBase: string): ReactNode {
  return (
    <>
      {html.split(CODE_CURRENCY_MARKER).map((part, i) => (
        <Fragment key={`${keyBase}-${i}`}>
          {i > 0 && (
            <span className="ms-1 inline-flex items-center">
              <CurrencyIcon />
            </span>
          )}
          {part ? (
            <span
              className="contents"
              dangerouslySetInnerHTML={{ __html: part }}
            />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}

type ParsedTable = { headers: string[]; rows: string[][] };

function parseTable(tableHtml: string): ParsedTable | null {
  const rowMatches = [
    ...tableHtml.matchAll(/<tr[\s\S]*?>([\s\S]*?)<\/tr\s*>/gi),
  ];
  const rows = rowMatches
    .map((m) => {
      const cells = [
        ...m[1].matchAll(/<(th|td)[\s\S]*?>([\s\S]*?)<\/\1\s*>/gi),
      ];
      return {
        headed:
          cells.length > 0 && cells.every((c) => c[1].toLowerCase() === "th"),
        texts: cells.map((c) => c[2]),
      };
    })
    .filter((r) => r.texts.length > 0);
  if (rows.length === 0) return null;
  const headerRow = rows.find((r) => r.headed) ?? rows[0];
  return {
    headers: headerRow.texts,
    rows: rows.filter((r) => r !== headerRow).map((r) => r.texts),
  };
}

export function renderCodeHtml(dirty: string): ReactNode {
  const clean = DOMPurify.sanitize(dirty, { USE_PROFILES: { html: true } });
  if (!clean.trim()) return null;
  const parts = clean.split(/(<table[\s\S]*?<\/table\s*>)/gi);
  if (parts.length === 1) {
    return (
      <div dir="auto" className="leading-8">
        {richNodes(markTokens(clean), "c")}
      </div>
    );
  }
  return (
    <div dir="auto" className="leading-8">
      {parts.map((part, i) => {
        if (i % 2 === 0) {
          return part ? (
            <div key={i}>{richNodes(markTokens(part), `h${i}`)}</div>
          ) : null;
        }
        const parsed = parseTable(part);
        if (!parsed || parsed.headers.length === 0) {
          return <div key={i}>{richNodes(markTokens(part), `h${i}`)}</div>;
        }
        const data: HtmlTableData = {
          headers: parsed.headers,
          rows: parsed.rows,
        };
        return <BlogHtmlTable key={i} data={data} />;
      })}
    </div>
  );
}
