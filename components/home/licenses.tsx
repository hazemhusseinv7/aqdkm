import { Card, Chip, Typography } from "@heroui/react";
import { MdBadge, MdOpenInNew } from "react-icons/md";
import { CurrencyText } from "@/lib/currency-text";
import { licenseIcon } from "@/components/home/section-icons";

export type LicenseItem = {
  _key: string;
  title: string;
  issuer: string;
  description: string;
  number: string | null;
  icon: string | null;
};

export function Licenses({
  items,
  regaUrl,
}: {
  items: LicenseItem[];
  regaUrl?: string | null;
}) {
  if (items.length === 0) {
    return null;
  }
  return (
    <section className="mb-14 flex flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <Typography type="h2" weight="bold">
          تراخيصنا واعتماداتنا
        </Typography>
        <Typography type="body" color="muted">
          نعمل وفق الأنظمة والتراخيص المعتمدة في القطاع العقاري.
        </Typography>
      </div>
      <div className="grid gap-2 md:grid-cols-3">
        {items.map((l) => {
          const Icon = licenseIcon(l.icon);
          return (
            <Card key={l._key} variant="default">
              <Card.Header className="gap-3">
                <span className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-2xl">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <Card.Title>{l.title}</Card.Title>
                  <Card.Description>{l.issuer}</Card.Description>
                </div>
                <Chip color="success" variant="soft" className="ms-auto">
                  <MdBadge aria-hidden="true" /> معتمد
                </Chip>
              </Card.Header>
              <Card.Content className="gap-2">
                <Card.Description>
                  <CurrencyText text={l.description} />
                </Card.Description>
                {l.number && (
                  <p className="text-sm font-medium">
                    رقم الترخيص: <span dir="ltr">{l.number}</span>
                  </p>
                )}
              </Card.Content>
            </Card>
          );
        })}
      </div>
      {regaUrl && (
        <a
          href={regaUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-accent inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          تحقق من التراخيص عبر الهيئة العامة للعقار
          <MdOpenInNew className="size-4" aria-hidden="true" />
        </a>
      )}
    </section>
  );
}
