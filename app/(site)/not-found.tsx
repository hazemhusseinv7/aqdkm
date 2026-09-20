import Link from "next/link";
import { Card } from "@heroui/react";
import { MdSearchOff } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6">
      <Card variant="secondary" className="mx-auto max-w-2xl text-center">
        <Card.Header className="flex-col items-center gap-2 pt-8">
          <span className="bg-accent/15 text-accent flex size-14 items-center justify-center rounded-full">
            <MdSearchOff className="size-8" />
          </span>
          <h1 className="text-foreground text-sm leading-6 font-medium">الصفحة غير موجودة</h1>
          <Card.Description>
            الرابط الذي تحاول الوصول إليه غير متوفر أو تم نقله.
          </Card.Description>
        </Card.Header>
        <Card.Footer className="justify-center pb-8">
          <Link
            href="/"
            className="bg-primary text-primary-foreground inline-flex h-10 items-center justify-center gap-2 rounded-3xl px-4 text-sm font-medium whitespace-nowrap transition-transform outline-none hover:brightness-110 focus-visible:brightness-110 active:scale-[0.98]"
          >
            العودة إلى الرئيسية
          </Link>
        </Card.Footer>
      </Card>
    </div>
  );
}
