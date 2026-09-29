/**
 * Single source of truth for rental-request field names.
 * Arabic strings are verbatim website-form wording; English strings match
 * the Studio titles. Consumed by the schema (bilingual titles), the track
 * detail view, and the admin notification email - add a field here once and
 * all three surfaces stay in sync. Dependency-free so the Studio bundle can
 * import it.
 */
export type FieldLabel = { en: string; ar: string };

export const FIELD_LABELS = {
  requestNo: { en: "Request number", ar: "رقم الطلب" },
  contractType: { en: "Contract type", ar: "نوع العقد" },
  status: { en: "Status", ar: "حالة الطلب" },
  submittedAt: { en: "Submitted at", ar: "تاريخ التقديم" },
  applicantRole: { en: "Role", ar: "صفة مقدم الطلب" },
  applicantIsAgent: { en: "Applying as agent", ar: "هل أنت وكيل عن المالك؟" },
  applicantAgencyNumber: { en: "Agency number", ar: "رقم الوكالة" },
  applicantPhone: { en: "Phone", ar: "جوال مقدم الطلب" },
  applicantNationalId: {
    en: "National ID / Iqama",
    ar: "رقم الهوية / الإقامة لمقدم الطلب",
  },
  applicantDob: { en: "Date of birth", ar: "تاريخ ميلاد مقدم الطلب" },
  counterpartyType: { en: "Party type", ar: "نوع الطرف الآخر" },
  counterpartyNationalId: {
    en: "National ID / Iqama",
    ar: "رقم الهوية / الإقامة للطرف الآخر",
  },
  counterpartyPhone: { en: "Phone", ar: "جوال الطرف الآخر" },
  counterpartyDob: { en: "Date of birth", ar: "تاريخ ميلاد الطرف الآخر" },
  counterpartyUnifiedNumber: {
    en: "Unified number (700…)",
    ar: "الرقم الموحد للمنشأة",
  },
  counterpartyEntityName: { en: "Entity name", ar: "اسم المنشأة" },
  counterpartyRepId: { en: "Representative ID", ar: "هوية المفوّض بالتوقيع" },
  counterpartyRepPhone: {
    en: "Representative phone",
    ar: "جوال المفوّض بالتوقيع",
  },
  counterpartyRepDob: {
    en: "Representative date of birth",
    ar: "تاريخ ميلاد المفوّض بالتوقيع",
  },
  counterpartyAuthNumber: {
    en: "Authorization number",
    ar: "رقم التفويض أو الوكالة",
  },
  propertyDeedNumber: { en: "Deed number", ar: "رقم الصك" },
  propertyDeedDate: { en: "Deed date", ar: "تاريخ الصك" },
  propertyType: { en: "Property type", ar: "نوع العقار" },
  propertyTypeCustom: {
    en: "Property type (custom)",
    ar: "يرجى تحديد نوع العقار",
  },
  unitType: { en: "Unit type", ar: "نوع الوحدة" },
  unitTypeCustom: { en: "Unit type (custom)", ar: "يرجى تحديد نوع الوحدة" },
  unitNumber: { en: "Unit number", ar: "رقم الوحدة" },
  floor: { en: "Floor", ar: "الدور" },
  floorCustom: { en: "Floor (custom)", ar: "يرجى تحديد رقم الدور" },
  area: { en: "Area (sqm)", ar: "المساحة" },
  rooms: { en: "Rooms", ar: "الغرف" },
  roomsCustom: { en: "Rooms (custom)", ar: "عدد الغرف" },
  extras: { en: "Extras", ar: "المرافق المتوفرة" },
  kitchenCabinets: { en: "Kitchen cabinets installed", ar: "تركيب خزائن المطبخ" },
  electroMeter: { en: "Electricity meter", ar: "رقم عداد الكهرباء" },
  waterMeter: { en: "Water meter", ar: "رقم عداد المياه" },
  activity: { en: "Commercial activity", ar: "النشاط التجاري" },
  hasLicense: { en: "Has municipal license", ar: "الرخصة البلدية" },
  licenseNumber: { en: "License number", ar: "رقم الرخصة" },
  mapsLink: { en: "Maps link", ar: "رابط موقع العقار" },
  locationManual: { en: "Manual address entry", ar: "إدخال العنوان يدوياً" },
  city: { en: "City", ar: "المدينة" },
  buildingNumber: { en: "Building number", ar: "رقم المبنى" },
  additionalNumber: { en: "Additional number", ar: "الرقم الإضافي" },
  postalCode: { en: "Postal code", ar: "الرمز البريدي" },
  duration: { en: "Duration option", ar: "مدة العقد" },
  customMonths: { en: "Custom months", ar: "المدة المخصصة" },
  contractStart: { en: "Contract start", ar: "تاريخ بداية العقد" },
  payment: { en: "Payment schedule", ar: "طريقة الدفع" },
  annualRent: { en: "Annual rent", ar: "الإيجار السنوي" },
  ownerIban: { en: "Landlord IBAN", ar: "IBAN المؤجر" },
  feeYears: { en: "Billed years", ar: "سنوات الاحتساب" },
  feeGovernment: { en: "Government fee", ar: "الرسوم الحكومية" },
  feeCompany: { en: "Company fee", ar: "رسوم الشركة" },
  feeTotal: { en: "Total fee", ar: "إجمالي رسوم التوثيق التقديرية" },
  notes: { en: "Notes", ar: "ملاحظات إضافية" },
} as const satisfies Record<string, FieldLabel>;

export type RequestFieldKey = keyof typeof FIELD_LABELS;

/** Bilingual Studio title: "Deed number / رقم الصك". */
export function bilingualTitle(key: RequestFieldKey): string {
  const l = FIELD_LABELS[key];
  return `${l.en} / ${l.ar}`;
}

/** Arabic request-status labels, shared by tracking and admin surfaces. */
export const REQUEST_STATUS_AR: Record<string, string> = {
  new: "جديد",
  reviewing: "قيد المراجعة",
  approved: "معتمد",
  completed: "مكتمل",
  cancelled: "ملغي",
};

export type OptionPair = { value: string; label: string };

/** Code→Arabic option data. Icon-free so server actions, emails, and the
 * Studio bundle can import it. `lib/options.tsx` attaches the icons. */
export const OPTION_VALUES = {
  role: [
    { value: "owner", label: "أنا المالك أو ممثله" },
    { value: "tenant", label: "أنا المستأجر" },
  ],
  duration: [
    { value: "3m", label: "3 أشهر" },
    { value: "6m", label: "6 أشهر" },
    { value: "1y", label: "سنة" },
    { value: "2y", label: "سنتان" },
    { value: "3y", label: "3 سنوات" },
    { value: "4y", label: "4 سنوات" },
    { value: "5y", label: "5 سنوات" },
    { value: "6y", label: "6 سنوات" },
    { value: "7y", label: "7 سنوات" },
    { value: "8y", label: "8 سنوات" },
    { value: "9y", label: "9 سنوات" },
    { value: "10y", label: "10 سنوات" },
    { value: "custom", label: "مخصص" },
  ],
  payment: [
    { value: "monthly", label: "شهري" },
    { value: "quarterly", label: "كل 3 أشهر" },
    { value: "semi", label: "كل 6 أشهر" },
    { value: "yearly", label: "سنوي" },
  ],
  residentialProperty: [
    { value: "building", label: "عمارة" },
    { value: "villa", label: "فيلا" },
    { value: "compound", label: "مجمع" },
    { value: "tower", label: "برج" },
    { value: "duplex", label: "دوبلكس" },
    { value: "other", label: "أخرى" },
  ],
  residentialUnit: [
    { value: "apartment", label: "شقة" },
    { value: "floor", label: "دور" },
    { value: "driver-room", label: "غرفة سائق" },
    { value: "studio", label: "استوديو" },
    { value: "villa", label: "فيلا" },
    { value: "annex", label: "ملحق" },
    { value: "other", label: "أخرى" },
  ],
  commercialProperty: [
    { value: "building", label: "عمارة" },
    { value: "villa", label: "فيلا" },
    { value: "compound", label: "مجمع" },
    { value: "tower", label: "برج" },
    { value: "land", label: "أرض" },
    { value: "other", label: "أخرى" },
  ],
  commercialUnit: [
    { value: "shop", label: "محل" },
    { value: "office", label: "مكتب" },
    { value: "warehouse", label: "مستودع" },
    { value: "showroom", label: "معرض" },
    { value: "land", label: "أرض" },
    { value: "kiosk", label: "كشك" },
    { value: "workshop", label: "ورشة" },
    { value: "factory", label: "مصنع" },
    { value: "other", label: "أخرى" },
  ],
  commercialActivity: [
    { value: "retail", label: "تجزئة" },
    { value: "restaurant", label: "مطعم" },
    { value: "office", label: "مكتب مهني" },
    { value: "storage", label: "تخزين" },
    { value: "industrial", label: "صناعي" },
    { value: "other", label: "أخرى" },
  ],
  floor: [
    { value: "ground", label: "أرضي" },
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "other", label: "أخرى" },
  ],
  city: [
    { value: "riyadh", label: "الرياض" },
    { value: "makkah", label: "مكة المكرمة" },
    { value: "madinah", label: "المدينة المنورة" },
    { value: "qassim", label: "بريدة - القصيم" },
    { value: "eastern", label: "الدمام - الشرقية" },
    { value: "asir", label: "أبها - عسير" },
    { value: "tabuk", label: "تبوك" },
    { value: "hail", label: "حائل" },
    { value: "northern", label: "عرعر - الحدود الشمالية" },
    { value: "jazan", label: "جازان" },
    { value: "najran", label: "نجران" },
    { value: "baha", label: "الباحة" },
    { value: "jouf", label: "سكاكا - الجوف" },
  ],
} as const satisfies Record<string, OptionPair[]>;

export function propValueLists(isCommercial: boolean) {
  return {
    propList: isCommercial
      ? OPTION_VALUES.commercialProperty
      : OPTION_VALUES.residentialProperty,
    unitList: isCommercial
      ? OPTION_VALUES.commercialUnit
      : OPTION_VALUES.residentialUnit,
  };
}

export const EXTRA_LABELS: Record<string, string> = {
  kitchen: "يوجد مطبخ",
  majlis: "يوجد مجلس",
  split_ac: "مكيفات سبليت",
  window_ac: "مكيفات شباك",
  extra_room: "غرفة إضافية",
  storage: "غرفة مخزن",
  sitting: "يوجد صالة",
  bathrooms: "الحمامات",
};

/** Codes become stored Arabic: label for known codes, custom text for "other". */
export function storedArabic(
  list: readonly OptionPair[],
  value: string | undefined,
  custom?: string | null,
): string | undefined {
  if (!value) return undefined;
  if (value === "other") return custom?.trim() ? custom : "أخرى";
  return list.find((o) => o.value === value)?.label ?? value;
}

export function storedExtras(
  extras: { kind: string; count: number }[],
): { kind: string; count: number }[] {
  return extras.map((e) => ({ kind: EXTRA_LABELS[e.kind] ?? e.kind, count: e.count }));
}

export function counterTypeText(value?: string | null): string | null {
  if (!value) return null;
  if (value === "entity" || value === "منشأة") return "منشأة";
  if (value === "individual" || value === "فرد") return "فرد";
  return value;
}
