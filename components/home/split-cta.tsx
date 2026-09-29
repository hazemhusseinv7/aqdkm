import Link from "next/link";
import { FaBuilding, FaHome } from "react-icons/fa";
import { Price } from "@/components/price";
import { CurrencyText } from "@/lib/currency-text";

export type CtaFees = {
  note?: string | null;
  resFrom?: number | null;
  comFrom?: number | null;
};

function FeeNote({
  note,
  amount,
}: {
  note?: string | null;
  amount?: number | null;
}) {
  if (amount == null || !note?.trim()) return null;
  return (
    <span className="text-primary-foreground/70 flex items-center justify-center gap-1 px-2 pt-1.5 text-xs">
      <span>
        <CurrencyText text={note} />
      </span>
      <Price value={amount} iconClassName="size-3.5" />
    </span>
  );
}

export function SplitCta({ ctaFees }: { ctaFees?: CtaFees | null }) {
  return (
    <div className="bg-primary text-primary-foreground flex w-full items-stretch overflow-hidden rounded-2xl shadow-xs sm:w-auto">
      <Link
        href="/residential"
        className="hover:bg-overlay/10 focus-visible:bg-overlay/10 flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-2.5 transition-colors outline-none sm:min-w-32 sm:px-6"
      >
        <span className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
          <FaHome className="size-4" />
          طلب سكني
        </span>
        <FeeNote note={ctaFees?.note} amount={ctaFees?.resFrom} />
      </Link>
      <span aria-hidden="true" className="bg-primary-foreground/30 w-px" />
      <Link
        href="/commercial"
        className="hover:bg-overlay/10 focus-visible:bg-overlay/10 flex min-w-0 flex-1 flex-col items-center justify-center px-4 py-2.5 transition-colors outline-none sm:min-w-32 sm:px-6"
      >
        <span className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
          <FaBuilding className="size-4" />
          طلب تجاري
        </span>
        <FeeNote note={ctaFees?.note} amount={ctaFees?.comFrom} />
      </Link>
    </div>
  );
}
