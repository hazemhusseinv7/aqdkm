import { Img, Link, Section, Text } from "react-email";

import {
  CoverHero,
  MailBody,
  MailCta,
  MailShell,
  MailTitle,
} from "./_components/blocks";
import { mailTheme as t } from "./_components/theme";

interface Props {
  title: string;
  excerpt: string;
  postUrl: string;
  siteUrl: string;
  coverUrl?: string | null;
}

export function NewPostBroadcast({
  title,
  excerpt,
  postUrl,
  siteUrl,
  coverUrl,
}: Props) {
  return (
    <MailShell preview={`مقال جديد: ${title}`}>
      {coverUrl ? (
        <Section style={{ padding: "0" }}>
          <Img
            src={coverUrl}
            alt={title}
            width={640}
            style={{ display: "block", width: "100%", border: "none" }}
          />
        </Section>
      ) : (
        <CoverHero
          src={`${siteUrl}/emails/cover-header.jpg`}
          alt="مدونة عقدكم"
        />
      )}
      <Section style={{ padding: "8px 40px 40px" }}>
        <MailTitle>{title}</MailTitle>
        <MailBody>{excerpt}</MailBody>
        <MailCta href={postUrl} label="قراءة المقال" />
      </Section>
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
          مدونة عقدكم — مقالات وعقارات باللغة العربية.{" "}
          <Link href={siteUrl} style={{ color: t.alt }}>
            تصفح المدونة
          </Link>
        </Text>
        <Text
          style={{
            fontSize: "12px",
            color: t.muted,
            margin: "12px 0 0",
            textAlign: "right",
          }}
        >
          لا ترغب باستلام النشرة؟{" "}
          {/* Resolved per recipient by the Broadcast API. */}
          <Link href="{{{RESEND_UNSUBSCRIBE_URL}}}" style={{ color: t.alt }}>
            إلغاء الاشتراك
          </Link>
        </Text>
      </Section>
    </MailShell>
  );
}

export default function NewPostBroadcastPreview() {
  return (
    <NewPostBroadcast
      title="دليل توثيق عقد الإيجار السكني خطوة بخطوة"
      excerpt="كل ما تحتاج معرفته قبل توقيع العقد: الصك، المدة، الرسوم، والمراجعة."
      postUrl="http://localhost:3000/blog/preview-slug"
      siteUrl="http://localhost:3000"
      coverUrl={null}
    />
  );
}
