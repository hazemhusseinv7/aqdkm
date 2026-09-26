export type ContractType = "residential" | "commercial";

export type FeeBreakdown = {
  years: number;
  government: number;
  company: number;
  total: number;
};

export type FeeConfig = {
  residentialFirstGov: number;
  residentialFirstCompany: number;
  residentialExtraGov: number;
  residentialExtraCompany: number;
  commercialFirstGov: number;
  commercialFirstCompany: number;
  commercialExtraGov: number;
  commercialExtraCompany: number;
};

export const DEFAULT_FEE_CONFIG: FeeConfig = {
  residentialFirstGov: 125,
  residentialFirstCompany: 125,
  residentialExtraGov: 125,
  residentialExtraCompany: 125,
  commercialFirstGov: 200,
  commercialFirstCompany: 200,
  commercialExtraGov: 400,
  commercialExtraCompany: 400,
};

type LegacyFeeConfig = Partial<FeeConfig> & {
  residentialGov?: number;
  residentialCompany?: number;
};

export function feeConfigFromSettings(
  fees: LegacyFeeConfig | null | undefined,
): FeeConfig {
  return {
    residentialFirstGov:
      fees?.residentialFirstGov ??
      fees?.residentialGov ??
      DEFAULT_FEE_CONFIG.residentialFirstGov,
    residentialFirstCompany:
      fees?.residentialFirstCompany ??
      fees?.residentialCompany ??
      DEFAULT_FEE_CONFIG.residentialFirstCompany,
    residentialExtraGov:
      fees?.residentialExtraGov ??
      fees?.residentialGov ??
      DEFAULT_FEE_CONFIG.residentialExtraGov,
    residentialExtraCompany:
      fees?.residentialExtraCompany ??
      fees?.residentialCompany ??
      DEFAULT_FEE_CONFIG.residentialExtraCompany,
    commercialFirstGov:
      fees?.commercialFirstGov ?? DEFAULT_FEE_CONFIG.commercialFirstGov,
    commercialFirstCompany:
      fees?.commercialFirstCompany ?? DEFAULT_FEE_CONFIG.commercialFirstCompany,
    commercialExtraGov:
      fees?.commercialExtraGov ?? DEFAULT_FEE_CONFIG.commercialExtraGov,
    commercialExtraCompany:
      fees?.commercialExtraCompany ?? DEFAULT_FEE_CONFIG.commercialExtraCompany,
  };
}

export function billedYears(durationMonths: number): number {
  return Math.max(1, Math.ceil(durationMonths / 12));
}

export function calcFeeBreakdown(params: {
  contractType: ContractType;
  durationMonths: number;
  config?: FeeConfig;
}): FeeBreakdown {
  const config = params.config ?? DEFAULT_FEE_CONFIG;
  const years = billedYears(params.durationMonths);
  if (params.contractType === "residential") {
    const government =
      config.residentialFirstGov + config.residentialExtraGov * (years - 1);
    const company =
      config.residentialFirstCompany +
      config.residentialExtraCompany * (years - 1);
    return { years, government, company, total: government + company };
  }
  const government =
    config.commercialFirstGov + config.commercialExtraGov * (years - 1);
  const company =
    config.commercialFirstCompany + config.commercialExtraCompany * (years - 1);
  return { years, government, company, total: government + company };
}

export function calcFee(params: {
  contractType: ContractType;
  durationMonths: number;
  config?: FeeConfig;
}): number {
  return calcFeeBreakdown(params).total;
}

export function durationToMonths(
  duration: string,
  customMonths?: number,
): number {
  switch (duration) {
    case "3m":
      return 3;
    case "6m":
      return 6;
    case "1y":
      return 12;
    case "2y":
      return 24;
    case "3y":
      return 36;
    case "4y":
      return 48;
    case "5y":
      return 60;
    case "6y":
      return 72;
    case "7y":
      return 84;
    case "8y":
      return 96;
    case "9y":
      return 108;
    case "10y":
      return 120;
    case "custom":
      return customMonths && customMonths > 0 ? customMonths : 12;
    default:
      return 12;
  }
}

export const CURRENCY_SYMBOL = "ر.س";

const CurrencyFormat = new Intl.NumberFormat("ar-SA-u-nu-latn", {
  style: "currency",
  currency: "SAR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export type CurrencyParts = {
  amount: string;
  symbol: string;
  text: string;
  symbolFirst: boolean;
};

export function formatCurrencyParts(n: number): CurrencyParts {
  const intlParts = CurrencyFormat.formatToParts(n);
  const text = intlParts
    .map((p) => (p.type === "currency" ? CURRENCY_SYMBOL : p.value))
    .join("");
  const amount = intlParts
    .filter((p) => p.type === "integer" || p.type === "group")
    .map((p) => p.value)
    .join("");
  const firstSignificant = intlParts.find(
    (p) => p.type === "currency" || p.type === "integer",
  );
  return {
    amount,
    symbol: CURRENCY_SYMBOL,
    text,
    symbolFirst: firstSignificant?.type === "currency",
  };
}

export function formatCurrency(n: number): string {
  return formatCurrencyParts(n).text;
}
