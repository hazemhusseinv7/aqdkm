import { Section, Text } from "react-email";

import {
  CoverHero,
  MailBody,
  MailFooter,
  MailShell,
  MailTitle,
} from "./_components/blocks";
import { mailTheme as t } from "./_components/theme";
import {
  FIELD_LABELS,
  EXTRA_LABELS,
  counterTypeText,
  OPTION_VALUES,
  propValueLists,
} from "@/lib/request-fields";
import {
  countText,
  durationText,
  extrasText,
  formatDateValue,
  formatDualDate,
  formatMoney,
  lookupOption,
  resolveOtherOption,
  yesNo,
} from "@/lib/request-display";
import type { RequestDetail } from "@/lib/request-form";

type Detail = NonNullable<RequestDetail>;
type Row = { label: string; display: string | null };

const L = FIELD_LABELS;
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

export function NewRequestNotification({
  detail,
  siteUrl,
}: {
  detail: Detail;
  siteUrl: string;
}) {
  const isCommercial = detail.contractType === "commercial";
  const { propList, unitList } = propValueLists(isCommercial);
  const p = detail.property;
  const c = detail.counterparty;
  const loc = detail.location;
  const tm = detail.terms;
  const isEntity = counterTypeText(c?.counterType) === "منشأة";

  const counterpartyRows: Row[] = [
    { label: L.counterpartyType.ar, display: counterTypeText(c?.counterType) },
    ...(c?.ownerIban ? [{ label: L.ownerIban.ar, display: c.ownerIban }] : []),
    ...(isEntity
      ? [
          {
            label: L.counterpartyUnifiedNumber.ar,
            display: c?.unifiedNumber ?? null,
          },
          {
            label: L.counterpartyEntityName.ar,
            display: c?.entityName ?? null,
          },
          { label: L.counterpartyRepId.ar, display: c?.repId ?? null },
          { label: L.counterpartyRepPhone.ar, display: c?.repPhone ?? null },
          {
            label: L.counterpartyRepDob.ar,
            display: formatDualDate(c?.repDob),
          },
          {
            label: L.counterpartyAuthNumber.ar,
            display: c?.authNumber ?? null,
          },
        ]
      : [
          {
            label: L.counterpartyNationalId.ar,
            display: c?.nationalId ?? null,
          },
          { label: L.counterpartyPhone.ar, display: c?.phone ?? null },
          {
            label: L.counterpartyDob.ar,
            display: formatDualDate(c?.dob),
          },
        ]),
  ];

  return (
    <MailShell preview={`طلب توثيق جديد: ${detail.requestNo}`}>
      <CoverHero src={`${siteUrl}/emails/cover-header.jpg`} alt="مدونة عقدكم" />
      <Section style={{ padding: "8px 40px 40px" }}>
        <MailTitle>طلب توثيق جديد</MailTitle>
        <MailBody>
          رقم الطلب: {detail.requestNo} - {isCommercial ? "تجاري" : "سكني"} -
          قُدّم بتاريخ {formatDateValue(detail.submittedAt) ?? "-"}
        </MailBody>
        <MailSection
          title="بيانات مقدم الطلب"
          rows={[
            {
              label: L.applicantRole.ar,
              display: lookupOption(OPTION_VALUES.role, detail.applicant.role),
            },
            {
              label: L.applicantPhone.ar,
              display: detail.applicant.phone ?? null,
            },
            {
              label: L.applicantNationalId.ar,
              display: detail.applicant.nationalId ?? null,
            },
            {
              label: L.applicantDob.ar,
              display: formatDualDate(detail.applicant.dob),
            },
            ...(detail.applicant.ownerIban
              ? [
                  {
                    label: L.ownerIban.ar,
                    display: detail.applicant.ownerIban,
                  },
                ]
              : []),
            {
              label: L.applicantIsAgent.ar,
              display: yesNo(detail.applicant.isAgent),
            },
            ...(detail.applicant.isAgent
              ? [
                  {
                    label: L.applicantAgencyNumber.ar,
                    display: detail.applicant.agencyNumber ?? null,
                  },
                ]
              : []),
          ]}
        />
        <MailSection title="بيانات الطرف الآخر" rows={counterpartyRows} />
        <MailSection
          title="بيانات الصك"
          rows={[
            { label: L.propertyDeedNumber.ar, display: p?.deedNumber ?? null },
            {
              label: L.propertyDeedDate.ar,
              display: formatDualDate(p?.deedDate),
            },
          ]}
        />
        <MailSection
          title="موقع العقار"
          rows={
            loc?.locationManual === false
              ? [{ label: L.mapsLink.ar, display: loc?.mapsLink ?? null }]
              : [
                  ...(loc?.mapsLink
                    ? [{ label: L.mapsLink.ar, display: loc?.mapsLink ?? null }]
                    : []),
                  {
                    label: L.city.ar,
                    display: lookupOption(OPTION_VALUES.city, loc?.city),
                  },
                  {
                    label: L.buildingNumber.ar,
                    display: loc?.buildingNumber ?? null,
                  },
                  {
                    label: L.additionalNumber.ar,
                    display: loc?.additionalNumber ?? null,
                  },
                  { label: L.postalCode.ar, display: loc?.postalCode ?? null },
                ]
          }
        />
        <MailSection
          title="مواصفات العقار"
          rows={[
            {
              label: L.propertyType.ar,
              display: resolveOtherOption(
                p?.propertyType,
                p?.propertyCustom,
                propList,
              ),
            },
            {
              label: L.unitType.ar,
              display: resolveOtherOption(p?.unitType, p?.unitCustom, unitList),
            },
            { label: L.unitNumber.ar, display: p?.unitNumber ?? null },
            {
              label: L.area.ar,
              display: p?.area != null ? `${p.area} م²` : null,
            },
            {
              label: L.floor.ar,
              display: resolveOtherOption(
                p?.floor,
                p?.floorCustom,
                OPTION_VALUES.floor,
              ),
            },
            {
              label: L.rooms.ar,
              display: countText(p?.rooms, p?.roomsCustom),
            },
            { label: L.extras.ar, display: extrasText(p?.extras) },
            ...(p?.extras?.some(
              (e) => e.kind === "kitchen" || e.kind === EXTRA_LABELS.kitchen,
            )
              ? [
                  {
                    label: L.kitchenCabinets.ar,
                    display:
                      p?.kitchenCabinets == null
                        ? null
                        : yesNo(p.kitchenCabinets),
                  },
                ]
              : []),
            { label: L.electroMeter.ar, display: p?.electroMeter ?? null },
            { label: L.waterMeter.ar, display: p?.waterMeter ?? null },
            ...(isCommercial
              ? [
                  { label: L.activity.ar, display: p?.activity ?? null },
                  {
                    label: L.hasLicense.ar,
                    display:
                      p?.hasLicense == null
                        ? null
                        : p.hasLicense
                          ? "يوجد"
                          : "لا يوجد",
                  },
                  {
                    label: L.licenseNumber.ar,
                    display: p?.licenseNumber ?? null,
                  },
                ]
              : []),
          ]}
        />
        <MailSection
          title="مدة العقد"
          rows={[
            {
              label: L.contractStart.ar,
              display: formatDualDate(tm?.contractStart),
            },
            {
              label: L.duration.ar,
              display: durationText(tm?.duration, tm?.customMonths),
            },
            ...(tm?.duration === "custom" || tm?.duration === "مخصص"
              ? [
                  {
                    label: L.customMonths.ar,
                    display:
                      tm.customMonths != null ? `${tm.customMonths}` : null,
                  },
                ]
              : []),
          ]}
        />
        <MailSection
          title="الدفع والرسوم"
          rows={[
            {
              label: L.payment.ar,
              display: lookupOption(OPTION_VALUES.payment, tm?.payment),
            },
            { label: L.annualRent.ar, display: formatMoney(tm?.annualRent) },
            {
              label: L.feeYears.ar,
              display:
                tm?.feeBreakdown?.years != null
                  ? `${tm.feeBreakdown.years}`
                  : null,
            },
            {
              label: L.feeGovernment.ar,
              display: formatMoney(tm?.feeBreakdown?.government),
            },
            {
              label: L.feeCompany.ar,
              display: formatMoney(tm?.feeBreakdown?.company),
            },
            {
              label: L.feeTotal.ar,
              display: formatMoney(tm?.feeBreakdown?.total),
            },
            {
              label: L.notes.ar,
              display: tm?.notes?.trim() ? tm.notes : null,
            },
          ]}
        />
        <Section style={{ padding: "8px 0 0" }}>
          <MailBody>
            <span style={{ fontSize: "13px", color: t.muted }}>
              لمراجعة الطلب وتحديث حالته، افتح الاستوديو من لوحة التحكم.
            </span>
          </MailBody>
        </Section>
      </Section>
      <MailFooter siteUrl={siteUrl} />
    </MailShell>
  );
}

export default function NewRequestNotificationPreview() {
  return (
    <NewRequestNotification
      siteUrl="http://localhost:3000"
      detail={{
        requestNo: "REQ-2026-000001",
        contractType: "residential",
        status: "new",
        submittedAt: "2026-09-20T07:37:49.297Z",
        applicant: {
          role: "owner",
          isAgent: false,
          phone: "550336663",
          nationalId: "1111133333",
        },
        counterparty: { counterType: "individual" },
        property: {},
        location: {},
        terms: {},
      }}
    />
  );
}
