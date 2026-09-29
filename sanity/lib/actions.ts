"use server";

import type {
  RequestDetail,
  RequestStatus,
  SerializedFormState,
} from "@/lib/request-form";
import {
  calcFeeBreakdown,
  durationToMonths,
  feeConfigFromSettings,
  type ContractType,
} from "@/lib/fees";
import {
  isAdultISO,
  normalizePhone,
  validateContact,
  validators,
} from "@/lib/validation";
import { SITE_URL } from "@/lib/blog";
import {
  counterTypeText,
  OPTION_VALUES,
  propValueLists,
  storedArabic,
  storedExtras,
} from "@/lib/request-fields";

import { client } from "./client";
import {
  REQUEST_DETAIL_QUERY,
  REQUEST_STATUS_QUERY,
  SITE_SETTINGS_QUERY,
} from "./queries";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/sanity.types";
import { getWriteClient } from "./writeClient";

function toDateString(date: string | null): string | undefined {
  if (!date) return undefined;
  // Client serializes Gregorian ISO only; reject anything else (e.g. Hijri years).
  if (!/^(19|20)\d{2}-\d{2}-\d{2}$/.test(date)) {
    throw invalid("dateFormat");
  }
  return date;
}

function requestNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `REQ-${year}-${rand}`;
}

function invalid(reason: string): Error {
  return new Error(`Invalid rental request: ${reason}`);
}

function assertValidRentalRequest(
  contractType: ContractType,
  s: SerializedFormState,
): void {
  const isCommercial = contractType === "commercial";
  if (s.role !== "owner" && s.role !== "tenant") throw invalid("role");
  if (!validators.mobile(s.applicantPhone)) throw invalid("applicantPhone");
  if (!validators.nationalOrIqama(s.applicantId)) throw invalid("applicantId");
  if (!validators.iban(s.ownerIban)) throw invalid("ownerIban");
  if (s.role === "tenant" && !isAdultISO(s.applicantDob))
    throw invalid("applicantDob");
  if (s.role === "owner" && s.isAgent && !validators.required(s.agencyNumber))
    throw invalid("agencyNumber");
  if (
    isCommercial &&
    s.counterType !== "entity" &&
    s.counterType !== "individual"
  )
    throw invalid("counterType");
  if (isCommercial && s.counterType === "entity") {
    if (!validators.unifiedNumber(s.unifiedNumber))
      throw invalid("unifiedNumber");
    if (!validators.nationalOrIqama(s.repId)) throw invalid("repId");
    if (!validators.mobile(s.repPhone)) throw invalid("repPhone");
  } else {
    if (!validators.nationalOrIqama(s.otherId)) throw invalid("otherId");
    if (!validators.mobile(s.otherPhone)) throw invalid("otherPhone");
    if (s.role === "owner" && !isAdultISO(s.otherDob))
      throw invalid("otherDob");
  }
  if (!validators.deedNumber(s.deedNumber)) throw invalid("deedNumber");
  if (!s.deedDate) throw invalid("deedDate");
  if (s.locationManual !== true && s.locationManual !== false)
    throw invalid("locationManual");
  if (s.locationManual) {
    if (!validators.required(s.city)) throw invalid("city");
  } else if (!validators.required(s.mapsLink)) {
    throw invalid("mapsLink");
  }
  if (s.postalCode.trim() !== "" && !validators.postal(s.postalCode))
    throw invalid("postalCode");
  if (!s.contractStart) throw invalid("contractStart");
  if (s.duration === "custom" && !(s.customMonths >= 1))
    throw invalid("customMonths");
  if (!(s.annualRent > 0) || !s.duration || !s.payment) throw invalid("terms");
  if (!s.propertyType || !s.unitType || !s.floor) throw invalid("property");
  if (!validators.required(s.unitNumber)) throw invalid("unitNumber");
  if (!(s.area > 0)) throw invalid("area");
  if (!validators.required(s.electroMeter)) throw invalid("electroMeter");
  if (s.propertyType === "other" && !validators.required(s.propertyCustom))
    throw invalid("propertyCustom");
  if (s.unitType === "other" && !validators.required(s.unitCustom))
    throw invalid("unitCustom");
  if (s.floor === "other" && !validators.required(s.floorCustom))
    throw invalid("floorCustom");
  if (!s.rooms) throw invalid("rooms");
  if (s.rooms === "other" && !(s.roomsCustom > 0)) throw invalid("roomsCustom");
  if (isCommercial && !s.activity) throw invalid("activity");
  if (isCommercial && s.hasLicense && !validators.required(s.licenseNumber))
    throw invalid("licenseNumber");
  if (
    !Array.isArray(s.extras) ||
    !s.extras.every((e) => e.kind && e.count >= 1)
  )
    throw invalid("extras");
  if (s.extras.some((e) => e.kind === "kitchen") && s.kitchenCabinets == null)
    throw invalid("kitchenCabinets");
}

export async function submitRentalRequest(
  contractType: ContractType,
  s: SerializedFormState,
): Promise<{ requestNo: string; fee: number }> {
  assertValidRentalRequest(contractType, s);
  const isCommercial = contractType === "commercial";
  const months =
    s.duration === "custom" ? s.customMonths : durationToMonths(s.duration);

  let settingsFees = null;
  try {
    const settings = (await client.fetch(
      SITE_SETTINGS_QUERY,
    )) as SITE_SETTINGS_QUERY_RESULT;
    settingsFees = settings?.fees ?? null;
  } catch {
    settingsFees = null;
  }
  const breakdown = calcFeeBreakdown({
    contractType,
    durationMonths: months,
    config: feeConfigFromSettings(settingsFees),
  });

  const requestNo = requestNumber();
  const { propList, unitList } = propValueLists(isCommercial);
  const ownerIban = s.ownerIban.trim().replace(/[\s-]/g, "").toUpperCase();
  await getWriteClient().create({
    _type: "rentalRequest",
    requestNo,
    contractType,
    status: "new",
    submittedAt: new Date().toISOString(),
    applicant: {
      role: storedArabic(OPTION_VALUES.role, s.role),
      isAgent: s.isAgent,
      agencyNumber: s.agencyNumber || undefined,
      phone: normalizePhone(s.applicantPhone),
      nationalId: s.applicantId,
      dob: toDateString(s.applicantDob),
      ownerIban: s.role === "owner" ? ownerIban : undefined,
    },
    counterparty: {
      counterType:
        counterTypeText(s.counterType) ?? (isCommercial ? undefined : "فرد"),
      nationalId: s.otherId || undefined,
      phone: s.otherPhone ? normalizePhone(s.otherPhone) : undefined,
      dob: toDateString(s.otherDob),
      ownerIban: s.role === "tenant" ? ownerIban : undefined,
      unifiedNumber:
        isCommercial && s.counterType === "entity"
          ? s.unifiedNumber || undefined
          : undefined,
      entityName:
        isCommercial && s.counterType === "entity"
          ? s.entityName || undefined
          : undefined,
      repId:
        isCommercial && s.counterType === "entity"
          ? s.repId || undefined
          : undefined,
      repPhone:
        isCommercial && s.counterType === "entity" && s.repPhone
          ? normalizePhone(s.repPhone)
          : undefined,
      repDob:
        isCommercial && s.counterType === "entity"
          ? toDateString(s.repDob)
          : undefined,
      authNumber:
        isCommercial && s.counterType === "entity"
          ? s.authNumber || undefined
          : undefined,
    },
    property: {
      deedNumber: s.deedNumber || undefined,
      deedDate: toDateString(s.deedDate),
      propertyType: storedArabic(propList, s.propertyType, s.propertyCustom),
      propertyCustom: s.propertyCustom || undefined,
      unitType: storedArabic(unitList, s.unitType, s.unitCustom),
      unitCustom: s.unitCustom || undefined,
      unitNumber: s.unitNumber || undefined,
      floor: storedArabic(OPTION_VALUES.floor, s.floor, s.floorCustom),
      floorCustom: s.floorCustom || undefined,
      area: s.area,
      rooms: s.rooms === "other" ? String(s.roomsCustom) : s.rooms || undefined,
      roomsCustom: s.rooms === "other" ? s.roomsCustom : undefined,
      extras: storedExtras(s.extras),
      kitchenCabinets: s.extras.some((e) => e.kind === "kitchen")
        ? (s.kitchenCabinets ?? undefined)
        : undefined,
      electroMeter: s.electroMeter || undefined,
      waterMeter: s.waterMeter || undefined,
      activity: s.activity || undefined,
      hasLicense: s.hasLicense,
      licenseNumber: s.licenseNumber || undefined,
    },
    location: {
      locationManual: s.locationManual,
      mapsLink: s.mapsLink || undefined,
      city: storedArabic(OPTION_VALUES.city, s.city),
      buildingNumber: s.buildingNumber || undefined,
      additionalNumber: s.additionalNumber || undefined,
      postalCode: s.postalCode || undefined,
    },
    terms: {
      duration:
        s.duration === "custom"
          ? "مخصص"
          : storedArabic(OPTION_VALUES.duration, s.duration),
      customMonths: s.customMonths,
      contractStart: toDateString(s.contractStart),
      payment: storedArabic(OPTION_VALUES.payment, s.payment),
      annualRent: s.annualRent,
      feeBreakdown: breakdown,
      notes: s.notes || undefined,
    },
  });

  await notifyAdminNewRequest(requestNo, s.applicantPhone, SITE_URL);

  return { requestNo, fee: breakdown.total };
}

async function notifyAdminNewRequest(
  requestNo: string,
  applicantPhone: string,
  siteUrl: string,
): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL is not set; skipping new-request email.");
      return;
    }
    const detail = await getRequestDetail(requestNo, applicantPhone);
    if (!detail) {
      console.error(`New-request email skipped: ${requestNo} not found.`);
      return;
    }
    const { sendNewRequestNotification } = await import("@/lib/email");
    await sendNewRequestNotification({ to: adminEmail, detail, siteUrl });
  } catch (err) {
    console.error("Admin new-request email failed:", err);
  }
}

export async function submitContactMessage(input: {
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<{ ok: true }> {
  const name = input.name.trim();
  const rawPhone = input.phone.trim();
  const email = input.email?.trim() || undefined;
  const message = input.message.trim();
  const contactErrors = validateContact({
    name,
    phone: rawPhone,
    email,
    message,
  });
  const firstError = Object.values(contactErrors)[0];
  if (firstError) {
    throw new Error(`validation: ${firstError}`);
  }
  const phone = rawPhone;
  const created = await getWriteClient().create({
    _type: "contactMessage",
    name,
    phone,
    email,
    message,
    status: "new",
    submittedAt: new Date().toISOString(),
  });

  await notifyAdminContactMessage({
    messageId: created._id,
    name,
    phone,
    email,
    message,
  });

  return { ok: true };
}

async function notifyAdminContactMessage(input: {
  messageId: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
}): Promise<void> {
  try {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    if (!adminEmail) {
      console.warn("ADMIN_EMAIL is not set; skipping contact email.");
      return;
    }
    const { sendContactNotification } = await import("@/lib/email");
    await sendContactNotification({
      to: adminEmail,
      messageId: input.messageId,
      name: input.name,
      phone: input.phone,
      email: input.email,
      message: input.message,
      siteUrl: SITE_URL,
    });
  } catch (err) {
    console.error("Admin contact email failed:", err);
  }
}

export async function getRequestDetail(
  requestNo: string,
  applicantPhone: string,
): Promise<RequestDetail> {
  const normalized = requestNo.trim().toUpperCase();
  if (!/^REQ-\d{4}-\d{6}$/.test(normalized)) {
    return null;
  }
  const phone = normalizePhone(applicantPhone);
  if (!phone) {
    return null;
  }
  try {
    const data = (await client.fetch(REQUEST_DETAIL_QUERY, {
      requestNo: normalized,
    })) as RequestDetail;
    if (!data?.requestNo) {
      return null;
    }
    const stored = normalizePhone(`${data.applicant?.phone ?? ""}`);
    if (!stored || stored !== phone) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function getRequestStatus(
  requestNo: string,
): Promise<RequestStatus> {
  const normalized = requestNo.trim().toUpperCase();
  if (!/^REQ-\d{4}-\d{6}$/.test(normalized)) {
    return null;
  }
  try {
    const data = (await client.fetch(REQUEST_STATUS_QUERY, {
      requestNo: normalized,
    })) as {
      requestNo?: string;
      contractType?: string;
      status?: string;
      submittedAt?: string;
      feeTotal?: number;
      annualRent?: number;
    } | null;
    if (!data?.requestNo) {
      return null;
    }
    return {
      requestNo: `${data.requestNo}`,
      contractType: `${data.contractType ?? ""}`,
      status: `${data.status ?? "new"}`,
      submittedAt: `${data.submittedAt ?? ""}`,
      feeTotal: typeof data.feeTotal === "number" ? data.feeTotal : null,
      annualRent: typeof data.annualRent === "number" ? data.annualRent : null,
    };
  } catch {
    return null;
  }
}
