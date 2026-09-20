"use client";

import { set, type StringInputProps } from "sanity";
import { Button, Flex, Stack } from "@sanity/ui";
import { MdDrafts, MdInbox, MdMail, MdReply } from "react-icons/md";

const META: Record<
  string,
  { tone: "caution" | "default" | "positive"; icon: typeof MdMail }
> = {
  new: { tone: "caution", icon: MdInbox },
  read: { tone: "default", icon: MdDrafts },
  replied: { tone: "positive", icon: MdReply },
};

export function StatusTabs(props: StringInputProps) {
  const value = props.value;
  const options =
    props.schemaType?.options?.list
      ?.map((o) => (typeof o === "string" ? { title: o, value: o } : o))
      .filter(
        (o): o is { title: string; value: string } =>
          typeof o?.value === "string",
      ) ?? [];

  return (
    <Stack gap={2}>
      <Flex wrap="wrap" gap={2}>
        {options.map((option) => {
          const meta = META[option.value];
          const Icon = meta?.icon ?? MdMail;
          const selected = value === option.value;
          return (
            <Button
              key={option.value}
              type="button"
              mode={selected ? "default" : "ghost"}
              tone={selected ? (meta?.tone ?? "positive") : "default"}
              icon={Icon}
              text={option.title}
              selected={selected}
              onClick={() => props.onChange?.(set(option.value))}
            />
          );
        })}
      </Flex>
    </Stack>
  );
}

export default StatusTabs;
