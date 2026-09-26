"use client";

import { Card } from "@heroui/react";

export function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="secondary">
      <Card.Header>
        <span className="bg-accent/10 text-accent flex size-10 shrink-0 items-center justify-center rounded-xl text-xl">
          {icon}
        </span>
        <div className="min-w-0">
          <Card.Title>{title}</Card.Title>
          {description ? (
            <Card.Description>{description}</Card.Description>
          ) : null}
        </div>
      </Card.Header>
      <Card.Content className="flex min-w-0 flex-col gap-4">
        {children}
      </Card.Content>
    </Card>
  );
}
