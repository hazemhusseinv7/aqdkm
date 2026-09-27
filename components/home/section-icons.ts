import type { ComponentType } from "react";
import {
  MdBadge,
  MdBolt,
  MdEditNote,
  MdGavel,
  MdRateReview,
  MdReceiptLong,
  MdSave,
  MdStar,
  MdStore,
} from "react-icons/md";
import { HiTicket } from "react-icons/hi2";

type IconProps = { className?: string };

export const FEATURE_ICONS: Record<string, ComponentType<IconProps>> = {
  save: MdSave,
  review: MdRateReview,
  fees: MdReceiptLong,
  verify: MdBadge,
  track: HiTicket,
  meters: MdEditNote,
  bolt: MdBolt,
};

export const LICENSE_ICONS: Record<string, ComponentType<IconProps>> = {
  gavel: MdGavel,
  ticket: HiTicket,
  store: MdStore,
};

export function featureIcon(key: string | null): ComponentType<IconProps> {
  return (key && FEATURE_ICONS[key]) || MdStar;
}

export function licenseIcon(key: string | null): ComponentType<IconProps> {
  return (key && LICENSE_ICONS[key]) || MdBadge;
}
