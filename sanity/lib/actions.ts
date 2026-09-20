"use server";

import type { RequestDetail, RequestStatus, SerializedFormState } from "@/lib/request-form";
import {
  calcFeeBreakdown,
  durationToMonths,
  feeConfigFromSettings,
  type ContractType,
} from "@/lib/fees";
import { validators } from "@/lib/validation";
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
  return date ?? undefined;
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
  if (s.role === "owner" && s.isAgent && !validators.required(s.agencyNumber))
    throw invalid("agencyNumber");
  if (isCommercial && s.counterType === "entity") {
    if (!validators.unifiedNumber(s.unifiedNumber)) throw invalid("unifiedNumber");
    if (!validators.nationalOrIqama(s.repId)) throw invalid("repId");
    if (!validators.mobile(s.repPhone)) throw invalid("repPhone");
  } else {
    if (!isCommercial && s.role === "owner" && !validators.required(s.otherName))
      throw invalid("otherName");
    if (!validators.nationalOrIqama(s.otherId)) throw invalid("otherId");
    if (!validators.mobile(s.otherPhone)) throw invalid("otherPhone");
  }
  if (!validators.deedNumber(s.deedNumber)) throw invalid("deedNumber");
  if (!s.deedDate) throw invalid("deedDate");
  if (!validators.required(s.city)) throw invalid("city");
  if (s.postalCode.trim() !== "" && !validators.postal(s.postalCode))
    throw invalid("postalCode");
  if (!s.contractStart) throw invalid("contractStart");
  if (s.duration === "custom" && !(s.customMonths >= 1))
    throw invalid("customMonths");
  if (!(s.annualRent > 0) || !s.duration || !s.payment)
    throw invalid("terms");
  if (!s.propertyType || !s.unitType || !s.floor) throw invalid("property");
  if (!validators.required(s.unitNumber)) throw invalid("unitNumber");
  if (!(s.area > 0)) throw invalid("area");
  if (!isCommercial && !validators.required(s.electroMeter))
    throw invalid("electroMeter");
  if (s.propertyType === "other" && !validators.required(s.propertyCustom))
    throw invalid("propertyCustom");
  if (s.unitType === "other" && !validators.required(s.unitCustom))
    throw invalid("unitCustom");
  if (s.floor === "other" && !validators.required(s.floorCustom))
    throw invalid("floorCustom");
  if (!isCommercial) {
    if (!s.bedrooms || !s.bathrooms) throw invalid("rooms");
    if (s.bedrooms === "other" && !(s.bedroomsCustom > 0))
      throw invalid("bedroomsCustom");
    if (s.bathrooms === "other" && !(s.bathroomsCustom > 0))
      throw invalid("bathroomsCustom");
    if (s.extras.includes("sitting") && !(s.livingRooms > 0))
      throw invalid("livingRooms");
  }
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
      phone: s.applicantPhone,
      nationalId: s.applicantId,
    },
    counterparty: {
      counterType: counterTypeText(s.counterType) ?? undefined,
      fullName: s.otherName || undefined,
      nationalId: s.otherId || undefined,
      phone: s.otherPhone || undefined,
      dob: toDateString(s.otherDob),
      unifiedNumber: s.unifiedNumber || undefined,
      entityName: s.entityName || undefined,
      repId: s.repId || undefined,
      repPhone: s.repPhone || undefined,
      repDob: toDateString(s.repDob),
      authNumber: s.authNumber || undefined,
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
      bedrooms:
        s.bedrooms === "other" ? String(s.bedroomsCustom) : s.bedrooms || undefined,
      bedroomsCustom: s.bedroomsCustom,
      bathrooms:
        s.bathrooms === "other"
          ? String(s.bathroomsCustom)
          : s.bathrooms || undefined,
      bathroomsCustom: s.bathroomsCustom,
      extras: storedExtras(s.extras),
      livingRooms: s.livingRooms,
      electroMeter: s.electroMeter || undefined,
      waterMeter: s.waterMeter || undefined,
      activity: s.activity || undefined,
      hasLicense: s.hasLicense,
      licenseNumber: s.licenseNumber || undefined,
    },
    location: {
      mapsLink: s.mapsLink || undefined,
      city: storedArabic(OPTION_VALUES.city, s.city),
      buildingNumber: s.buildingNumber || undefined,
      additionalNumber: s.additionalNumber || undefined,
      postalCode: s.postalCode || undefined,
    },
    terms: {
      duration: s.duration === "custom" ? "مخصص" : storedArabic(OPTION_VALUES.duration, s.duration),
      customMonths: s.customMonths,
      contractStart: toDateString(s.contractStart),
      payment: storedArabic(OPTION_VALUES.payment, s.payment),
      annualRent: s.annualRent,
      feePayer: storedArabic(OPTION_VALUES.feePayer, s.feePayer),
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
  const phone = input.phone.trim();
  const email = input.email?.trim() || undefined;
  const message = input.message.trim();
  if (!name || !phone || !message) {
    throw new Error("Missing required fields");
  }
  if (email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
    throw new Error("Invalid email address");
  }
  await getWriteClient().create({
    _type: "contactMessage",
    name,
    phone,
    email,
    message,
    status: "new",
    submittedAt: new Date().toISOString(),
  });
  return { ok: true };
}

export async function getRequestDetail(
  requestNo: string,
  applicantPhone: string,
): Promise<RequestDetail> {
  const normalized = requestNo.trim().toUpperCase();
  if (!/^REQ-\d{4}-\d{6}$/.test(normalized)) {
    return null;
  }
  const phone = applicantPhone.replace(/[\s-]/g, "");
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
    const stored = `${data.applicant?.phone ?? ""}`.replace(/[\s-]/g, "");
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
      feePayer?: string;
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
      feePayer: `${data.feePayer ?? ""}`,
    };
  } catch {
    return null;
  }
}
