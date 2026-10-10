"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getLocalTimeZone, today } from "@internationalized/date";
import { reviveCalendarDate, toGregorianISO, formatDual } from "@/lib/calendar";
import {
  Card,
  Button,
  ButtonGroup,
  Chip,
  Alert,
  Toolbar,
  Spinner,
  Disclosure,
  TextField,
  TextArea,
  Label,
  ToggleButtonGroup,
  ToggleButton,
  AlertDialog,
  Modal,
  Form,
  Separator,
  Typography,
  Tooltip,
  toast,
} from "@heroui/react";
import {
  MdHome,
  MdPhone,
  MdBadge,
  MdCake,
  MdGavel,
  MdLocationOn,
  MdDateRange,
  MdTimelapse,
  MdPayments,
  MdAccountBalanceWallet,
  MdLayers,
  MdSquareFoot,
  MdCheckCircle,
  MdClose,
  MdArrowForward,
  MdArrowBack,
  MdNumbers,
  MdKitchen,
  MdWeekend,
  MdLightbulb,
  MdWaterDrop,
  MdReceiptLong,
} from "react-icons/md";
import { TbAirConditioning } from "react-icons/tb";
import { HiHomeModern } from "react-icons/hi2";
import { FaUsers, FaBuilding, FaFileContract, FaHome } from "react-icons/fa";
import { BsCalendar2WeekFill } from "react-icons/bs";
import { FaDoorOpen } from "react-icons/fa6";
import { BiSolidCoinStack } from "react-icons/bi";
import { PiFanFill, PiBathtubFill, PiWarehouseFill } from "react-icons/pi";
import { FormStepper, STEP_TITLES } from "./form-stepper";
import { SmartFormSkeleton } from "./smart-form-skeleton";
import { SectionCard } from "./section-card";
import { Price } from "@/components/price";
import {
  IconText,
  IconSelect,
  IconNumber,
  IconDate,
  IconSwitch,
  CountedChecks,
  DurationSlider,
} from "./fields";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldMessage } from "@/components/ui/field-message";
import { validators, messages, helpers, isAdultISO } from "@/lib/validation";
import { extrasText } from "@/lib/request-display";
import { copy } from "@/lib/copy";
import {
  calcFee,
  durationToMonths,
  formatCurrency,
  isTotalRentCase,
  DEFAULT_FEE_CONFIG,
  type ContractType,
  type FeeConfig,
} from "@/lib/fees";
import { SaudiRiyal } from "lucide-react";
import { submitRentalRequest } from "@/sanity/lib/actions";
import {
  roleOptions,
  durationOptions,
  paymentOptions,
  residentialPropertyTypes,
  residentialUnitTypes,
  commercialPropertyTypes,
  commercialUnitTypes,
  floorOptions,
  countOptions,
  cityOptions,
} from "@/lib/options";
import { COMMERCIAL_EXTRA_KINDS } from "@/lib/request-fields";
import type { FormState, Role, SerializedFormState } from "@/lib/request-form";

/** Normalize stored extras: legacy string[] drafts become count-1 entries. */
function reviveExtras(raw: unknown): { kind: string; count: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((e) => {
    if (typeof e === "string") return [{ kind: e, count: 1 }];
    if (e && typeof e === "object") {
      const kind = (e as { kind?: unknown }).kind;
      const count = (e as { count?: unknown }).count;
      if (typeof kind === "string") {
        return [
          {
            kind,
            count:
              typeof count === "number" && count > 0 ? Math.floor(count) : 0,
          },
        ];
      }
    }
    return [];
  });
}

const initial: FormState = {
  role: "",
  isAgent: false,
  agencyNumber: "",
  applicantPhone: "",
  applicantId: "",
  applicantDob: null,
  otherId: "",
  otherPhone: "",
  otherDob: null,
  counterType: "individual",
  unifiedNumber: "",
  repId: "",
  repPhone: "",
  repDob: null,
  authNumber: "",
  deedNumber: "",
  deedDate: null,
  locationManual: null,
  mapsLink: "",
  city: "",
  buildingNumber: "",
  additionalNumber: "",
  postalCode: "",
  duration: "",
  customMonths: 0,
  customUnit: "months",
  contractStart: null,
  payment: "",
  annualRent: 0,
  totalRent: 0,
  ownerIban: "",
  propertyType: "",
  propertyCustom: "",
  unitType: "",
  unitCustom: "",
  unitNumber: "",
  floor: "",
  floorCustom: "",
  area: 0,
  rooms: "",
  roomsCustom: 0,
  extras: [],
  kitchenCabinets: null,
  electroMeter: "",
  waterMeter: "",
  notes: "",
};

export function SmartForm({
  contractType,
  feeConfig = DEFAULT_FEE_CONFIG,
}: {
  contractType: ContractType;
  feeConfig?: FeeConfig;
}) {
  const isCommercial = contractType === "commercial";
  const router = useRouter();
  // Residential has no counterparty-type toggle: the counterparty is
  // always an individual. Commercial defaults to entity (toggle first).
  const [s, setS] = useState<FormState>({
    ...initial,
    counterType: isCommercial ? "entity" : "individual",
  });
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const skipSave = useRef(false);
  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setS((p) => ({ ...p, [k]: v }));
  const applyRole = (role: Role) =>
    setS((p) => ({
      ...p,
      role,
      ...(role === "tenant" ? { isAgent: false, agencyNumber: "" } : {}),
    }));

  const draftKey = `aqdkm-draft-${contractType}`;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FormState>;
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only draft restore after mount (avoids SSR hydration mismatch)
        setS({
          ...initial,
          ...parsed,
          counterType: isCommercial
            ? parsed.counterType || "entity"
            : "individual",
          ...(parsed.role === "tenant"
            ? { isAgent: false, agencyNumber: "" }
            : {}),
          ...(parsed.propertyType !== "other" ? { propertyCustom: "" } : {}),
          ...(parsed.unitType !== "other" ? { unitCustom: "" } : {}),
          ...(parsed.floor !== "other" ? { floorCustom: "" } : {}),
          ...(parsed.locationManual === true ? { mapsLink: "" } : {}),
          ...(parsed.locationManual === false ? { city: "" } : {}),
          ...(parsed.duration !== "custom" ? { customMonths: 0 } : {}),
          ...(isCommercial && parsed.counterType === "entity"
            ? { otherId: "", otherPhone: "", otherDob: null }
            : {}),
          extras: reviveExtras(parsed.extras).filter(
            (e) => !isCommercial || COMMERCIAL_EXTRA_KINDS.includes(e.kind),
          ),
          // Commercial never offers kitchen: drop any revived answer with it.
          ...(isCommercial ? { kitchenCabinets: null } : {}),
          ...(isTotalRentCase(
            parsed.payment ?? "",
            parsed.duration ?? "",
            parsed.customMonths ?? 0,
          )
            ? { annualRent: 0 }
            : { totalRent: 0 }),
          deedDate: reviveCalendarDate(parsed.deedDate),
          applicantDob: reviveCalendarDate(parsed.applicantDob),
          otherDob: reviveCalendarDate(parsed.otherDob),
          repDob: reviveCalendarDate(parsed.repDob),
          contractStart:
            reviveCalendarDate(parsed.contractStart) ??
            today(getLocalTimeZone()),
        });
        setDraftRestored(true);
      } else {
        setS((p) => ({ ...p, contractStart: today(getLocalTimeZone()) }));
      }
    } catch {}
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        if (skipSave.current) {
          skipSave.current = false;
          localStorage.removeItem(draftKey);
        } else {
          localStorage.setItem(draftKey, JSON.stringify(s));
        }
      } catch {
        /* ignore */
      }
    }
  }, [s, loading, draftKey]);

  const months =
    s.duration === "custom" ? s.customMonths : durationToMonths(s.duration);
  const fee = useMemo(
    () =>
      calcFee({
        contractType,
        durationMonths: months,
        config: feeConfig,
      }),
    [contractType, months, feeConfig],
  );
  const durationLabel =
    durationOptions.find((d) => d.value === s.duration)?.label ?? s.duration;
  const paymentLabel =
    paymentOptions.find((d) => d.value === s.payment)?.label ?? s.payment;
  const dateLabel = (d: typeof s.deedDate) => {
    if (!d) return "-";
    return formatDual(toGregorianISO(d) ?? "") ?? "-";
  };
  const propList = isCommercial
    ? commercialPropertyTypes
    : residentialPropertyTypes;
  const unitList = isCommercial ? commercialUnitTypes : residentialUnitTypes;
  const propLabel =
    s.propertyType === "other"
      ? s.propertyCustom || "أخرى"
      : (propList.find((d) => d.value === s.propertyType)?.label ??
        s.propertyType);
  const unitLabel =
    s.unitType === "other"
      ? s.unitCustom || "أخرى"
      : (unitList.find((d) => d.value === s.unitType)?.label ?? s.unitType);
  const floorLabel =
    s.floor === "other"
      ? s.floorCustom || "أخرى"
      : (floorOptions.find((d) => d.value === s.floor)?.label ?? s.floor);
  const roomsLabel = s.rooms === "other" ? String(s.roomsCustom) : s.rooms;
  const totalCase = isTotalRentCase(s.payment, s.duration, s.customMonths);
  const isCommercialTenant = isCommercial && s.role === "tenant";

  const err = (cond: boolean, msg: string) => (touched && cond ? msg : null);

  const stepValid = (target: number = step): boolean => {
    switch (target) {
      case 0:
        return s.role !== "";
      case 1:
        if (!validators.mobile(s.applicantPhone)) return false;
        if (!validators.nationalOrIqama(s.applicantId)) return false;
        if (!validators.iban(s.ownerIban)) return false;
        if (
          s.role === "tenant" &&
          !isCommercialTenant &&
          !isAdultISO(toGregorianISO(s.applicantDob))
        )
          return false;
        if (
          (s.role === "owner" || isCommercialTenant) &&
          s.counterType !== "entity" &&
          !isAdultISO(toGregorianISO(s.otherDob))
        )
          return false;
        if (
          s.role === "owner" &&
          s.isAgent &&
          !validators.required(s.agencyNumber)
        )
          return false;
        if (isCommercial && s.counterType === "") return false;
        if (isCommercial && s.counterType === "entity") {
          return (
            validators.unifiedNumber(s.unifiedNumber) &&
            validators.nationalOrIqama(s.repId) &&
            validators.mobile(s.repPhone)
          );
        }
        return (
          validators.nationalOrIqama(s.otherId) &&
          validators.mobile(s.otherPhone)
        );
      case 2:
        return (
          validators.deedNumber(s.deedNumber) &&
          !!s.deedDate &&
          s.locationManual !== null &&
          (s.locationManual
            ? validators.required(s.city)
            : validators.required(s.mapsLink)) &&
          (s.postalCode.trim() === "" || validators.postal(s.postalCode))
        );
      case 3:
        if (!s.contractStart) return false;
        if (s.duration === "custom" && !(s.customMonths >= 1)) return false;
        if (totalCase ? !(s.totalRent > 0) : !(s.annualRent > 0)) return false;
        return !!s.duration && !!s.payment;
      case 4:
        if (!s.propertyType || !s.unitType || !s.floor) return false;
        if (!validators.required(s.unitNumber)) return false;
        if (!(s.area > 0)) return false;
        if (!validators.required(s.electroMeter)) return false;
        if (
          s.propertyType === "other" &&
          !validators.required(s.propertyCustom)
        )
          return false;
        if (s.unitType === "other" && !validators.required(s.unitCustom))
          return false;
        if (s.floor === "other" && !validators.required(s.floorCustom))
          return false;
        if (!s.extras.every((e) => e.kind && e.count >= 1)) return false;
        // Commercial offers AC kinds only.
        if (
          isCommercial &&
          s.extras.some((e) => !COMMERCIAL_EXTRA_KINDS.includes(e.kind))
        )
          return false;
        if (
          s.extras.some((e) => e.kind === "kitchen") &&
          s.kitchenCabinets == null
        )
          return false;
        if (!isCommercial && !s.rooms) return false;
        if (!isCommercial && s.rooms === "other" && !(s.roomsCustom > 0))
          return false;
        return true;
      default:
        return true;
    }
  };

  const validateAll = (): number => {
    for (let i = 0; i <= 4; i++) {
      if (!stepValid(i)) return i;
    }
    return -1;
  };

  const verifiedBefore = (target: number): boolean => {
    for (let i = 0; i < target; i++) {
      if (!stepValid(i)) return false;
    }
    return true;
  };

  const next = () => {
    setTouched(true);
    if (!stepValid()) {
      toast("يرجى مراجعة الحقول المطلوبة", {
        description: "بعض الحقول غير مكتملة أو بصيغة غير صحيحة",
      });
      return;
    }
    setTouched(false);
    setStep((p) => Math.min(5, p + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const prev = () => {
    setTouched(false);
    setStep((p) => Math.max(0, p - 1));
  };

  const submitRequest = async () => {
    setSubmitting(true);
    try {
      const payload: SerializedFormState = {
        ...s,
        annualRent: totalCase ? 0 : s.annualRent,
        totalRent: totalCase ? s.totalRent : 0,
        applicantDob: toGregorianISO(s.applicantDob),
        otherDob: toGregorianISO(s.otherDob),
        repDob: toGregorianISO(s.repDob),
        deedDate: toGregorianISO(s.deedDate),
        contractStart: toGregorianISO(s.contractStart),
      };
      const { requestNo: no, fee: total } = await submitRentalRequest(
        contractType,
        payload,
      );
      setSubmitting(false);
      setConfirmOpen(false);
      try {
        localStorage.removeItem(draftKey);
      } catch {
        /* ignore */
      }
      toast("تم استلام الطلب بنجاح", {
        description: `رقم الطلب ${no} - رسوم التوثيق التقديرية ${formatCurrency(total)}`,
      });
      router.push(
        `/request/success?no=${encodeURIComponent(no)}&type=${contractType}`,
      );
    } catch (err) {
      setSubmitting(false);
      const message = err instanceof Error ? err.message : "";
      if (message.startsWith("Invalid rental request: ")) {
        toast("تعذر إرسال الطلب", {
          description: "يرجى مراجعة الحقول المطلوبة - تم الاحتفاظ بالمسودة",
        });
      } else {
        toast("تعذر إرسال الطلب", {
          description: "تحقق من الاتصال وحاول مجدداً - تم الاحتفاظ بالمسودة",
        });
      }
    }
  };

  const applicantCard = (
    <SectionCard
      icon={<MdBadge />}
      title={isCommercialTenant ? "بيانات الطرف الآخر" : "بيانات مقدم الطلب"}
      description={
        isCommercialTenant
          ? "بيانات الطرف المقابل في العقد"
          : "بيانات المتقدم بطلب التوثيق"
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <IconText
          label={
            isCommercialTenant
              ? "رقم الهوية / الإقامة للطرف الآخر"
              : "رقم الهوية / الإقامة لمقدم الطلب"
          }
          required
          icon={<MdBadge />}
          description={helpers.nationalOrIqama}
          placeholder="مثال: 1xxx xxxx xx"
          value={s.applicantId}
          onChange={(v) => set("applicantId", v)}
          dir="ltr"
          inputMode="numeric"
          error={err(
            !validators.nationalOrIqama(s.applicantId),
            messages.nationalOrIqama,
          )}
        />
        <IconDate
          label={
            isCommercialTenant
              ? "تاريخ ميلاد الطرف الآخر"
              : "تاريخ ميلاد مقدم الطلب"
          }
          icon={<MdCake />}
          name="applicant-dob"
          description={
            s.role === "tenant" && !isCommercialTenant
              ? "يجب أن يكون العمر 18 سنة على الأقل"
              : "اختياري"
          }
          value={s.applicantDob}
          onChange={(v) => set("applicantDob", v)}
          maxYear={new Date().getFullYear()}
          error={err(
            s.role === "tenant" &&
              !isCommercialTenant &&
              !isAdultISO(toGregorianISO(s.applicantDob)),
            messages.adult,
          )}
        />
        <IconText
          label={isCommercialTenant ? "جوال الطرف الآخر" : "جوال مقدم الطلب"}
          required
          icon={<MdPhone />}
          description={helpers.mobile}
          placeholder="مثال: 05xx xxx xxx"
          value={s.applicantPhone}
          onChange={(v) => set("applicantPhone", v)}
          dir="ltr"
          inputMode="tel"
          error={err(!validators.mobile(s.applicantPhone), messages.mobile)}
        />
      </div>

      {s.role === "owner" && (
        <IconText
          label="IBAN المؤجر"
          required
          icon={<MdAccountBalanceWallet />}
          description="رقم الآيبان البنكي الدولي للمؤجر"
          placeholder="مثال: SA03 8000 0000 6080 1016 7519"
          value={s.ownerIban}
          onChange={(v) => set("ownerIban", v)}
          dir="ltr"
          error={err(!validators.iban(s.ownerIban), messages.iban)}
        />
      )}

      {s.role === "owner" && (
        <IconSwitch
          label="هل أنت وكيل عن المالك؟"
          icon={<MdGavel />}
          checked={s.isAgent}
          onChange={(v) => set("isAgent", v)}
        />
      )}
      {s.role === "owner" && s.isAgent && (
        <IconText
          label="رقم الوكالة"
          required
          icon={<MdGavel />}
          description="كما هو مدون في صك الوكالة"
          placeholder="يرجى إدخال رقم الوكالة"
          value={s.agencyNumber}
          onChange={(v) => set("agencyNumber", v)}
          error={err(!validators.required(s.agencyNumber), messages.required)}
        />
      )}
      {s.role === "tenant" && (
        <>
          <Separator />
          <IconText
            label="IBAN المؤجر"
            required
            icon={<MdAccountBalanceWallet />}
            description="رقم الآيبان البنكي الدولي للمؤجر"
            placeholder="مثال: SA03 8000 0000 6080 1016 7519"
            value={s.ownerIban}
            onChange={(v) => set("ownerIban", v)}
            dir="ltr"
            error={err(!validators.iban(s.ownerIban), messages.iban)}
          />
        </>
      )}
    </SectionCard>
  );

  if (loading) {
    return <SmartFormSkeleton />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <Card className="p-4 sm:p-6">
        <Form
          validationBehavior="aria"
          aria-label="نموذج طلب التوثيق"
          className="flex min-w-0 flex-col gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (step < 5) next();
          }}
        >
          <FormStepper
            step={step}
            verified={[0, 1, 2, 3, 4, 5].map((i) => stepValid(i))}
            canJump={(i) => i <= step || verifiedBefore(i)}
            onJump={(i) => {
              setTouched(false);
              setStep(i);
            }}
          />
          <Separator />

          {draftRestored && (
            <Alert>
              <Alert.Indicator />
              <Alert.Content>
                <Alert.Title>تمت استعادة المسودة المحفوظة</Alert.Title>
                <Alert.Description>{copy.draftRestored}</Alert.Description>
              </Alert.Content>
              <Button
                size="sm"
                type="button"
                variant="tertiary"
                onPress={() => {
                  skipSave.current = true;
                  try {
                    localStorage.removeItem(draftKey);
                  } catch {
                    /* ignore */
                  }
                  setS({
                    ...initial,
                    counterType: isCommercial ? "entity" : "individual",
                    contractStart: today(getLocalTimeZone()),
                  });
                  setDraftRestored(false);
                  toast("تم تجاهل المسودة المحفوظة");
                }}
              >
                تجاهل المسودة
              </Button>
            </Alert>
          )}

          {step === 0 && (
            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center gap-2">
                <Tooltip delay={0}>
                  <Tooltip.Trigger aria-label="لماذا؟">
                    <MdBadge className="text-muted size-4" />
                  </Tooltip.Trigger>
                  <Tooltip.Content showArrow>
                    <Tooltip.Arrow />
                    <p>يتم تخصيص الأسئلة التالية بناءً على صفة مقدم الطلب</p>
                  </Tooltip.Content>
                </Tooltip>
                <Typography type="h3" weight="semibold">
                  من يقدم الطلب؟
                </Typography>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {roleOptions.map((r) => {
                  const active = s.role === r.value;
                  return (
                    <Card
                      key={r.value}
                      variant="tertiary"
                      className={`cursor-pointer transition-all ${active ? "ring-accent bg-accent/20 ring-2" : "opacity-80 hover:shadow-md"}`}
                      onClick={() => applyRole(r.value as Role)}
                    >
                      <Card.Header>
                        <span
                          className={`flex size-11 items-center justify-center rounded-2xl text-2xl ${active ? "bg-accent text-accent-foreground" : "bg-accent/10 text-accent"}`}
                        >
                          {r.icon}
                        </span>
                        <div>
                          <Card.Title>{r.label}</Card.Title>
                          <Card.Description>
                            {r.value === "owner"
                              ? "يرجى إرفاق بيانات الوكالة عند التقديم بالنيابة عن المالك"
                              : "يلزم إدخال بيانات المالك كطرف آخر في العقد"}
                          </Card.Description>
                        </div>
                      </Card.Header>
                      <Card.Content>
                        <Chip
                          color={active ? "success" : "default"}
                          variant="soft"
                          size="md"
                          className={
                            active
                              ? undefined
                              : "border-border bg-foreground/10 border"
                          }
                        >
                          {active ? (
                            <>
                              <MdCheckCircle className="size-3.5" /> مختار
                            </>
                          ) : (
                            "اختر"
                          )}
                        </Chip>
                      </Card.Content>
                    </Card>
                  );
                })}
              </div>
              {err(s.role === "", messages.required) && (
                <Alert status="danger">
                  <Alert.Indicator />
                  <Alert.Content>
                    <Alert.Description>{messages.required}</Alert.Description>
                  </Alert.Content>
                </Alert>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              {!isCommercialTenant && applicantCard}

              <SectionCard
                icon={<FaUsers />}
                title={
                  isCommercialTenant
                    ? "بيانات مقدم الطلب"
                    : "بيانات الطرف الآخر"
                }
                description={
                  isCommercialTenant
                    ? "بيانات المتقدم بطلب التوثيق"
                    : "بيانات الطرف المقابل في العقد"
                }
              >
                {isCommercial ? (
                  <>
                    <div
                      aria-invalid={touched && s.counterType === ""}
                      className={
                        touched && s.counterType === ""
                          ? "rounded-2xl ring-2 ring-[var(--danger)]"
                          : undefined
                      }
                    >
                      <ToggleButtonGroup
                        aria-label={
                          isCommercialTenant
                            ? "نوع مقدم الطلب"
                            : "نوع الطرف الآخر"
                        }
                        selectionMode="single"
                        disallowEmptySelection
                        fullWidth
                        selectedKeys={[s.counterType]}
                        onSelectionChange={(k) => {
                          const nextType = (Array.from(k as Set<string>)[0] ??
                            "entity") as "individual" | "entity";
                          setS((p) => ({
                            ...p,
                            counterType: nextType,
                            ...(nextType === "entity"
                              ? {
                                  otherId: "",
                                  otherPhone: "",
                                  otherDob: null,
                                }
                              : {
                                  unifiedNumber: "",
                                  repId: "",
                                  repPhone: "",
                                  repDob: null,
                                  authNumber: "",
                                }),
                          }));
                        }}
                      >
                        <ToggleButton id="entity">
                          <FaBuilding /> منشأة
                        </ToggleButton>
                        <ToggleButton id="individual">
                          <ToggleButtonGroup.Separator />
                          <FaUsers /> فرد
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </div>
                    {touched && s.counterType === "" ? (
                      <FieldMessage>{messages.required}</FieldMessage>
                    ) : null}
                    <Separator />
                    {s.counterType === "entity" ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <IconText
                          label="الرقم الموحد للمنشأة"
                          required
                          icon={<MdNumbers />}
                          description={helpers.unified}
                          placeholder="يرجى إدخال الرقم الموحد (10 أرقام تبدأ بـ 70)"
                          value={s.unifiedNumber}
                          onChange={(v) => set("unifiedNumber", v)}
                          dir="ltr"
                          inputMode="numeric"
                          error={err(
                            !validators.unifiedNumber(s.unifiedNumber),
                            messages.unified,
                          )}
                        />
                        <IconText
                          label="هوية المفوّض بالتوقيع"
                          required
                          icon={<MdBadge />}
                          description={helpers.nationalOrIqama}
                          placeholder="مثال: 1xxx xxxx xx"
                          value={s.repId}
                          onChange={(v) => set("repId", v)}
                          dir="ltr"
                          inputMode="numeric"
                          error={err(
                            !validators.nationalOrIqama(s.repId),
                            messages.nationalOrIqama,
                          )}
                        />
                        <IconDate
                          label="تاريخ ميلاد المفوّض بالتوقيع"
                          icon={<MdCake />}
                          name="rep-dob"
                          description="اختياري"
                          value={s.repDob}
                          onChange={(v) => set("repDob", v)}
                          maxYear={new Date().getFullYear()}
                        />
                        <IconText
                          label="جوال المفوّض بالتوقيع"
                          required
                          icon={<MdPhone />}
                          description={helpers.mobile}
                          placeholder="مثال: 05xx xxx xxx"
                          value={s.repPhone}
                          onChange={(v) => set("repPhone", v)}
                          dir="ltr"
                          inputMode="tel"
                          error={err(
                            !validators.mobile(s.repPhone),
                            messages.mobile,
                          )}
                        />
                        <IconText
                          label="رقم التفويض أو الوكالة"
                          icon={<MdGavel />}
                          description="اختياري - يرجى إدخاله عند توفره"
                          placeholder="يرجى الإدخال عند توفره"
                          value={s.authNumber}
                          onChange={(v) => set("authNumber", v)}
                        />
                      </div>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        <IconText
                          label={
                            isCommercialTenant
                              ? "رقم الهوية / الإقامة لمقدم الطلب"
                              : "رقم الهوية / الإقامة للطرف الآخر"
                          }
                          required
                          icon={<MdBadge />}
                          description={helpers.nationalOrIqama}
                          placeholder="مثال: 1xxx xxxx xx"
                          value={s.otherId}
                          onChange={(v) => set("otherId", v)}
                          dir="ltr"
                          inputMode="numeric"
                          error={err(
                            !validators.nationalOrIqama(s.otherId),
                            messages.nationalOrIqama,
                          )}
                        />
                        <IconDate
                          label={
                            isCommercialTenant
                              ? "تاريخ ميلاد مقدم الطلب"
                              : "تاريخ ميلاد الطرف الآخر"
                          }
                          icon={<MdCake />}
                          name="other-dob"
                          description={
                            s.role === "owner" || isCommercialTenant
                              ? "يجب أن يكون العمر 18 سنة على الأقل"
                              : "اختياري"
                          }
                          value={s.otherDob}
                          onChange={(v) => set("otherDob", v)}
                          maxYear={new Date().getFullYear()}
                          error={err(
                            (s.role === "owner" || isCommercialTenant) &&
                              !isAdultISO(toGregorianISO(s.otherDob)),
                            messages.adult,
                          )}
                        />
                        <IconText
                          label={
                            isCommercialTenant
                              ? "جوال مقدم الطلب"
                              : "جوال الطرف الآخر"
                          }
                          required
                          icon={<MdPhone />}
                          description={helpers.mobile}
                          placeholder="مثال: 05xx xxx xxx"
                          value={s.otherPhone}
                          onChange={(v) => set("otherPhone", v)}
                          dir="ltr"
                          inputMode="tel"
                          error={err(
                            !validators.mobile(s.otherPhone),
                            messages.mobile,
                          )}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <IconText
                      label="رقم الهوية / الإقامة للطرف الآخر"
                      required
                      icon={<MdBadge />}
                      description={helpers.nationalOrIqama}
                      placeholder="مثال: 1xxx xxxx xx"
                      value={s.otherId}
                      onChange={(v) => set("otherId", v)}
                      dir="ltr"
                      inputMode="numeric"
                      error={err(
                        !validators.nationalOrIqama(s.otherId),
                        messages.nationalOrIqama,
                      )}
                    />
                    <IconDate
                      label="تاريخ ميلاد الطرف الآخر"
                      icon={<MdCake />}
                      name="other-dob-res"
                      description={
                        s.role === "owner"
                          ? "يجب أن يكون العمر 18 سنة على الأقل"
                          : "اختياري"
                      }
                      value={s.otherDob}
                      onChange={(v) => set("otherDob", v)}
                      maxYear={new Date().getFullYear()}
                      error={err(
                        s.role === "owner" &&
                          !isAdultISO(toGregorianISO(s.otherDob)),
                        messages.adult,
                      )}
                    />
                    <IconText
                      label="جوال الطرف الآخر"
                      required
                      icon={<MdPhone />}
                      description={helpers.mobile}
                      placeholder="مثال: 05xx xxx xxx"
                      value={s.otherPhone}
                      onChange={(v) => set("otherPhone", v)}
                      dir="ltr"
                      inputMode="tel"
                      error={err(
                        !validators.mobile(s.otherPhone),
                        messages.mobile,
                      )}
                    />
                  </div>
                )}
              </SectionCard>
              {isCommercialTenant && applicantCard}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-4">
              <Alert>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>يرجى تجهيز بيانات الصك أولاً</Alert.Title>
                  <Alert.Description>
                    يرجى التأكد من رقم الصك وتاريخه قبل المتابعة إلى الخطوات
                    التالية.
                  </Alert.Description>
                </Alert.Content>
              </Alert>
              <SectionCard
                icon={<FaFileContract />}
                title="بيانات الصك"
                description="رقم الصك وتاريخ إصداره"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconText
                    label="رقم الصك"
                    required
                    icon={<FaFileContract />}
                    description="كما هو مدون في صك الملكية"
                    placeholder="يرجى إدخال رقم الصك"
                    value={s.deedNumber}
                    onChange={(v) => set("deedNumber", v)}
                    dir="ltr"
                    error={err(
                      !validators.deedNumber(s.deedNumber),
                      "يرجى التحقق من رقم الصك وإعادة الإدخال",
                    )}
                  />
                  <IconDate
                    label="تاريخ الصك"
                    icon={<BsCalendar2WeekFill />}
                    name="deed-date"
                    description={helpers.deedDate}
                    value={s.deedDate}
                    onChange={(v) => set("deedDate", v)}
                    required
                    error={err(!s.deedDate, "يرجى اختيار تاريخ الصك")}
                  />
                </div>
              </SectionCard>
              <SectionCard
                icon={<MdLocationOn />}
                title="موقع العقار"
                description="رابط الموقع والمدينة"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <FieldLabel>هل لديك العنوان الوطني؟</FieldLabel>
                  <div
                    aria-invalid={touched && s.locationManual === null}
                    className={
                      touched && s.locationManual === null
                        ? "rounded-2xl ring-2 ring-[var(--danger)]"
                        : undefined
                    }
                  >
                    <ToggleButtonGroup
                      aria-label="هل لديك العنوان الوطني؟"
                      selectionMode="single"
                      disallowEmptySelection
                      fullWidth
                      selectedKeys={
                        s.locationManual === null
                          ? []
                          : [s.locationManual ? "yes" : "no"]
                      }
                      onSelectionChange={(k) => {
                        const next = Array.from(k as Set<string>)[0] ?? "yes";
                        set("locationManual", next === "yes");
                      }}
                    >
                      <ToggleButton id="yes">نعم</ToggleButton>
                      <ToggleButtonGroup.Separator />
                      <ToggleButton id="no">لا</ToggleButton>
                    </ToggleButtonGroup>
                  </div>
                  {touched && s.locationManual === null ? (
                    <FieldMessage>{messages.required}</FieldMessage>
                  ) : null}
                </div>
                <Separator />
                {s.locationManual === true ? (
                  <>
                    <IconText
                      label="المدينة"
                      required
                      icon={<MdLocationOn />}
                      description="يرجى إدخال اسم المدينة"
                      placeholder="مثال: الرياض"
                      value={s.city}
                      onChange={(v) => set("city", v)}
                      error={err(
                        !validators.required(s.city),
                        "يرجى إدخال المدينة",
                      )}
                    />
                    <div className="grid gap-4 sm:grid-cols-3">
                      <IconText
                        label="رقم المبنى"
                        icon={<MdHome />}
                        description="اختياري"
                        placeholder="مثال: 1234"
                        value={s.buildingNumber}
                        onChange={(v) => set("buildingNumber", v)}
                        dir="ltr"
                        inputMode="numeric"
                      />
                      <IconText
                        label="الرقم الإضافي"
                        icon={<MdNumbers />}
                        description="اختياري"
                        placeholder="مثال: 5678"
                        value={s.additionalNumber}
                        onChange={(v) => set("additionalNumber", v)}
                        dir="ltr"
                        inputMode="numeric"
                      />
                      <IconText
                        label="الرمز البريدي"
                        icon={<MdLocationOn />}
                        description="اختياري - 5 أرقام عند الإدخال"
                        placeholder="مثال: 12345"
                        value={s.postalCode}
                        onChange={(v) => set("postalCode", v)}
                        dir="ltr"
                        inputMode="numeric"
                        error={err(
                          s.postalCode.trim() !== "" &&
                            !validators.postal(s.postalCode),
                          messages.postal,
                        )}
                      />
                    </div>
                  </>
                ) : s.locationManual === false ? (
                  <IconText
                    label="رابط موقع العقار"
                    required
                    icon={<MdLocationOn />}
                    helpTitle="كيفية إرفاق الموقع"
                    helpText="يرجى نسخ رابط المشاركة من خرائط جوجل ولصقه هنا."
                    placeholder="https://maps.google.com/…"
                    value={s.mapsLink}
                    onChange={(v) => set("mapsLink", v)}
                    dir="ltr"
                    error={err(
                      !validators.required(s.mapsLink),
                      messages.required,
                    )}
                  />
                ) : null}
              </SectionCard>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              <SectionCard
                icon={<MdTimelapse />}
                title="مدة العقد"
                description="البداية والمدة الزمنية"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconDate
                    label="تاريخ بداية العقد"
                    icon={<MdDateRange />}
                    name="contract-start"
                    value={s.contractStart}
                    onChange={(v) => set("contractStart", v)}
                    required
                    error={err(
                      !s.contractStart,
                      "يرجى اختيار تاريخ بداية العقد",
                    )}
                  />
                  <IconSelect
                    label="مدة العقد"
                    required
                    icon={<MdTimelapse />}
                    options={durationOptions}
                    value={s.duration}
                    error={err(!s.duration, messages.required)}
                    onChange={(v) => {
                      set("duration", v);
                      set("customMonths", durationToMonths(v, s.customMonths));
                      set("customUnit", "months");
                    }}
                  />
                </div>
                {s.duration === "custom" && (
                  <div className="border-border flex min-w-0 flex-col gap-3 rounded-2xl border p-4">
                    <ToggleButtonGroup
                      selectionMode="single"
                      fullWidth
                      selectedKeys={[s.customUnit]}
                      onSelectionChange={(k) =>
                        set(
                          "customUnit",
                          (Array.from(k as Set<string>)[0] ?? "months") as
                            "months" | "years",
                        )
                      }
                    >
                      <ToggleButton id="months">
                        <MdTimelapse className="size-4" />
                        احتساب المدة بالأشهر
                      </ToggleButton>
                      <ToggleButton id="years">
                        <ToggleButtonGroup.Separator />
                        <BsCalendar2WeekFill className="size-4" />
                        احتساب المدة بالسنوات
                      </ToggleButton>
                    </ToggleButtonGroup>
                    <IconNumber
                      required
                      label={
                        s.customUnit === "years"
                          ? "المدة بالسنوات"
                          : "المدة بالأشهر"
                      }
                      error={err(
                        !(s.customMonths >= 1),
                        "يرجى إدخال مدة لا تقل عن شهر واحد",
                      )}
                      icon={
                        s.customUnit === "years" ? (
                          <BsCalendar2WeekFill />
                        ) : (
                          <MdTimelapse />
                        )
                      }
                      suffix={s.customUnit === "years" ? "سنة" : "شهر"}
                      min={1}
                      max={s.customUnit === "years" ? 10 : 120}
                      value={
                        s.customUnit === "years"
                          ? Math.max(1, Math.round(s.customMonths / 12))
                          : s.customMonths
                      }
                      onChange={(v) =>
                        set(
                          "customMonths",
                          s.customUnit === "years"
                            ? Math.min(120, Math.max(1, v * 12))
                            : Math.min(120, Math.max(1, v)),
                        )
                      }
                    />
                  </div>
                )}
                {s.duration !== "" && (
                  <DurationSlider
                    months={s.customMonths}
                    onChange={(m) => {
                      set("duration", "custom");
                      set("customMonths", m);
                    }}
                  />
                )}
                {s.duration !== "" && (
                  <div className="bg-accent/10 flex items-center justify-between gap-3 rounded-2xl p-4">
                    <span className="flex min-w-0 items-center gap-2">
                      <MdReceiptLong className="text-accent size-5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block font-semibold">
                          رسوم التوثيق التقديرية
                        </span>
                        <span className="text-muted block text-xs">
                          للسنة الأولى، ثم عن كل سنة إضافية، وأي جزء من السنة
                          يُحتسب سنة كاملة
                        </span>
                      </span>
                    </span>
                    <Price value={fee} iconClassName="size-5" />
                  </div>
                )}
              </SectionCard>
              <SectionCard
                icon={<MdPayments />}
                title="الدفع والرسوم"
                description="طريقة الدفع والإيجار"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconSelect
                    label="طريقة الدفع"
                    required
                    icon={<MdPayments />}
                    options={paymentOptions}
                    value={s.payment}
                    onChange={(v) => set("payment", v)}
                    error={err(!s.payment, messages.required)}
                  />
                  {!totalCase && (
                    <IconNumber
                      label="الإيجار السنوي"
                      required
                      icon={<BiSolidCoinStack />}
                      suffix={<SaudiRiyal className="size-4" />}
                      min={1}
                      emptyWhenZero
                      placeholder="مثال: 24000"
                      value={s.annualRent}
                      onChange={(v) => set("annualRent", v)}
                      error={err(
                        !(s.annualRent > 0),
                        "يرجى إدخال إيجار سنوي أكبر من صفر",
                      )}
                    />
                  )}
                  {totalCase && (
                    <IconNumber
                      label="إجمالي مبلغ الإيجار"
                      required
                      icon={<BiSolidCoinStack />}
                      suffix={<SaudiRiyal className="size-4" />}
                      min={1}
                      emptyWhenZero
                      placeholder="مثال: 24000"
                      value={s.totalRent}
                      onChange={(v) => set("totalRent", v)}
                      error={err(
                        !(s.totalRent > 0),
                        "يرجى إدخال إجمالي مبلغ إيجار أكبر من صفر",
                      )}
                    />
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-4">
              <SectionCard
                icon={<MdHome />}
                title="مواصفات العقار"
                description="رقم الوحدة والدور والمساحة والنوع"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  <IconText
                    label="رقم الوحدة"
                    required
                    icon={<MdNumbers />}
                    placeholder="مثال: 5"
                    value={s.unitNumber}
                    onChange={(v) => set("unitNumber", v)}
                    error={err(
                      !validators.required(s.unitNumber),
                      messages.required,
                    )}
                  />
                  <IconSelect
                    label="الدور"
                    required
                    icon={<MdLayers />}
                    options={floorOptions}
                    value={s.floor}
                    onChange={(v) => set("floor", v)}
                    placeholder="اختر الدور…"
                    error={err(!s.floor, messages.required)}
                  />
                  {s.floor === "other" && (
                    <IconText
                      label="يرجى تحديد رقم الدور"
                      required
                      icon={<MdLayers />}
                      placeholder="مثال: 12"
                      value={s.floorCustom}
                      onChange={(v) => set("floorCustom", v)}
                      dir="ltr"
                      inputMode="numeric"
                      error={err(
                        !validators.required(s.floorCustom),
                        messages.required,
                      )}
                    />
                  )}
                  <IconNumber
                    label="المساحة"
                    required
                    icon={<MdSquareFoot />}
                    suffix="م²"
                    emptyWhenZero
                    placeholder="مثال: 120"
                    value={s.area}
                    onChange={(v) => set("area", v)}
                    error={err(!(s.area > 0), "يرجى إدخال مساحة أكبر من صفر")}
                  />
                  {!isCommercial && (
                    <>
                      <IconSelect
                        label="الغرف"
                        required
                        icon={<FaDoorOpen />}
                        options={countOptions(<FaDoorOpen />)}
                        value={s.rooms}
                        onChange={(v) => set("rooms", v)}
                        error={err(!s.rooms, messages.required)}
                      />
                      {s.rooms === "other" && (
                        <IconNumber
                          label="عدد الغرف"
                          required
                          icon={<FaDoorOpen />}
                          min={1}
                          value={s.roomsCustom}
                          onChange={(v) => set("roomsCustom", v)}
                          error={err(
                            !(s.roomsCustom > 0),
                            "يرجى إدخال عدد أكبر من صفر",
                          )}
                        />
                      )}
                    </>
                  )}
                  <IconSelect
                    label="نوع العقار"
                    required
                    icon={<MdHome />}
                    options={
                      isCommercial
                        ? commercialPropertyTypes
                        : residentialPropertyTypes
                    }
                    value={s.propertyType}
                    onChange={(v) => set("propertyType", v)}
                    error={err(!s.propertyType, messages.required)}
                  />
                  {s.propertyType === "other" && (
                    <IconText
                      label="يرجى تحديد نوع العقار"
                      required
                      icon={<MdHome />}
                      placeholder="مثال: استراحة"
                      value={s.propertyCustom}
                      onChange={(v) => set("propertyCustom", v)}
                      error={err(
                        !validators.required(s.propertyCustom),
                        messages.required,
                      )}
                    />
                  )}
                  <IconSelect
                    label="نوع الوحدة"
                    required
                    icon={<FaBuilding />}
                    options={
                      isCommercial ? commercialUnitTypes : residentialUnitTypes
                    }
                    value={s.unitType}
                    onChange={(v) => set("unitType", v)}
                    error={err(!s.unitType, messages.required)}
                  />
                  {s.unitType === "other" && (
                    <IconText
                      label="يرجى تحديد نوع الوحدة"
                      required
                      icon={<FaBuilding />}
                      placeholder="مثال: شاليه"
                      value={s.unitCustom}
                      onChange={(v) => set("unitCustom", v)}
                      error={err(
                        !validators.required(s.unitCustom),
                        messages.required,
                      )}
                    />
                  )}
                </div>
              </SectionCard>

              <SectionCard
                icon={<HiHomeModern />}
                title="تفاصيل الوحدة"
                description="المرافق والعدادات"
              >
                <>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <IconText
                      label="رقم عداد الكهرباء"
                      required
                      icon={<MdLightbulb />}
                      description="كما هو مدون على العداد"
                      placeholder="يرجى إدخال رقم عداد الكهرباء"
                      value={s.electroMeter}
                      onChange={(v) => set("electroMeter", v)}
                      dir="ltr"
                      error={err(
                        !validators.required(s.electroMeter),
                        messages.required,
                      )}
                    />
                    <IconText
                      label="رقم عداد المياه"
                      icon={<MdWaterDrop />}
                      description="اختياري - يمكن استكماله لاحقاً"
                      placeholder="يرجى الإدخال عند توفره"
                      value={s.waterMeter}
                      onChange={(v) => set("waterMeter", v)}
                      dir="ltr"
                    />
                  </div>
                  <Separator />
                  <Disclosure>
                    <Disclosure.Heading>
                      <Button
                        type="button"
                        slot="trigger"
                        variant="secondary"
                        className="w-full justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <MdKitchen className="size-4" /> تفاصيل إضافية
                        </span>
                        <Disclosure.Indicator />
                      </Button>
                    </Disclosure.Heading>
                    <Disclosure.Content>
                      <div className="border-border flex flex-col gap-3 rounded-2xl border p-4">
                        <CountedChecks
                          label="المرافق المتوفرة"
                          icon={<MdKitchen />}
                          values={s.extras}
                          onChange={(v) =>
                            setS((p) => ({
                              ...p,
                              extras: v,
                              kitchenCabinets: v.some(
                                (e) => e.kind === "kitchen",
                              )
                                ? p.kitchenCabinets
                                : null,
                            }))
                          }
                          errorForKind={(kind) =>
                            err(
                              (s.extras.find((e) => e.kind === kind)?.count ??
                                0) < 1,
                              "يرجى إدخال عدد أكبر من صفر",
                            )
                          }
                          options={[
                            {
                              value: "kitchen",
                              label: "يوجد مطبخ",
                              icon: <MdKitchen />,
                            },
                            {
                              value: "majlis",
                              label: "يوجد مجلس",
                              icon: <MdWeekend />,
                            },
                            {
                              value: "split_ac",
                              label: "مكيفات سبليت",
                              icon: <TbAirConditioning />,
                            },
                            {
                              value: "window_ac",
                              label: "مكيفات شباك",
                              icon: <PiFanFill />,
                            },
                            {
                              value: "storage",
                              label: "غرفة مخزن",
                              icon: <PiWarehouseFill />,
                            },
                            {
                              value: "sitting",
                              label: "يوجد صالة",
                              icon: <MdWeekend />,
                            },
                            {
                              value: "bathrooms",
                              label: "الحمامات",
                              icon: <PiBathtubFill />,
                            },
                          ].filter(
                            (o) =>
                              !isCommercial ||
                              COMMERCIAL_EXTRA_KINDS.includes(o.value),
                          )}
                        />
                        {s.extras.some((e) => e.kind === "kitchen") && (
                          <div className="flex min-w-0 flex-col gap-1">
                            <FieldLabel>هل تم تركيب خزائن المطبخ؟</FieldLabel>
                            <div
                              aria-invalid={
                                touched && s.kitchenCabinets === null
                              }
                              className={
                                touched && s.kitchenCabinets === null
                                  ? "rounded-2xl ring-2 ring-[var(--danger)]"
                                  : undefined
                              }
                            >
                              <ToggleButtonGroup
                                aria-label="هل تم تركيب خزائن المطبخ؟"
                                selectionMode="single"
                                disallowEmptySelection
                                fullWidth
                                selectedKeys={
                                  s.kitchenCabinets === null
                                    ? []
                                    : [s.kitchenCabinets ? "yes" : "no"]
                                }
                                onSelectionChange={(k) => {
                                  const next =
                                    Array.from(k as Set<string>)[0] ?? "yes";
                                  set("kitchenCabinets", next === "yes");
                                }}
                              >
                                <ToggleButton id="yes">نعم</ToggleButton>
                                <ToggleButtonGroup.Separator />
                                <ToggleButton id="no">لا</ToggleButton>
                              </ToggleButtonGroup>
                            </div>
                            {touched && s.kitchenCabinets === null ? (
                              <FieldMessage>{messages.required}</FieldMessage>
                            ) : null}
                          </div>
                        )}
                      </div>
                    </Disclosure.Content>
                  </Disclosure>
                </>
              </SectionCard>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col gap-4">
              <Alert>
                <Alert.Indicator />
                <Alert.Content>
                  <Alert.Title>يرجى المراجعة قبل التأكيد</Alert.Title>
                  <Alert.Description>
                    يمكن الضغط على أي قسم للعودة وتعديله.{" "}
                    {copy.reviewDisclaimer}
                  </Alert.Description>
                </Alert.Content>
              </Alert>
              <SectionCard
                icon={<MdCheckCircle />}
                title="المراجعة والتأكيد"
                description="يرجى مراجعة بيانات الطلب قبل الإرسال"
              >
                <SummaryRow
                  title="صفة مقدم الطلب"
                  value={s.role === "owner" ? "المالك أو ممثله" : "المستأجر"}
                  onEdit={() => setStep(0)}
                />
                <SummaryRow
                  title={
                    isCommercialTenant ? "جوال الطرف الآخر" : "جوال مقدم الطلب"
                  }
                  value={s.applicantPhone}
                  onEdit={() => setStep(1)}
                />
                <SummaryRow
                  title={
                    isCommercialTenant
                      ? "رقم الهوية / الإقامة للطرف الآخر"
                      : "رقم الهوية / الإقامة لمقدم الطلب"
                  }
                  value={s.applicantId}
                  onEdit={() => setStep(1)}
                />
                {s.applicantDob && (
                  <SummaryRow
                    title={
                      isCommercialTenant
                        ? "تاريخ ميلاد الطرف الآخر"
                        : "تاريخ ميلاد مقدم الطلب"
                    }
                    value={dateLabel(s.applicantDob)}
                    onEdit={() => setStep(1)}
                  />
                )}
                {isCommercial && (
                  <SummaryRow
                    title={
                      isCommercialTenant ? "نوع مقدم الطلب" : "نوع الطرف الآخر"
                    }
                    value={s.counterType === "entity" ? "منشأة" : "فرد"}
                    onEdit={() => setStep(1)}
                  />
                )}
                {s.counterType === "entity" ? (
                  <>
                    <SummaryRow
                      title="الرقم الموحد للمنشأة"
                      value={s.unifiedNumber}
                      onEdit={() => setStep(1)}
                    />
                    <SummaryRow
                      title="هوية المفوّض بالتوقيع"
                      value={s.repId}
                      onEdit={() => setStep(1)}
                    />
                    <SummaryRow
                      title="جوال المفوّض بالتوقيع"
                      value={s.repPhone}
                      onEdit={() => setStep(1)}
                    />
                    {s.repDob && (
                      <SummaryRow
                        title="تاريخ ميلاد المفوّض بالتوقيع"
                        value={dateLabel(s.repDob)}
                        onEdit={() => setStep(1)}
                      />
                    )}
                    {s.authNumber && (
                      <SummaryRow
                        title="رقم التفويض أو الوكالة"
                        value={s.authNumber}
                        onEdit={() => setStep(1)}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <SummaryRow
                      title={
                        isCommercialTenant
                          ? "رقم الهوية / الإقامة لمقدم الطلب"
                          : "رقم الهوية / الإقامة للطرف الآخر"
                      }
                      value={s.otherId}
                      onEdit={() => setStep(1)}
                    />
                    <SummaryRow
                      title={
                        isCommercialTenant
                          ? "جوال مقدم الطلب"
                          : "جوال الطرف الآخر"
                      }
                      value={s.otherPhone}
                      onEdit={() => setStep(1)}
                    />
                    {s.otherDob && (
                      <SummaryRow
                        title={
                          isCommercialTenant
                            ? "تاريخ ميلاد مقدم الطلب"
                            : "تاريخ ميلاد الطرف الآخر"
                        }
                        value={dateLabel(s.otherDob)}
                        onEdit={() => setStep(1)}
                      />
                    )}
                  </>
                )}
                <SummaryRow
                  title="IBAN المؤجر"
                  value={s.ownerIban}
                  onEdit={() => setStep(1)}
                />
                <SummaryRow
                  title="رقم الصك"
                  value={s.deedNumber}
                  onEdit={() => setStep(2)}
                />
                <SummaryRow
                  title="تاريخ الصك"
                  value={dateLabel(s.deedDate)}
                  onEdit={() => setStep(2)}
                />
                {s.locationManual === true && (
                  <>
                    <SummaryRow
                      title="المدينة"
                      value={
                        cityOptions.find((c) => c.value === s.city)?.label ??
                        s.city
                      }
                      onEdit={() => setStep(2)}
                    />
                    <SummaryRow
                      title="رقم المبنى"
                      value={s.buildingNumber}
                      onEdit={() => setStep(2)}
                    />
                    <SummaryRow
                      title="الرقم الإضافي"
                      value={s.additionalNumber}
                      onEdit={() => setStep(2)}
                    />
                    <SummaryRow
                      title="الرمز البريدي"
                      value={s.postalCode}
                      onEdit={() => setStep(2)}
                    />
                  </>
                )}
                {s.locationManual === false && (
                  <SummaryRow
                    title="رابط موقع العقار"
                    value={s.mapsLink}
                    onEdit={() => setStep(2)}
                  />
                )}
                <SummaryRow
                  title="مدة العقد"
                  value={durationLabel}
                  onEdit={() => setStep(3)}
                />
                <SummaryRow
                  title="تاريخ بداية العقد"
                  value={dateLabel(s.contractStart)}
                  onEdit={() => setStep(3)}
                />
                <SummaryRow
                  title="الدفعات"
                  value={paymentLabel}
                  onEdit={() => setStep(3)}
                />
                <SummaryRow
                  title={totalCase ? "إجمالي مبلغ الإيجار" : "الإيجار السنوي"}
                  value={formatCurrency(totalCase ? s.totalRent : s.annualRent)}
                  onEdit={() => setStep(3)}
                />
                <SummaryRow
                  title="نوع العقار والوحدة"
                  value={`${propLabel} / ${unitLabel}`}
                  onEdit={() => setStep(4)}
                />
                <SummaryRow
                  title="الدور والمساحة"
                  value={`الدور ${floorLabel} - ${s.area} م²${isCommercial ? "" : ` - ${roomsLabel} غرف`}`}
                  onEdit={() => setStep(4)}
                />
                <SummaryRow
                  title="رقم عداد الكهرباء"
                  value={s.electroMeter}
                  onEdit={() => setStep(4)}
                />
                {s.waterMeter && (
                  <SummaryRow
                    title="رقم عداد المياه"
                    value={s.waterMeter}
                    onEdit={() => setStep(4)}
                  />
                )}
                <SummaryRow
                  title="المرافق المتوفرة"
                  value={extrasText(s.extras) ?? "-"}
                  onEdit={() => setStep(4)}
                />
                {s.extras.some((e) => e.kind === "kitchen") && (
                  <SummaryRow
                    title="تركيب خزائن المطبخ"
                    value={
                      s.kitchenCabinets == null
                        ? "-"
                        : s.kitchenCabinets
                          ? "نعم"
                          : "لا"
                    }
                    onEdit={() => setStep(4)}
                  />
                )}
                <div className="bg-accent/10 flex items-center justify-between rounded-2xl p-4">
                  <span className="flex items-center gap-2 font-semibold">
                    <MdReceiptLong className="text-accent size-5" /> إجمالي رسوم
                    التوثيق التقديرية
                  </span>
                  <strong className="text-lg">{formatCurrency(fee)}</strong>
                </div>
                <p className="text-muted text-xs">{copy.feeNote}</p>
                <TextField
                  fullWidth
                  value={s.notes}
                  onChange={(v: string) => set("notes", v)}
                >
                  <Label>ملاحظات إضافية (اختياري)</Label>
                  <TextArea
                    placeholder="يرجى كتابة أي تفاصيل إضافية لتوضيح الطلب…"
                    rows={3}
                  />
                </TextField>
              </SectionCard>
            </div>
          )}

          <Toolbar
            aria-label="التنقل بين الخطوات"
            className="border-border bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3"
          >
            <Tooltip delay={0}>
              <Tooltip.Trigger>
                <Button
                  type="button"
                  variant="tertiary"
                  onPress={prev}
                  isDisabled={step === 0}
                >
                  <MdArrowForward className="size-4" />
                  السابق
                </Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                <p>العودة للخطوة السابقة</p>
              </Tooltip.Content>
            </Tooltip>
            {step < 5 ? (
              <Button variant="primary" type="submit">
                التالي
                <MdArrowBack className="size-4" />
              </Button>
            ) : (
              <ButtonGroup>
                <Button
                  type="button"
                  variant="tertiary"
                  onPress={() => setCancelOpen(true)}
                >
                  <MdClose className="size-4" />
                  إلغاء
                </Button>
                <AlertDialog>
                  <Button
                    type="button"
                    variant="primary"
                    onPress={() => {
                      const bad = validateAll();
                      if (bad >= 0) {
                        setTouched(true);
                        setStep(bad);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        toast("يرجى استكمال الخطوة قبل الإرسال", {
                          description: `الخطوة ${bad + 1} من 6 - ${STEP_TITLES[bad]}: بعض الحقول غير مكتملة`,
                        });
                        return;
                      }
                      router.prefetch("/request/success");
                      setConfirmOpen(true);
                    }}
                  >
                    <MdCheckCircle className="size-4" />
                    تأكيد
                  </Button>
                  <AlertDialog.Backdrop
                    isOpen={confirmOpen}
                    onOpenChange={setConfirmOpen}
                    variant="blur"
                    className="bg-overlay/60 dark:bg-overlay/70"
                  >
                    <AlertDialog.Container size="sm">
                      <AlertDialog.Dialog>
                        <AlertDialog.CloseTrigger />
                        <AlertDialog.Header>
                          <AlertDialog.Icon status="success">
                            <MdCheckCircle className="size-6" />
                          </AlertDialog.Icon>
                          <AlertDialog.Heading>
                            تأكيد إرسال الطلب؟
                          </AlertDialog.Heading>
                          <p className="text-muted text-sm">
                            يرجى مراجعة ملخص الطلب قبل الإرسال
                          </p>
                        </AlertDialog.Header>
                        <AlertDialog.Body>
                          <div className="bg-surface-secondary flex flex-col gap-2 rounded-2xl p-4">
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-muted">نوع العقد</span>
                              <Chip
                                color={isCommercial ? undefined : "success"}
                                variant="soft"
                                size="sm"
                                className={
                                  isCommercial
                                    ? "bg-alt/10 text-alt"
                                    : undefined
                                }
                              >
                                {isCommercial ? (
                                  <FaBuilding className="size-3.5" />
                                ) : (
                                  <FaHome className="size-3.5" />
                                )}
                                <span>{isCommercial ? "تجاري" : "سكني"}</span>
                              </Chip>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-muted flex items-center gap-1.5">
                                <BiSolidCoinStack className="text-accent size-4" />
                                {totalCase
                                  ? "إجمالي مبلغ الإيجار"
                                  : "الإيجار السنوي"}
                              </span>
                              <strong className="tabular-nums">
                                {formatCurrency(
                                  totalCase ? s.totalRent : s.annualRent,
                                )}
                              </strong>
                            </div>
                            <div className="flex items-center justify-between gap-3 text-sm">
                              <span className="text-muted flex items-center gap-1.5">
                                <MdTimelapse className="text-accent size-4" />
                                المدة
                              </span>
                              <span className="font-medium">
                                {durationLabel}
                              </span>
                            </div>
                            <div className="bg-accent/10 -mx-1 flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm">
                              <span className="flex items-center gap-1.5 font-semibold">
                                <MdReceiptLong className="text-accent size-4" />
                                رسوم التوثيق التقديرية
                              </span>
                              <strong className="tabular-nums">
                                {formatCurrency(fee)}
                              </strong>
                            </div>
                          </div>
                          <p className="text-muted text-xs leading-relaxed">
                            {copy.reviewDisclaimer} {copy.feeNote}
                          </p>
                        </AlertDialog.Body>
                        <AlertDialog.Footer>
                          <Button
                            slot="close"
                            variant="tertiary"
                            onPress={() => setConfirmOpen(false)}
                          >
                            تراجع
                          </Button>
                          <Button
                            onPress={submitRequest}
                            isDisabled={submitting}
                            className="min-w-32"
                          >
                            {submitting ? (
                              <Spinner size="sm" />
                            ) : (
                              <MdCheckCircle className="size-4" />
                            )}
                            {submitting ? "جارٍ الإرسال…" : "تأكيد الإرسال"}
                          </Button>
                        </AlertDialog.Footer>
                      </AlertDialog.Dialog>
                    </AlertDialog.Container>
                  </AlertDialog.Backdrop>
                </AlertDialog>
              </ButtonGroup>
            )}
          </Toolbar>

          <Modal>
            <Modal.Backdrop
              isOpen={cancelOpen}
              onOpenChange={setCancelOpen}
              variant="blur"
              className="bg-accent/15 dark:bg-accent/10"
            >
              <Modal.Container>
                <Modal.Dialog>
                  <Modal.CloseTrigger />
                  <Modal.Header>
                    <Modal.Icon className="bg-accent-soft text-accent-soft-foreground">
                      <MdClose className="size-5" />
                    </Modal.Icon>
                    <Modal.Heading>إلغاء تعبئة الطلب؟</Modal.Heading>
                  </Modal.Header>
                  <Modal.Body>
                    <p className="text-muted text-sm">
                      سيتم الاحتفاظ بالمسودة المحفوظة، ويمكن المتابعة لاحقاً.
                    </p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      slot="close"
                      variant="tertiary"
                      onPress={() => setCancelOpen(false)}
                    >
                      استمرار التحرير
                    </Button>
                    <Button
                      variant="secondary"
                      onPress={() => {
                        setCancelOpen(false);
                        setStep(0);
                        toast("تم الإلغاء - تم الاحتفاظ بالمسودة المحفوظة");
                      }}
                    >
                      تأكيد الإلغاء
                    </Button>
                  </Modal.Footer>
                </Modal.Dialog>
              </Modal.Container>
            </Modal.Backdrop>
          </Modal>
        </Form>
      </Card>
    </div>
  );
}

function SummaryRow({
  title,
  value,
  onEdit,
}: {
  title: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="border-border flex items-center justify-between gap-3 rounded-2xl border p-3">
      <div className="min-w-0">
        <Typography type="body-xs" color="muted">
          {title}
        </Typography>
        <p className="truncate text-sm font-medium">{value || "-"}</p>
      </div>
      <Tooltip delay={0}>
        <Tooltip.Trigger>
          <Button type="button" size="sm" variant="secondary" onPress={onEdit}>
            تعديل
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>العودة إلى قسم {title} لتعديله</p>
        </Tooltip.Content>
      </Tooltip>
    </div>
  );
}
