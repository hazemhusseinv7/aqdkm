import { Breadcrumbs, Chip, Typography } from "@heroui/react";
import { FaHome } from "react-icons/fa";
import { SmartForm } from "@/components/smart-form/smart-form";
import { DEFAULT_FEE_CONFIG, feeConfigFromSettings } from "@/lib/fees";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";

export const metadata = {
  title: "طلب توثيق عقد سكني",
  description: "قدّم طلب توثيق عقد الإيجار السكني بخطوات واضحة ومراجعة قبل الإرسال",
};

export default async function ResidentialPage() {
  let feeConfig = DEFAULT_FEE_CONFIG;
  try {
    const data = await client.fetch(
      SITE_SETTINGS_QUERY,
      {},
      { next: { tags: [BLOG_CACHE_TAG, "siteSettings"] } },
    );
    const settings = data as SITE_SETTINGS_QUERY_RESULT;
    feeConfig = feeConfigFromSettings(settings?.fees);
  } catch {
    feeConfig = DEFAULT_FEE_CONFIG;
  }
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>عقد سكني</Breadcrumbs.Item>
      </Breadcrumbs>
      <div className="flex min-w-0 flex-wrap items-center gap-3">
        <span className="bg-accent text-accent-foreground flex size-11 shrink-0 items-center justify-center rounded-2xl">
          <FaHome className="size-6" />
        </span>
        <div className="min-w-0">
          <Typography type="h1" weight="bold" className="text-3xl">
            طلب توثيق عقد سكني
          </Typography>
          <Typography type="body-sm" color="muted">
            مخصص للأفراد: بيانات السكن وتفاصيل الوحدة
          </Typography>
        </div>
        <Chip color="success" variant="soft" className="ms-auto">
          سكني
        </Chip>
      </div>
      <SmartForm contractType="residential" feeConfig={feeConfig} />
    </div>
  );
}
