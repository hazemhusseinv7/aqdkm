import Link from "next/link";
import { FaBuilding, FaHome } from "react-icons/fa";

export function SplitCta() {
  return (
    <div className="bg-primary text-primary-foreground flex w-full items-stretch overflow-hidden rounded-2xl shadow-xs sm:w-auto">
      <Link
        href="/residential"
        className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-overlay/10 focus-visible:bg-overlay/10 sm:min-w-32 sm:px-6"
      >
        <FaHome className="size-4" />
        طلب سكني
      </Link>
      <span aria-hidden="true" className="bg-primary-foreground/30 w-px" />
      <Link
        href="/commercial"
        className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors outline-none hover:bg-overlay/10 focus-visible:bg-overlay/10 sm:min-w-32 sm:px-6"
      >
        <FaBuilding className="size-4" />
        طلب تجاري
      </Link>
    </div>
  );
}
