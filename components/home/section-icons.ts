import type { ComponentType } from "react";
import {
  MdBadge,
  MdEditNote,
  MdGavel,
  MdLocalOffer,
  MdPayments,
  MdRateReview,
  MdReceiptLong,
  MdSave,
  MdStore,
  MdVerifiedUser,
} from "react-icons/md";
import { HiTicket } from "react-icons/hi2";
import { FaBoltLightning } from "react-icons/fa6";

type IconProps = { className?: string };

export const FEATURE_ICONS: Record<string, ComponentType<IconProps>> = {
  save: MdSave,
  review: MdRateReview,
  fees: MdReceiptLong,
  verify: MdBadge,
  track: HiTicket,
  meters: MdEditNote,
  bolt: FaBoltLightning,
  payment: MdPayments,
  verified_user: MdVerifiedUser,
  tag: MdLocalOffer,
};

export const LICENSE_ICONS: Record<string, ComponentType<IconProps>> = {
  gavel: MdGavel,
  ticket: HiTicket,
  store: MdStore,
};

export function featureIcon(key: string | null): ComponentType<IconProps> {
  return (key && FEATURE_ICONS[key]) || FaBoltLightning;
}

export function licenseIcon(key: string | null): ComponentType<IconProps> {
  return (key && LICENSE_ICONS[key]) || MdBadge;
}
