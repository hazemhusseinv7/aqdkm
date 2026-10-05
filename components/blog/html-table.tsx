"use client";

import { Table } from "@heroui/react";

import type { HtmlNode } from "@/lib/sanitize-html";
import { renderTree } from "@/lib/sanitize-html";

export type HtmlTableData = {
  headers: HtmlNode[][];
  rows: HtmlNode[][][];
};

function CellNodes({ nodes, id }: { nodes: HtmlNode[]; id: string }) {
  return <>{renderTree(nodes, id)}</>;
}

export function BlogHtmlTable({ data }: { data: HtmlTableData }) {
  const width = data.headers.length;
  if (width === 0) return null;
  const rows = data.rows.map((cells) =>
    cells.length >= width
      ? cells.slice(0, width)
      : [...cells, ...Array<HtmlNode[]>(width - cells.length).fill([])],
  );
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Content aria-label="جدول">
          <Table.Header>
            {data.headers.map((nodes, i) => (
              <Table.Column key={`c${i}`}>
                <CellNodes nodes={nodes} id={`h${i}`} />
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {rows.map((cells, ri) => (
              <Table.Row key={`r${ri}`}>
                {cells.map((nodes, ci) => (
                  <Table.Cell key={`c${ci}`}>
                    <CellNodes nodes={nodes} id={`r${ri}c${ci}`} />
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </div>
  );
}
