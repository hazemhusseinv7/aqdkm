"use client";

import { useState } from "react";
import {
  Button,
  Card,
  Chip,
  FieldError,
  Form,
  Input,
  Label,
  Spinner,
  TextField,
} from "@heroui/react";
import { BiSolidCoinStack } from "react-icons/bi";
import { FaBuilding, FaHome } from "react-icons/fa";
import {
  MdCancel,
  MdCheckCircle,
  MdDateRange,
  MdDoneAll,
  MdHourglassTop,
  MdInbox,
  MdNumbers,
  MdPhone,
  MdSearch,
  MdSearchOff,
} from "react-icons/md";
import { formatPostDate } from "@/lib/blog";
import { REQUEST_STATUS_AR } from "@/lib/request-fields";
import { lookupPhoneOk } from "@/lib/validation";
import { getRequestDetail, getRequestStatus } from "@/sanity/lib/actions";
import type { RequestDetail, RequestStatus } from "@/lib/request-form";
import { RequestDetails } from "@/components/request/request-details";
import { SummaryRow } from "@/components/request/summary-row";
import { Price } from "@/components/price";

const STATUS_TONE: Record<
  string,
  "default" | "warning" | "accent" | "success" | "danger"
> = {
  new: "default",
  reviewing: "warning",
  approved: "accent",
  completed: "success",
  cancelled: "danger",
};

const STATUS_ICON: Record<string, typeof MdInbox> = {
  new: MdInbox,
  reviewing: MdHourglassTop,
  approved: MdCheckCircle,
  completed: MdDoneAll,
  cancelled: MdCancel,
};

export function TrackForm() {
  const [searching, setSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [result, setResult] = useState<RequestStatus>(null);
  const [detail, setDetail] = useState<RequestDetail>(null);
  const [phoneMismatch, setPhoneMismatch] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const requestNo = `${new FormData(form).get("requestNo") ?? ""}`;
    const applicantPhone = `${new FormData(form).get("applicantPhone") ?? ""}`;
    setResult(null);
    setDetail(null);
    setPhoneMismatch(false);
    setLoadError(false);
    setSearched(false);
    if (
      !/^REQ-\d{4}-\d{6}$/i.test(requestNo.trim()) ||
      !lookupPhoneOk(applicantPhone)
    ) {
      return;
    }
    setSearching(true);
    const [statusRes, fullRes] = await Promise.allSettled([
      getRequestStatus(requestNo),
      getRequestDetail(requestNo, applicantPhone),
    ]);
    const failed =
      statusRes.status === "rejected" || fullRes.status === "rejected";
    const status = statusRes.status === "fulfilled" ? statusRes.value : null;
    const full = fullRes.status === "fulfilled" ? fullRes.value : null;
    setResult(status);
    setDetail(full);
    setPhoneMismatch(!failed && status !== null && full === null);
    setLoadError(failed);
    setSearched(true);
    setSearching(false);
  };

  const isCommercial = result?.contractType === "commercial";
  const StatusIcon = result ? (STATUS_ICON[result.status] ?? MdInbox) : MdInbox;

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <Form
        aria-label="نموذج تتبع الطلب"
        validationBehavior="aria"
        className="flex min-w-0 flex-col gap-4"
        onSubmit={onSubmit}
      >
        <TextField
          isRequired
          name="requestNo"
          validate={(value) => {
            if (!value) return null;
            if (!/^REQ-\d{4}-\d{6}$/i.test(value.trim())) {
              return "صيغة رقم الطلب غير صحيحة (مثال: REQ-2026-000000)";
            }
            return null;
          }}
        >
          <Label>رقم الطلب</Label>
          <Input placeholder="REQ-2026-000000" dir="ltr" />
          <FieldError />
        </TextField>
        <TextField
          isRequired
          name="applicantPhone"
          validate={(value) => {
            if (!value) return null;
            if (!lookupPhoneOk(value)) {
              return "رقم الجوال غير صالح";
            }
            return null;
          }}
        >
          <Label>جوال مقدم الطلب</Label>
          <Input placeholder="05xx xxx xxx" dir="ltr" inputMode="tel" />
          <FieldError />
        </TextField>
        <div>
          <Button type="submit" isDisabled={searching} className="min-w-32">
            {searching ? (
              <Spinner size="sm" />
            ) : (
              <MdSearch className="size-4" />
            )}
            {searching ? "جارٍ البحث…" : "تتبع الطلب"}
          </Button>
        </div>
      </Form>

      {searched && !searching && result && (
        <Card variant="secondary">
          <Card.Content className="flex flex-col gap-2 px-6 py-4">
            <SummaryRow icon={<MdNumbers />} label="رقم الطلب">
              <strong dir="ltr">{result.requestNo}</strong>
            </SummaryRow>
            <SummaryRow
              icon={isCommercial ? <FaBuilding /> : <FaHome />}
              label="نوع العقد"
            >
              <Chip
                variant="soft"
                className={isCommercial ? "bg-alt/10 text-alt" : undefined}
              >
                {isCommercial ? (
                  <FaBuilding className="size-3.5" />
                ) : (
                  <FaHome className="size-3.5" />
                )}
                {isCommercial ? "تجاري" : "سكني"}
              </Chip>
            </SummaryRow>
            <SummaryRow icon={<MdHourglassTop />} label="حالة الطلب">
              <Chip
                color={STATUS_TONE[result.status] ?? "default"}
                variant="soft"
              >
                <StatusIcon className="size-3.5" />
                {REQUEST_STATUS_AR[result.status] ?? result.status}
              </Chip>
            </SummaryRow>
            {result.submittedAt && (
              <SummaryRow icon={<MdDateRange />} label="تاريخ التقديم">
                <span className="font-medium">
                  {formatPostDate(result.submittedAt)}
                </span>
              </SummaryRow>
            )}
            {result.feeTotal !== null && (
              <SummaryRow
                icon={<BiSolidCoinStack />}
                label="رسوم التوثيق التقديرية"
                highlight
              >
                <Price value={result.feeTotal} />
              </SummaryRow>
            )}
          </Card.Content>
        </Card>
      )}

      {searched && !searching && result && detail && (
        <Card variant="secondary">
          <Card.Content className="flex flex-col gap-5 px-6 py-4">
            <RequestDetails detail={detail} />
          </Card.Content>
        </Card>
      )}

      {searched && !searching && phoneMismatch && (
        <Card variant="secondary" className="text-center">
          <Card.Header className="flex-col items-center gap-2 pt-8">
            <span className="bg-alt/15 text-alt flex size-14 items-center justify-center rounded-full">
              <MdPhone className="size-8" />
            </span>
            <h2 className="text-foreground text-sm leading-6 font-medium">
              رقم الجوال لا يطابق مقدم هذا الطلب
            </h2>
            <Card.Description>
              تظهر حالة الطلب أعلاه، لكن تفاصيل الطلب الكاملة تتطلب جوال مقدم
              الطلب المسجل عليه.
            </Card.Description>
          </Card.Header>
        </Card>
      )}

      {searched && !searching && loadError && (
        <Card variant="secondary" className="text-center">
          <Card.Header className="flex-col items-center gap-2 pt-8">
            <span className="bg-danger/15 text-danger flex size-14 items-center justify-center rounded-full">
              <MdSearchOff className="size-8" />
            </span>
            <h2 className="text-foreground text-sm leading-6 font-medium">
              تعذر تحميل البيانات
            </h2>
            <Card.Description>
              حدث خطأ أثناء الاتصال، يرجى المحاولة مجدداً.
            </Card.Description>
          </Card.Header>
        </Card>
      )}

      {searched && !searching && !loadError && !result && (
        <Card variant="secondary" className="text-center">
          <Card.Header className="flex-col items-center gap-2 pt-8">
            <span className="bg-accent/15 text-accent flex size-14 items-center justify-center rounded-full">
              <MdSearchOff className="size-8" />
            </span>
            <h2 className="text-foreground text-sm leading-6 font-medium">
              لم يتم العثور على طلب بهذا الرقم
            </h2>
            <Card.Description>تحقق من رقم الطلب وحاول مجدداً.</Card.Description>
          </Card.Header>
        </Card>
      )}
    </div>
  );
}
