export const validators = {
  nationalOrIqama: (v: string) => /^[12]\d{9}$/.test(v.trim()),
  mobile: (v: string) => /^05\d{8}$/.test(v.trim().replace(/[\s-]/g, "")),
  unifiedNumber: (v: string) => /^70\d{8}$/.test(v.trim()),
  required: (v: string) => v.trim().length > 0,
  deedNumber: (v: string) => v.trim().length >= 4,
  postal: (v: string) => /^\d{5}$/.test(v.trim()),
};

export const messages = {
  nationalOrIqama: "يرجى إدخال رقم هوية أو إقامة صحيح مكون من 10 أرقام",
  mobile: "يرجى إدخال رقم جوال سعودي صحيح مكون من 10 أرقام يبدأ بـ 05",
  unified: "يرجى إدخال الرقم الموحد للمنشأة مكوناً من 10 أرقام يبدأ بـ 70",
  required: "هذا الحقل مطلوب",
  postal: "يرجى إدخال رمز بريدي صحيح مكون من 5 أرقام",
  adult: "يجب أن يكون عمر المستأجر 18 سنة على الأقل",
  pastStart: "لا يمكن أن يكون تاريخ بداية العقد في الماضي",
};

export const helpers = {
  nationalOrIqama: "10 أرقام بدون مسافات",
  mobile: "رقم جوال يبدأ بـ 05",
  unified: "كما هو مسجل في السجل التجاري",
  deedDate: "يرجى إدخال التاريخ كما هو مدون في الصك",
};

export function normalizePhone(v: string): string {
  const digits = v.trim().replace(/[\s-]/g, "");
  return digits.startsWith("0") ? digits.slice(1) : digits;
}

export function isAdultISO(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return false;
  const cutoff = new Date();
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 18);
  const dob = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return dob.getTime() <= cutoff.getTime();
}

export function isPastDayISO(iso: string | null | undefined): boolean {
  if (!iso) return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
  if (!m) return false;
  const day = Date.UTC(+m[1], +m[2] - 1, +m[3]);
  const now = new Date();
  const todayStart = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return day < todayStart;
}
