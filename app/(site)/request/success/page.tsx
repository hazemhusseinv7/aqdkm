import { Card, Chip } from "@heroui/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaBuilding, FaHome } from "react-icons/fa";
import { MdCheckCircle, MdNumbers, MdReceiptLong } from "react-icons/md";

import { SuccessPing } from "@/components/request/success-ping";
import { SummaryRow } from "@/components/request/summary-row";
import { Price } from "@/components/price";
import { copy } from "@/lib/copy";
import { getRequestStatus } from "@/sanity/lib/actions";

export const metadata = {
  title: "تم استلام الطلب",
  robots: { index: false, follow: false },
};

export default async function RequestSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ no?: string }>;
}) {
  const { no } = await searchParams;
  const normalized = (no ?? "").trim().toUpperCase();
  if (!/^REQ-\d{4}-\d{6}$/.test(normalized)) {
    redirect("/");
  }
  const status = await getRequestStatus(normalized);
  if (!status) {
    redirect("/track");
  }
  const isCommercial = status.contractType === "commercial";

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <SuccessPing
        requestNo={status.requestNo}
        contractType={status.contractType}
        value={status.feeTotal}
      />
      <Card variant="secondary" className="mx-auto max-w-2xl text-center">
        <Card.Header className="flex-col items-center gap-2 pt-8">
          <span className="bg-accent/15 text-accent flex size-14 items-center justify-center rounded-full">
            <MdCheckCircle className="size-8" />
          </span>
          <Card.Title>تم استلام الطلب بنجاح</Card.Title>
          <Card.Description>
            {copy.successFollowUp} يرجى الاحتفاظ برقم الطلب للمتابعة.
          </Card.Description>
        </Card.Header>
        <Card.Content className="flex flex-col gap-2 px-6 pb-4">
          <SummaryRow icon={<MdNumbers />} label="رقم الطلب">
            <strong dir="ltr">{status.requestNo}</strong>
          </SummaryRow>
          <SummaryRow
            icon={isCommercial ? <FaBuilding /> : <FaHome />}
            label="نوع العقد"
          >
            <Chip
              variant="soft"
              className={isCommercial ? "bg-alt/10 text-alt" : undefined}
            >
              {isCommercial ? "تجاري" : "سكني"}
            </Chip>
          </SummaryRow>
          {status.annualRent !== null && (
            <SummaryRow icon={<BiSolidCoinStack />} label="الإيجار السنوي">
              <Price value={status.annualRent} />
            </SummaryRow>
          )}
          {status.feeTotal !== null && (
            <SummaryRow
              icon={<MdReceiptLong />}
              label="رسوم التوثيق التقديرية"
              highlight
            >
              <Price value={status.feeTotal} />
            </SummaryRow>
          )}
          <p className="text-muted text-xs">{copy.feeNote}</p>
        </Card.Content>
        <Card.Footer className="justify-center gap-2 pb-8">
          <Link
            href="/track"
            className="bg-accent rounded-xl px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[var(--alt)]"
          >
            تتبع الطلب
          </Link>
          <Link
            href={isCommercial ? "/commercial" : "/residential"}
            className="border-border bg-surface text-foreground hover:border-alt rounded-xl border px-5 py-2.5 text-sm font-bold transition-colors"
          >
            تقديم طلب جديد
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
