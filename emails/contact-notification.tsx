import { Section, Text } from "react-email";

import {
  CoverHero,
  MailBody,
  MailFooter,
  MailShell,
  MailTitle,
} from "./_components/blocks";
import { mailTheme as t } from "./_components/theme";

type Row = { label: string; display: string | null };

const dash = (v: string | null): string => v ?? "-";

function MailSection({ title, rows }: { title: string; rows: Row[] }) {
  return (
    <Section style={{ padding: "0" }}>
      <Text
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          color: t.accent,
          margin: "28px 0 0",
          textAlign: "right",
        }}
      >
        {title}
      </Text>
      {rows.map((row) => (
        <Section
          key={row.label}
          style={{
            padding: "10px 0",
            borderBottom: `1px solid ${t.border}`,
          }}
        >
          <Text
            style={{
              fontSize: "12px",
              color: t.muted,
              margin: "0",
              textAlign: "right",
            }}
          >
            {row.label}
          </Text>
          <Text
            style={{
              fontSize: "14px",
              fontWeight: "bold",
              color: t.ink,
              margin: "2px 0 0",
              textAlign: "right",
            }}
          >
            {dash(row.display)}
          </Text>
        </Section>
      ))}
    </Section>
  );
}

export function ContactNotification({
  name,
  phone,
  email,
  message,
  siteUrl,
}: {
  name: string;
  phone: string;
  email: string | null;
  message: string;
  siteUrl: string;
}) {
  return (
    <MailShell preview={`رسالة تواصل جديدة من ${name}`}>
      <CoverHero src={`${siteUrl}/emails/cover-header.jpg`} alt="عقدكم" />
      <Section style={{ padding: "8px 40px 40px" }}>
        <MailTitle>رسالة تواصل جديدة</MailTitle>
        <MailBody>
          وصلتكم رسالة جديدة عبر نموذج التواصل. يمكن الرد مباشرة على بريد المرسل
          عند توفره.
        </MailBody>
        <MailSection
          title="بيانات المرسل"
          rows={[
            { label: "الاسم", display: name },
            { label: "رقم الجوال", display: phone },
            { label: "البريد الإلكتروني", display: email },
          ]}
        />
        <MailSection
          title="نص الرسالة"
          rows={[{ label: "الرسالة", display: message }]}
        />
      </Section>
      <MailFooter siteUrl={siteUrl} />
    </MailShell>
  );
}

export default function ContactNotificationPreview() {
  return (
    <ContactNotification
      name="محمد عبدالله"
      phone="0551234567"
      email="preview@example.com"
      message="السلام عليكم، أرغب بالاستفسار عن رسوم توثيق عقد سكني لمدة سنتين."
      siteUrl="http://localhost:3000"
    />
  );
}
