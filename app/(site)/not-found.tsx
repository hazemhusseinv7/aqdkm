import type { Metadata } from "next";
import { NotFoundCard } from "@/components/shell/not-found-card";

export const metadata: Metadata = {
  title: "404 - الصفحة غير موجودة",
  description: "الصفحة التي تبحث عنها ربما نُقلت أو غير موجودة.",
};

export default function SiteNotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
      <NotFoundCard />
    </div>
  );
}
