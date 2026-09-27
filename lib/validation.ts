/** ISO 13616 mod-97 checksum for international bank account numbers. */
function ibanMod97Ok(clean: string): boolean {
  const rearranged = clean.slice(4) + clean.slice(0, 4);
  let remainder = 0;
  for (const ch of rearranged) {
    const code = ch >= "A" && ch <= "Z" ? ch.charCodeAt(0) - 55 : ch;
    for (const d of String(code)) {
      remainder = (remainder * 10 + Number(d)) % 97;
    }
  }
  return remainder === 1;
}

export const validators = {
  nationalOrIqama: (v: string) => /^[12]\d{9}$/.test(v.trim()),
  mobile: (v: string) => /^05\d{8}$/.test(v.trim().replace(/[\s-]/g, "")),
  unifiedNumber: (v: string) => /^70\d{8}$/.test(v.trim()),
  required: (v: string) => v.trim().length > 0,
  deedNumber: (v: string) => v.trim().length >= 4,
  postal: (v: string) => /^\d{5}$/.test(v.trim()),
  iban: (v: unknown) => {
    if (typeof v !== "string") return false;
    const clean = v.trim().replace(/[\s-]/g, "").toUpperCase();
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]{11,30}$/.test(clean)) return false;
    return ibanMod97Ok(clean);
  },
};

export const messages = {
  nationalOrIqama: "يرجى إدخال رقم هوية أو إقامة صحيح مكون من 10 أرقام",
  mobile: "يرجى إدخال رقم جوال صحيح مكون من 10 أرقام يبدأ بـ 05",
  unified: "يرجى إدخال الرقم الموحد للمنشأة مكوناً من 10 أرقام يبدأ بـ 70",
  required: "هذا الحقل مطلوب",
  postal: "يرجى إدخال رمز بريدي صحيح مكون من 5 أرقام",
  iban: "يرجى إدخال رقم آيبان دولي صحيح",
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

export type ContactInput = {
  name: string;
  phone: string;
  email?: string;
  message: string;
};

export type ContactErrors = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
};

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/** Loose contact-form phone rule: 9–12 digits after stripping non-digits. */
export function contactPhoneOk(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 12;
}

/**
 * Shared contact-form validator - single source of truth for the client
 * submit gate and the server action. Returns a field-keyed error map
 * (empty = valid).
 */
export function validateContact(input: ContactInput): ContactErrors {
  const errors: ContactErrors = {};
  const name = input.name.trim();
  const phone = input.phone.trim();
  const email = (input.email ?? "").trim();
  const message = input.message.trim();
  if (!name) {
    errors.name = messages.required;
  } else if (name.length < 2) {
    errors.name = "يرجى إدخال الاسم كاملاً (حرفان على الأقل)";
  }
  if (!phone) {
    errors.phone = messages.required;
  } else if (!contactPhoneOk(phone)) {
    errors.phone = "يرجى إدخال رقم جوال صحيح";
  }
  if (email && !EMAIL_RE.test(email)) {
    errors.email = "يرجى إدخال بريد إلكتروني صحيح";
  }
  if (!message) {
    errors.message = messages.required;
  } else if (message.length < 10) {
    errors.message = "يرجى كتابة رسالة لا تقل عن 10 أحرف";
  }
  return errors;
}
