import { Breadcrumbs, Card, Typography } from "@heroui/react";
import { TrackForm } from "@/components/track/track-form";

export const metadata = {
  title: "تتبع الطلب",
  description: "استعلم عن حالة طلب توثيق عقد الإيجار برقم الطلب",
};

export default function TrackPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Breadcrumbs>
        <Breadcrumbs.Item href="/">الرئيسية</Breadcrumbs.Item>
        <Breadcrumbs.Item>تتبع الطلب</Breadcrumbs.Item>
      </Breadcrumbs>

      <div className="flex flex-col items-start gap-2">
        <Typography type="h1" weight="bold">
          تتبع الطلب
        </Typography>
        <Typography type="body" color="muted">
          أدخل رقم الطلب المرسل إليك لعرض حالته الحالية.
        </Typography>
      </div>

      <div className="mx-auto w-full max-w-2xl">
        <Card>
          <Card.Header>
            <div>
              <h2 className="text-foreground text-sm leading-6 font-medium">
                الاستعلام برقم الطلب
              </h2>
              <Card.Description>
                ستظهر حالة الطلب والرسوم التقديرية دون أي بيانات شخصية.
              </Card.Description>
            </div>
          </Card.Header>
          <Card.Content>
            <TrackForm />
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
