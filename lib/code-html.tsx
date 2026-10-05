import type { ReactNode } from "react";

import type { HtmlNode } from "@/lib/sanitize-html";
import { parseTree, renderTree } from "@/lib/sanitize-html";
import { BlogHtmlTable } from "@/components/blog/html-table";
import type { HtmlTableData } from "@/components/blog/html-table";

type TableRow = { headed: boolean; cells: HtmlNode[][] };

function elementChildren(node: HtmlNode): HtmlNode[] {
  return node.kind === "el" ? node.children : [];
}

function rowCells(tr: HtmlNode): HtmlNode[][] | null {
  if (tr.kind !== "el" || tr.tag !== "tr") return null;
  const cells = tr.children.filter(
    (c): c is Extract<HtmlNode, { kind: "el" }> =>
      c.kind === "el" && (c.tag === "td" || c.tag === "th"),
  );
  if (cells.length === 0) return null;
  const headed = cells.every((c) => c.tag === "th");
  return cells.map((c) => c.children);
}

function extractTable(table: HtmlNode): HtmlTableData | null {
  if (table.kind !== "el" || table.tag !== "table") return null;
  const rows: TableRow[] = [];
  for (const child of table.children) {
    if (child.kind !== "el") continue;
    if (
      child.tag === "thead" ||
      child.tag === "tbody" ||
      child.tag === "tfoot"
    ) {
      for (const tr of child.children) {
        const cells = rowCells(tr);
        if (cells && tr.kind === "el") {
          const tags = tr.children.filter((c) => c.kind === "el");
          rows.push({
            headed:
              tags.length > 0 &&
              tags.every((c) => c.kind === "el" && c.tag === "th"),
            cells,
          });
        }
      }
    } else if (child.tag === "tr") {
      const cells = rowCells(child);
      if (cells) {
        const tags = child.children.filter((c) => c.kind === "el");
        rows.push({
          headed:
            tags.length > 0 &&
            tags.every((c) => c.kind === "el" && c.tag === "th"),
          cells,
        });
      }
    }
  }
  const nonEmpty = rows.filter((r) => r.cells.length > 0);
  if (nonEmpty.length === 0) return null;
  const headerRow = nonEmpty.find((r) => r.headed) ?? nonEmpty[0];
  return {
    headers: headerRow.cells,
    rows: nonEmpty.filter((r) => r !== headerRow).map((r) => r.cells),
  };
}

export function renderCodeHtml(dirty: string): ReactNode {
  let nodes: HtmlNode[];
  try {
    nodes = parseTree(dirty);
  } catch {
    return null;
  }
  if (
    !nodes.some((n) => n.kind === "el" || (n.kind === "text" && n.text.trim()))
  ) {
    return null;
  }
  const out: ReactNode[] = [];
  let run: HtmlNode[] = [];
  const flushRun = (key: string) => {
    if (run.length > 0) {
      out.push(
        <div key={key} dir="auto" className="leading-8">
          {renderTree(run, key)}
        </div>,
      );
      run = [];
    }
  };
  let k = 0;
  for (const node of nodes) {
    if (node.kind === "el" && node.tag === "table") {
      flushRun(`h${k}`);
      const data = extractTable(node);
      if (data && data.headers.length > 0) {
        out.push(<BlogHtmlTable key={`t${k}`} data={data} />);
      } else {
        out.push(
          <div key={`t${k}`} dir="auto" className="leading-8">
            {renderTree([node], `t${k}`)}
          </div>,
        );
      }
    } else {
      run.push(node);
    }
    k++;
  }
  flushRun(`h${k}`);
  if (out.length === 0) return null;
  return (
    <div dir="auto" className="leading-8">
      {out}
    </div>
  );
}
