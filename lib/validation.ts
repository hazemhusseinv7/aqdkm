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
};

export const helpers = {
  nationalOrIqama: "10 أرقام بدون مسافات",
  mobile: "جوال سعودي يبدأ بـ 05",
  unified: "كما هو مسجل في السجل التجاري",
  deedDate: "يرجى إدخال التاريخ كما هو مدون في الصك",
};
