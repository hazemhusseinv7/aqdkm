"use client";

import { Table } from "@heroui/react";
import { CurrencyIcon } from "@/lib/currency-text";

export type HtmlTableData = { headers: string[]; rows: string[][] };

const TOKEN_SPLIT = /(ريالات|ريالين|ريال|riyals?\b)/gi;
const TOKEN_TEST = /^(?:ريالات|ريالين|ريال|riyals?)$/i;

function cellNodes(html: string, keyBase: string) {
  return (
    <>
      {html.split(TOKEN_SPLIT).map((part, i) =>
        part === "" ? null : TOKEN_TEST.test(part) ? (
          <span
            key={`${keyBase}-${i}`}
            className="ms-1 inline-flex items-center"
          >
            <CurrencyIcon />
          </span>
        ) : (
          <span
            key={`${keyBase}-${i}`}
            className="contents"
            dangerouslySetInnerHTML={{ __html: part }}
          />
        ),
      )}
    </>
  );
}

export function BlogHtmlTable({ data }: { data: HtmlTableData }) {
  const width = data.headers.length;
  if (width === 0) return null;
  const rows = data.rows.map((cells) =>
    cells.length >= width
      ? cells.slice(0, width)
      : [...cells, ...Array<string>(width - cells.length).fill("")],
  );
  return (
    <div className="overflow-x-auto">
      <Table>
        <Table.Content aria-label="جدول">
          <Table.Header>
            {data.headers.map((html, i) => (
              <Table.Column key={`c${i}`}>
                {cellNodes(html, `h${i}`)}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            {rows.map((cells, ri) => (
              <Table.Row key={`r${ri}`}>
                {cells.map((cell, ci) => (
                  <Table.Cell key={`c${ci}`}>
                    {cellNodes(cell, `r${ri}c${ci}`)}
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
