import type { CalendarDate } from "@internationalized/date";

export type Role = "owner" | "tenant";

export type ExtraItem = { kind: string; count: number };

type DateFields = "otherDob" | "repDob" | "deedDate" | "contractStart" | "applicantDob";

export type SerializedFormState = Omit<FormState, DateFields> & {
  otherDob: string | null;
  repDob: string | null;
  deedDate: string | null;
  contractStart: string | null;
  applicantDob: string | null;
};

export type FormState = {
  role: Role | "";
  isAgent: boolean;
  agencyNumber: string;
  applicantPhone: string;
  applicantId: string;
  applicantDob: CalendarDate | null;
  otherName: string;
  otherId: string;
  otherPhone: string;
  otherDob: CalendarDate | null;
  counterType: "individual" | "entity" | "";
  unifiedNumber: string;
  entityName: string;
  repId: string;
  repPhone: string;
  repDob: CalendarDate | null;
  authNumber: string;
  deedNumber: string;
  deedDate: CalendarDate | null;
  locationManual: boolean | null;
  mapsLink: string;
  city: string;
  buildingNumber: string;
  additionalNumber: string;
  postalCode: string;
  duration: string;
  customMonths: number;
  customUnit: "months" | "years";
  contractStart: CalendarDate | null;
  payment: string;
  annualRent: number;
  ownerIban: string;
  propertyType: string;
  propertyCustom: string;
  unitType: string;
  unitCustom: string;
  unitNumber: string;
  floor: string;
  floorCustom: string;
  area: number;
  rooms: string;
  roomsCustom: number;
  extras: ExtraItem[];
  kitchenCabinets: boolean | null;
  electroMeter: string;
  waterMeter: string;
  activity: string;
  hasLicense: boolean;
  licenseNumber: string;
  notes: string;
  agree: boolean;
};

export type RequestDetail = {
  requestNo: string;
  contractType: string;
  status: string;
  submittedAt: string;
  applicant: {
    role?: string;
    isAgent?: boolean;
    agencyNumber?: string;
    phone?: string;
    nationalId?: string;
    dob?: string;
    ownerIban?: string;
  };
  counterparty?: {
    counterType?: string;
    nationalId?: string;
    phone?: string;
    dob?: string;
    ownerIban?: string;
    unifiedNumber?: string;
    entityName?: string;
    repId?: string;
    repPhone?: string;
    repDob?: string;
    authNumber?: string;
  };
  property?: {
    deedNumber?: string;
    deedDate?: string;
    propertyType?: string;
    propertyCustom?: string;
    unitType?: string;
    unitCustom?: string;
    unitNumber?: string;
    floor?: string;
    floorCustom?: string;
    area?: number;
    rooms?: string;
    roomsCustom?: number;
    extras?: { kind?: string; count?: number }[];
    kitchenCabinets?: boolean | null;
    electroMeter?: string;
    waterMeter?: string;
    activity?: string;
    hasLicense?: boolean;
    licenseNumber?: string;
  };
  location?: {
    locationManual?: boolean | null;
    mapsLink?: string;
    city?: string;
    buildingNumber?: string;
    additionalNumber?: string;
    postalCode?: string;
  };
  terms?: {
    duration?: string;
    customMonths?: number;
    contractStart?: string;
    payment?: string;
    annualRent?: number;
    feeBreakdown?: {
      years?: number;
      government?: number;
      company?: number;
      total?: number;
    };
    notes?: string;
  };
} | null;

export type RequestStatus = {
  requestNo: string;
  contractType: string;
  status: string;
  submittedAt: string;
  feeTotal: number | null;
  annualRent: number | null;
} | null;
