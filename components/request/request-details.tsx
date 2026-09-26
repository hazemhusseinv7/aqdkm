"use client";

import { useState } from "react";
import { toast } from "@heroui/react";
import { BiSolidCoinStack } from "react-icons/bi";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { FaBuilding, FaUsers } from "react-icons/fa";
import { FaFileContract } from "react-icons/fa";
import {
  MdBadge,
  MdBed,
  MdCake,
  MdCheck,
  MdContentCopy,
  MdDateRange,
  MdGavel,
  MdHome,
  MdKitchen,
  MdLayers,
  MdLightbulb,
  MdLocationOn,
  MdNotes,
  MdNumbers,
  MdPayments,
  MdPhone,
  MdSquareFoot,
  MdTimelapse,
  MdWaterDrop,
  MdWeekend,
} from "react-icons/md";
import { PiBathtubFill } from "react-icons/pi";

import {
  FIELD_LABELS,
  counterTypeText,
  OPTION_VALUES,
  propValueLists,
} from "@/lib/request-fields";
import { Price, priceText } from "@/components/price";
import {
  countText,
  durationText,
  extrasText,
  formatDualDate,
  lookupOption,
  resolveOtherOption,
  yesNo,
} from "@/lib/request-display";
import type { RequestDetail } from "@/lib/request-form";

type Detail = NonNullable<RequestDetail>;

const EMPTY = "—";
const L = FIELD_LABELS;

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  }
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false);

  async function handleCopy() {
    const ok = await copyText(text);
    if (ok) {
      toast.success("تم نسخ البيانات");
      setDone(true);
      window.setTimeout(() => setDone(false), 1500);
    } else {
      toast("تعذّر النسخ تلقائياً", { variant: "danger" });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={`نسخ ${label}`}
      title={`نسخ ${label}`}
      className="text-muted hover:bg-accent flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg transition-colors hover:text-white"
    >
      {done ? (
        <MdCheck className="size-4" aria-hidden="true" />
      ) : (
        <MdContentCopy className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

function FieldRow({
  icon,
  label,
  display,
  copy,
  ltr = false,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  display: React.ReactNode;
  copy?: string | null;
  ltr?: boolean;
  href?: string | null;
}) {
  const value = display ?? EMPTY;
  const copyTextValue = copy ?? (typeof display === "string" ? display : null);
  return (
    <div className="bg-surface flex items-center justify-between gap-3 rounded-2xl p-3 text-sm">
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <span className="bg-accent/10 text-accent flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-muted text-xs">{label}</p>
          {href && display ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              dir={ltr ? "ltr" : undefined}
              className="text-accent hover:text-alt block truncate font-bold break-all"
            >
              {value}
            </a>
          ) : (
            <p
              dir={ltr ? "ltr" : undefined}
              className="text-foreground truncate font-bold"
            >
              {value}
            </p>
          )}
        </div>
      </div>
      {copyTextValue ? <CopyButton text={copyTextValue} label={label} /> : null}
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-2">
      <h3 className="text-foreground flex items-center gap-2 text-sm font-bold">
        <span className="text-accent inline-flex [&_svg]:size-4">{icon}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

export function RequestDetails({ detail }: { detail: Detail }) {
  const isCommercial = detail.contractType === "commercial";
  const { propList, unitList } = propValueLists(isCommercial);
  const p = detail.property;
  const c = detail.counterparty;
  const t = detail.terms;
  const isEntity = counterTypeText(c?.counterType) === "منشأة";

  const durationDisplay = durationText(t?.duration, t?.customMonths);
  const extrasDisplay = extrasText(p?.extras);

  return (
    <div className="flex flex-col gap-5">
      <Section icon={<MdBadge />} title="بيانات مقدم الطلب">
        <FieldRow
          icon={<FaUsers />}
          label={L.applicantRole.ar}
          display={lookupOption(OPTION_VALUES.role, detail.applicant.role)}
        />
        <FieldRow
          icon={<MdPhone />}
          label={L.applicantPhone.ar}
          display={detail.applicant.phone ?? null}
          ltr
        />
        <FieldRow
          icon={<MdBadge />}
          label={L.applicantNationalId.ar}
          display={detail.applicant.nationalId ?? null}
          ltr
        />
        <FieldRow
          icon={<MdCake />}
          label={L.applicantDob.ar}
          display={formatDualDate(detail.applicant.dob)}
          copy={detail.applicant.dob ?? null}
        />
        <FieldRow
          icon={<MdGavel />}
          label={L.applicantIsAgent.ar}
          display={yesNo(detail.applicant.isAgent)}
        />
        {detail.applicant.isAgent ? (
          <FieldRow
            icon={<MdGavel />}
            label={L.applicantAgencyNumber.ar}
            display={detail.applicant.agencyNumber ?? null}
            ltr
          />
        ) : null}
      </Section>

      <Section icon={<FaUsers />} title="بيانات الطرف الآخر">
        <FieldRow
          icon={isEntity ? <FaBuilding /> : <FaUsers />}
          label={L.counterpartyType.ar}
          display={counterTypeText(c?.counterType)}
        />
        {isEntity ? (
          <>
            <FieldRow
              icon={<MdNumbers />}
              label={L.counterpartyUnifiedNumber.ar}
              display={c?.unifiedNumber ?? null}
              ltr
            />
            <FieldRow
              icon={<FaBuilding />}
              label={L.counterpartyEntityName.ar}
              display={c?.entityName ?? null}
            />
            <FieldRow
              icon={<MdBadge />}
              label={L.counterpartyRepId.ar}
              display={c?.repId ?? null}
              ltr
            />
            <FieldRow
              icon={<MdPhone />}
              label={L.counterpartyRepPhone.ar}
              display={c?.repPhone ?? null}
              ltr
            />
            <FieldRow
              icon={<MdCake />}
              label={L.counterpartyRepDob.ar}
              display={formatDualDate(c?.repDob)}
              copy={c?.repDob ?? null}
            />
            <FieldRow
              icon={<MdGavel />}
              label={L.counterpartyAuthNumber.ar}
              display={c?.authNumber ?? null}
              ltr
            />
          </>
        ) : (
          <>
            <FieldRow
              icon={<MdBadge />}
              label={L.counterpartyNationalId.ar}
              display={c?.nationalId ?? null}
              ltr
            />
            <FieldRow
              icon={<MdPhone />}
              label={L.counterpartyPhone.ar}
              display={c?.phone ?? null}
              ltr
            />
            <FieldRow
              icon={<MdCake />}
              label={L.counterpartyDob.ar}
              display={formatDualDate(c?.dob)}
              copy={c?.dob ?? null}
            />
          </>
        )}
      </Section>

      <Section icon={<FaFileContract />} title="بيانات الصك">
        <FieldRow
          icon={<FaFileContract />}
          label={L.propertyDeedNumber.ar}
          display={p?.deedNumber ?? null}
          ltr
        />
        <FieldRow
          icon={<BsCalendar2WeekFill />}
          label={L.propertyDeedDate.ar}
          display={formatDualDate(p?.deedDate)}
          copy={p?.deedDate ?? null}
        />
      </Section>

      <Section icon={<MdLocationOn />} title="موقع العقار">
        {detail.location?.locationManual === false ? (
          <FieldRow
            icon={<MdLocationOn />}
            label={L.mapsLink.ar}
            display={detail.location?.mapsLink ?? null}
            copy={detail.location?.mapsLink ?? null}
            ltr
            href={detail.location?.mapsLink ?? null}
          />
        ) : (
          <>
            {detail.location?.mapsLink ? (
              <FieldRow
                icon={<MdLocationOn />}
                label={L.mapsLink.ar}
                display={detail.location?.mapsLink ?? null}
                copy={detail.location?.mapsLink ?? null}
                ltr
                href={detail.location?.mapsLink ?? null}
              />
            ) : null}
            <FieldRow
              icon={<MdLocationOn />}
              label={L.city.ar}
              display={lookupOption(OPTION_VALUES.city, detail.location?.city)}
            />
            <FieldRow
              icon={<MdHome />}
              label={L.buildingNumber.ar}
              display={detail.location?.buildingNumber ?? null}
              ltr
            />
            <FieldRow
              icon={<MdNumbers />}
              label={L.additionalNumber.ar}
              display={detail.location?.additionalNumber ?? null}
              ltr
            />
            <FieldRow
              icon={<MdLocationOn />}
              label={L.postalCode.ar}
              display={detail.location?.postalCode ?? null}
              ltr
            />
          </>
        )}
      </Section>

      <Section icon={<MdHome />} title="مواصفات العقار">
        <FieldRow
          icon={<MdHome />}
          label={L.propertyType.ar}
          display={resolveOtherOption(
            p?.propertyType,
            p?.propertyCustom,
            propList,
          )}
        />
        <FieldRow
          icon={<FaBuilding />}
          label={L.unitType.ar}
          display={resolveOtherOption(p?.unitType, p?.unitCustom, unitList)}
        />
        <FieldRow
          icon={<MdNumbers />}
          label={L.unitNumber.ar}
          display={p?.unitNumber ?? null}
          ltr
        />
        <FieldRow
          icon={<MdSquareFoot />}
          label={L.area.ar}
          display={p?.area != null ? `${p.area} م²` : null}
          copy={p?.area != null ? `${p.area}` : null}
        />
        <FieldRow
          icon={<MdLayers />}
          label={L.floor.ar}
          display={resolveOtherOption(
            p?.floor,
            p?.floorCustom,
            OPTION_VALUES.floor,
          )}
        />
        <FieldRow
          icon={<MdBed />}
          label={L.bedrooms.ar}
          display={countText(p?.bedrooms, p?.bedroomsCustom)}
        />
        <FieldRow
          icon={<PiBathtubFill />}
          label={L.bathrooms.ar}
          display={countText(p?.bathrooms, p?.bathroomsCustom)}
        />
        <FieldRow
          icon={<MdKitchen />}
          label={L.extras.ar}
          display={extrasDisplay}
          copy={extrasDisplay}
        />
        <FieldRow
          icon={<MdWeekend />}
          label={L.livingRooms.ar}
          display={p?.livingRooms != null ? `${p.livingRooms}` : null}
        />
        <FieldRow
          icon={<MdLightbulb />}
          label={L.electroMeter.ar}
          display={p?.electroMeter ?? null}
          ltr
        />
        <FieldRow
          icon={<MdWaterDrop />}
          label={L.waterMeter.ar}
          display={p?.waterMeter ?? null}
          ltr
        />
        <FieldRow
          icon={<MdHome />}
          label={L.activity.ar}
          display={p?.activity ?? null}
        />
        <FieldRow
          icon={<MdBadge />}
          label={L.hasLicense.ar}
          display={
            p?.hasLicense == null ? null : p.hasLicense ? "يوجد" : "لا يوجد"
          }
        />
        <FieldRow
          icon={<MdBadge />}
          label={L.licenseNumber.ar}
          display={p?.licenseNumber ?? null}
          ltr
        />
      </Section>

      <Section icon={<MdTimelapse />} title="مدة العقد">
        <FieldRow
          icon={<MdDateRange />}
          label={L.contractStart.ar}
          display={formatDualDate(t?.contractStart)}
          copy={t?.contractStart ?? null}
        />
        <FieldRow
          icon={<MdTimelapse />}
          label={L.duration.ar}
          display={durationDisplay}
          copy={durationDisplay}
        />
      </Section>

      <Section icon={<MdPayments />} title="الدفع والرسوم">
        <FieldRow
          icon={<MdPayments />}
          label={L.payment.ar}
          display={lookupOption(OPTION_VALUES.payment, t?.payment)}
        />
        <FieldRow
          icon={<BiSolidCoinStack />}
          label={L.annualRent.ar}
          display={
            t?.annualRent != null ? <Price value={t.annualRent} /> : null
          }
          copy={priceText(t?.annualRent)}
        />
        <FieldRow
          icon={<FaUsers />}
          label={L.feePayer.ar}
          display={lookupOption(OPTION_VALUES.feePayer, t?.feePayer)}
        />
        <FieldRow
          icon={<BiSolidCoinStack />}
          label={L.feeTotal.ar}
          display={
            t?.feeBreakdown?.total != null ? (
              <Price value={t.feeBreakdown.total} />
            ) : null
          }
          copy={priceText(t?.feeBreakdown?.total)}
        />
        <FieldRow
          icon={<MdNotes />}
          label={L.notes.ar}
          display={t?.notes?.trim() ? t.notes : null}
        />
      </Section>
    </div>
  );
}
