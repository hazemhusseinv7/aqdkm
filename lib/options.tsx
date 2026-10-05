"use client";

import {
  MdHome,
  MdVilla,
  MdLayers,
  MdMeetingRoom,
  MdStore,
  MdWarehouse,
  MdSquareFoot,
  MdFilter1,
  MdFilter2,
  MdFilter3,
  MdFilter4,
  MdFilter5,
  MdFilter6,
  MdFilter7,
  MdFilter8,
  MdFilter9,
  MdFilter9Plus,
  MdEdit,
  MdTimelapse,
  MdSchedule,
  MdDateRange,
  MdEditCalendar,
  MdLocationOn,
} from "react-icons/md";
import {
  FaUserTie,
  FaUsers,
  FaBuilding,
  FaStore,
  FaWarehouse,
  FaMoneyBillWave,
  FaCarAlt,
} from "react-icons/fa";
import { HiHomeModern, HiBuildingOffice } from "react-icons/hi2";
import { BsCalendar2WeekFill } from "react-icons/bs";

import { OPTION_VALUES, type OptionPair } from "@/lib/request-fields";

export type IconOption = {
  value: string;
  label: string;
  icon: React.ReactNode;
};

const ic = (node: React.ReactNode) => (
  <span className="inline-flex shrink-0 items-center text-lg [&>svg]:block [&>svg]:size-[1em]">
    {node}
  </span>
);

function withIcons(
  pairs: readonly OptionPair[],
  icons: Record<string, React.ReactNode>,
  fallback?: React.ReactNode,
): IconOption[] {
  return pairs.map((p) => ({ ...p, icon: ic(icons[p.value] ?? fallback) }));
}

export const roleOptions: IconOption[] = withIcons(OPTION_VALUES.role, {
  owner: <FaUserTie />,
  tenant: <FaUsers />,
});

const durationIcons: Record<string, React.ReactNode> = {
  "3m": <MdTimelapse />,
  "6m": <MdSchedule />,
  "1y": <MdDateRange />,
  custom: <MdEditCalendar />,
};

export const durationOptions: IconOption[] = withIcons(
  OPTION_VALUES.duration,
  durationIcons,
  <BsCalendar2WeekFill />,
);

export const paymentOptions: IconOption[] = withIcons(OPTION_VALUES.payment, {
  monthly: <FaMoneyBillWave />,
  quarterly: <FaMoneyBillWave />,
  semi: <FaMoneyBillWave />,
  yearly: <FaMoneyBillWave />,
});

export const residentialPropertyTypes: IconOption[] = withIcons(
  OPTION_VALUES.residentialProperty,
  {
    building: <HiBuildingOffice />,
    villa: <MdVilla />,
    compound: <FaBuilding />,
    tower: <HiBuildingOffice />,
    duplex: <HiHomeModern />,
    other: <MdHome />,
  },
);

export const residentialUnitTypes: IconOption[] = withIcons(
  OPTION_VALUES.residentialUnit,
  {
    apartment: <HiHomeModern />,
    floor: <MdLayers />,
    "driver-room": <FaCarAlt />,
    studio: <MdMeetingRoom />,
    villa: <MdVilla />,
    annex: <MdHome />,
    other: <MdEdit />,
  },
);

export const commercialPropertyTypes: IconOption[] = withIcons(
  OPTION_VALUES.commercialProperty,
  {
    building: <HiBuildingOffice />,
    villa: <MdVilla />,
    compound: <FaBuilding />,
    tower: <HiBuildingOffice />,
    land: <MdSquareFoot />,
    other: <MdHome />,
  },
);

export const commercialUnitTypes: IconOption[] = withIcons(
  OPTION_VALUES.commercialUnit,
  {
    shop: <FaStore />,
    office: <MdMeetingRoom />,
    warehouse: <FaWarehouse />,
    showroom: <MdStore />,
    land: <MdSquareFoot />,
    kiosk: <MdStore />,
    workshop: <MdWarehouse />,
    factory: <FaBuilding />,
    other: <MdEdit />,
  },
);

const floorIcons: Record<string, React.ReactNode> = {
  ground: <MdHome />,
  "1": <MdFilter1 />,
  "2": <MdFilter2 />,
  "3": <MdFilter3 />,
  "4": <MdFilter4 />,
  "5": <MdFilter5 />,
  "6": <MdFilter6 />,
  "7": <MdFilter7 />,
  "8": <MdFilter8 />,
  "9": <MdFilter9 />,
  "10": <MdFilter9Plus />,
  other: <MdEdit />,
};

export const floorOptions: IconOption[] = withIcons(
  OPTION_VALUES.floor,
  floorIcons,
);

export const countOptions = (icon: React.ReactNode, max = 10): IconOption[] => [
  ...Array.from({ length: max }, (_, i) => ({
    value: String(i + 1),
    label: String(i + 1),
    icon: ic(icon),
  })),
  { value: "other", label: "أخرى", icon: ic(<MdEdit />) },
];

export const cityOptions: IconOption[] = OPTION_VALUES.city.map((p) => ({
  ...p,
  icon: ic(<MdLocationOn />),
}));
