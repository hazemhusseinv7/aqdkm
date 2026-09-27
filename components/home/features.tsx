import { Typography } from "@heroui/react";
import { Card } from "@heroui/react";
import { featureIcon } from "@/components/home/section-icons";

export type FeatureItem = {
  _key: string;
  title: string;
  description: string;
  icon: string | null;
};

export function Features({ items }: { items: FeatureItem[] }) {
  if (items.length === 0) {
    return null;
  }
  return (
    <section className="mb-14 flex flex-col gap-4">
      <div className="flex flex-col items-start gap-2">
        <Typography type="h2" weight="bold">
          لماذا عقدكم؟
        </Typography>
        <Typography type="body" color="muted">
          كل ما تحتاجه لتقديم طلب توثيق عقدك دون مراجعة أي جهة.
        </Typography>
      </div>
      <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
        {items.map((f) => {
          const Icon = featureIcon(f.icon);
          return (
            <Card key={f._key} variant="default">
              <Card.Header className="gap-3">
                <span className="bg-accent text-accent-foreground flex size-12 shrink-0 items-center justify-center rounded-2xl">
                  <Icon className="size-6" />
                </span>
                <Card.Title>{f.title}</Card.Title>
              </Card.Header>
              <Card.Content>
                <Card.Description>{f.description}</Card.Description>
              </Card.Content>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
