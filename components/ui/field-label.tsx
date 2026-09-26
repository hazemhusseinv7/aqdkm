"use client";

import { Label, Tooltip, Popover } from "@heroui/react";
import { MdInfo } from "react-icons/md";

export function FieldLabel({
  icon,
  children,
  tooltip,
  helpTitle,
  helpText,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  tooltip?: string;
  helpTitle?: string;
  helpText?: string;
}) {
  const labelContent = (
    <span className="inline-flex items-center gap-1.5">
      {icon ? <span className="text-accent text-base">{icon}</span> : null}
      <Label>{children}</Label>
      {tooltip || helpText ? (
        <span className="text-muted">
          <MdInfo className="size-4" />
        </span>
      ) : null}
    </span>
  );

  if (helpText) {
    return (
      <Popover>
        <Popover.Trigger aria-label="مساعدة">{labelContent}</Popover.Trigger>
        <Popover.Content className="max-w-64" placement="top">
          <Popover.Dialog>
            <Popover.Arrow />
            <Popover.Heading>{helpTitle ?? children}</Popover.Heading>
            <p className="text-muted mt-1 text-sm">{helpText}</p>
          </Popover.Dialog>
        </Popover.Content>
      </Popover>
    );
  }

  if (tooltip) {
    return (
      <Tooltip delay={0}>
        <Tooltip.Trigger>{labelContent}</Tooltip.Trigger>
        <Tooltip.Content showArrow>
          <Tooltip.Arrow />
          <p>{tooltip}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  return labelContent;
}
