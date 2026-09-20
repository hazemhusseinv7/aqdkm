import { Section } from "react-email";

import {
  CoverHero,
  MailBody,
  MailChecklist,
  MailCta,
  MailFooter,
  MailShell,
  MailTitle,
} from "./_components/blocks";

interface Props {
  unsubscribeUrl: string;
  siteUrl: string;
}

const TIPS = [
  {
    title: "صفة مقدم الطلب",
    description: "حدد صفتك لبدء الطلب وتخصيص الخطوات التالية.",
  },
  {
    title: "بيانات الأطراف",
    description: "أدخل بيانات التواصل والهوية لجميع أطراف العقد.",
  },
  {
    title: "الصك والموقع",
    description: "سجل رقم الصك وتاريخه وبيانات موقع العقار.",
  },
  {
    title: "شروط العقد",
    description: "حدد مدة العقد وقيمة الإيجار وطريقة الدفع.",
  },
  {
    title: "بيانات الوحدة",
    description: "أوصاف الوحدة والعدادات والمرافق الإضافية.",
  },
  {
    title: "المراجعة والإرسال",
    description: "راجع ملخص الطلب ثم أرسله واحتفظ برقم المتابعة.",
  },
];

export function NewsletterWelcome({ unsubscribeUrl, siteUrl }: Props) {
  return (
    <MailShell preview="تم اشتراكك في نشرة عقدكم بنجاح">
      <CoverHero src={`${siteUrl}/emails/cover-header.jpg`} alt="مدونة عقدكم" />
      <Section style={{ padding: "8px 40px 0" }}>
        <MailTitle>أهلاً بك في نشرة عقدكم</MailTitle>
        <MailBody>
          تم تأكيد اشتراكك بنجاح. ستصلك مختارات المقالات العقارية الجديدة على
          بريدك.
        </MailBody>
        <MailCta href={`${siteUrl}/`} label="تصفح المقالات" />
      </Section>
      <MailChecklist items={TIPS} />
      <MailFooter siteUrl={siteUrl} unsubscribeUrl={unsubscribeUrl} />
    </MailShell>
  );
}

export default function NewsletterWelcomePreview() {
  return (
    <NewsletterWelcome
      unsubscribeUrl="http://localhost:3000/newsletter/unsubscribe?email=preview@example.com"
      siteUrl="http://localhost:3000"
    />
  );
}
