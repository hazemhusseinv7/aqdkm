import { Section } from "react-email";

import {
  CoverHero,
  MailBody,
  MailCta,
  MailFooter,
  MailShell,
  MailTitle,
} from "./_components/blocks";
import { mailTheme as t } from "./_components/theme";

interface Props {
  confirmUrl: string;
  siteUrl: string;
}

export function NewsletterConfirm({ confirmUrl, siteUrl }: Props) {
  return (
    <MailShell preview="أكّد اشتراكك في نشرة عقدكم">
      <CoverHero src={`${siteUrl}/emails/cover-header.jpg`} alt="مدونة عقدكم" />
      <Section style={{ padding: "8px 40px 40px" }}>
        <MailTitle>أكّد اشتراكك في نشرة عقدكم</MailTitle>
        <MailBody>
          اضغط الزر التالي لتأكيد اشتراكك. تنتهي صلاحية هذا الرابط خلال ٢٤ ساعة.
        </MailBody>
        <MailCta href={confirmUrl} label="تأكيد الاشتراك" />
        <MailBody>
          <span style={{ fontSize: "13px", color: t.muted }}>
            إذا لم تطلب هذا الاشتراك، تجاهل هذه الرسالة ولن يتم اشتراك بريدك.
          </span>
        </MailBody>
      </Section>
      <MailFooter siteUrl={siteUrl} />
    </MailShell>
  );
}

export default function NewsletterConfirmPreview() {
  return (
    <NewsletterConfirm
      confirmUrl="http://localhost:3000/newsletter/confirm?token=preview"
      siteUrl="http://localhost:3000"
    />
  );
}
