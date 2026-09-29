import Image from "next/image";
import {
  PortableText,
  type PortableTextBlock,
  type PortableTextComponents,
} from "@portabletext/react";
import type {
  POST_DETAIL_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
} from "@/sanity.types";
import {
  annotateCurrencyBlocks,
  CURRENCY_MARK,
  CurrencyIcon,
  CurrencyText,
} from "@/lib/currency-text";

type Body = NonNullable<POST_DETAIL_QUERY_RESULT>["body"];
type SettingsFaqs = NonNullable<SITE_SETTINGS_QUERY_RESULT>["faqs"];
type SettingsFaqAnswer = NonNullable<SettingsFaqs>[number]["answer"];

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="pt-4 text-2xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-3 text-xl font-bold">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="pt-2 text-lg font-bold">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-foreground/90 leading-8">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-accent bg-surface text-muted rounded-2xl border-s-4 px-4 py-3 leading-8">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="marker:text-accent flex list-disc flex-col gap-2 ps-5">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="marker:text-accent flex list-decimal flex-col gap-2 ps-5">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="text-accent underline underline-offset-4"
      >
        {children}
      </a>
    ),
    [CURRENCY_MARK]: () => (
      <span className="inline-flex items-center">
        <CurrencyIcon />
      </span>
    ),
  },
  types: {
    image: ({ value }) => {
      const src = value?.asset?.url as string | undefined;
      if (!src) return null;
      const dims = value?.asset?.metadata?.dimensions as
        { width: number; height: number } | undefined;
      return (
        <figure className="flex flex-col gap-2">
          <span className="relative block w-full overflow-hidden rounded-2xl">
            <Image
              src={src}
              alt={(value?.alt as string | undefined) ?? ""}
              width={dims?.width ?? 1200}
              height={dims?.height ?? 630}
              sizes="(max-width: 1024px) 100vw, 896px"
              className="h-auto w-full object-cover"
            />
          </span>
          {value?.caption ? (
            <figcaption className="text-muted text-center text-sm">
              <CurrencyText text={value.caption as string} />
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function BlogBody({ body }: { body: Body | SettingsFaqAnswer }) {
  return (
    <div className="flex max-w-3xl flex-col gap-5">
      <PortableText
        value={annotateCurrencyBlocks(
          body as unknown as PortableTextBlock[],
        )}
        components={components}
      />
    </div>
  );
}
