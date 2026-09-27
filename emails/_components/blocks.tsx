import {
  Body,
  Button,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "react-email";

import { mailTheme as t } from "./theme";

export function MailShell({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="ar" dir="rtl">
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          fontFamily: t.font,
          backgroundColor: t.canvas,
          padding: "24px",
          margin: "0",
          // dir="rtl" on <Html> is stripped by some clients (e.g. Gmail),
          // so declare direction + alignment inline on every text container.
          direction: "rtl",
          textAlign: "right",
        }}
      >
        <Container
          style={{
            maxWidth: "640px",
            margin: "0 auto",
            direction: "rtl",
            textAlign: "right",
          }}
        >
          <Section
            style={{
              backgroundColor: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            {children}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export function CoverHero({ src, alt }: { src: string; alt: string }) {
  return (
    <Section style={{ padding: "0" }}>
      <Img
        src={src}
        alt={alt}
        width={640}
        style={{ display: "block", width: "100%", border: "none" }}
      />
    </Section>
  );
}

export function MailTitle({ children }: { children: React.ReactNode }) {
  return (
    <Heading
      as="h1"
      style={{
        fontSize: "34px",
        lineHeight: "1.6",
        color: t.ink,
        margin: "0",
        textAlign: "right",
      }}
    >
      {children}
    </Heading>
  );
}

export function MailBody({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        fontSize: "15px",
        lineHeight: "2",
        color: t.ink,
        margin: "16px 0 0",
        textAlign: "right",
      }}
    >
      {children}
    </Text>
  );
}

export function MailCta({ href, label }: { href: string; label: string }) {
  return (
    <Section style={{ textAlign: "center", padding: "28px 0 8px" }}>
      <Button
        href={href}
        style={{
          display: "inline-block",
          backgroundColor: t.accent,
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "bold",
          padding: "13px 40px",
          textDecoration: "none",
          borderRadius: "8px",
        }}
      >
        {label}
      </Button>
    </Section>
  );
}

export function MailChecklist({
  items,
}: {
  items: { title: string; description: string }[];
}) {
  return (
    <Section
      style={{
        backgroundColor: t.band,
        marginTop: "32px",
        padding: "32px 40px",
      }}
    >
      {items.map((item, i) => (
        <Section
          key={item.title}
          style={{
            padding: "16px 0",
            borderBottom:
              i < items.length - 1 ? `1px solid ${t.border}` : "none",
          }}
        >
          <Row>
            <Column style={{ width: "88%" }}>
              <Text
                style={{
                  fontSize: "17px",
                  fontWeight: "bold",
                  color: t.ink,
                  margin: "0",
                  lineHeight: "1.8",
                  textAlign: "right",
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  fontSize: "14px",
                  color: t.muted,
                  margin: "4px 0 0",
                  lineHeight: "1.9",
                  textAlign: "right",
                }}
              >
                {item.description}
              </Text>
            </Column>
            <Column style={{ width: "12%", textAlign: "left" }}>
              <Text
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: t.alt,
                  margin: "0",
                }}
              >
                {["١", "٢", "٣", "٤", "٥", "٦"][i] ?? `${i + 1}`}
              </Text>
            </Column>
          </Row>
        </Section>
      ))}
    </Section>
  );
}

export function MailFooter({
  siteUrl,
  unsubscribeUrl,
}: {
  siteUrl: string;
  unsubscribeUrl?: string;
}) {
  return (
    <Section
      style={{
        padding: "28px 40px",
        borderTop: `1px solid ${t.border}`,
      }}
    >
      <Text
        style={{
          fontSize: "13px",
          color: t.muted,
          margin: "0",
          textAlign: "right",
        }}
      >
        مدونة عقدكم - مقالات وعقارات باللغة العربية.{" "}
        <Link href={siteUrl} style={{ color: t.alt }}>
          تصفح المدونة
        </Link>
      </Text>
      {unsubscribeUrl ? (
        <Text
          style={{
            fontSize: "12px",
            color: t.muted,
            margin: "12px 0 0",
            textAlign: "right",
          }}
        >
          لا ترغب باستلام النشرة؟{" "}
          <Link href={unsubscribeUrl} style={{ color: t.alt }}>
            إلغاء الاشتراك
          </Link>
        </Text>
      ) : null}
    </Section>
  );
}
