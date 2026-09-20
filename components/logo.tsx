import Image from "next/image";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src="/logo/logo.svg"
        alt="عقدكم"
        width={512}
        height={348}
        className="h-8 w-auto dark:hidden"
        priority
      />
      <Image
        src="/logo/logo-alt.svg"
        alt=""
        aria-hidden="true"
        width={512}
        height={348}
        className="hidden h-8 w-auto dark:block"
        priority
      />
      <span className="text-lg font-bold">عقدكم</span>
    </span>
  );
}
