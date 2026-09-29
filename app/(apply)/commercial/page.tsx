import Link from "next/link";
import { Card, Chip, Separator, Typography } from "@heroui/react";
import { FaBuilding } from "react-icons/fa";
import { Logo } from "@/components/logo";
import { ApplyThemeToggle } from "@/components/shell/apply-theme-toggle";
import { SmartForm } from "@/components/smart-form/smart-form";
import { DEFAULT_FEE_CONFIG, feeConfigFromSettings } from "@/lib/fees";
import { client } from "@/sanity/lib/client";
import { BLOG_CACHE_TAG } from "@/lib/constants";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";

export const metadata = {
  title: "طلب توثيق عقد تجاري",
  description:
    "قدّم طلب توثيق عقد الإيجار التجاري: توثيق رسمي عبر منصة إيجار والدفع بعد المعاينة",
};

export default async function CommercialPage() {
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-5 sm:px-6">
      <Card className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <Link href="/" aria-label="عقدكم - الرئيسية" className="inline-flex">
            <Logo />
          </Link>
          <span className="ms-auto inline-flex items-center gap-3">
            <ApplyThemeToggle />
            <Chip color="success" variant="soft" size="lg">
              <FaBuilding className="size-3.5" />
              تجاري
            </Chip>
          </span>
        </div>
        <Separator className="my-4" />
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <span className="bg-accent text-accent-foreground flex size-9 shrink-0 items-center justify-center rounded-2xl">
            <FaBuilding className="size-5" />
          </span>
          <div className="min-w-0">
            <Typography type="h1" weight="bold" className="text-2xl">
              طلب توثيق عقد تجاري
            </Typography>
            <Typography type="body-sm" color="muted">
              مخصص للأفراد والمنشآت: بيانات الطرف الآخر والوحدة التجارية
            </Typography>
          </div>
        </div>
      </Card>
      <SmartForm contractType="commercial" feeConfig={feeConfig} />
    </div>
  );
}
