"use client";

import { set, type StringInputProps } from "sanity";
import { Button, Flex, Stack, Text } from "@sanity/ui";
import { SOCIAL_PLATFORMS } from "@/sanity/lib/socialPlatforms";

const OPTION_ORDER = Object.keys(SOCIAL_PLATFORMS);

export function PlatformSelect(props: StringInputProps) {
  const value = props.value;
  const options =
    props.schemaType?.options?.list?.map((o) =>
      typeof o === "string" ? o : o.value,
    ) ?? [];

  const selectable: string[] =
    options.length > 0
      ? (options.filter((o): o is string => typeof o === "string") as string[])
      : OPTION_ORDER;

  return (
    <Stack gap={2}>
      <Text size={1} muted>
        Select a social platform
      </Text>
      <Flex wrap="wrap" gap={2}>
        {selectable.map((platform) => {
          const meta = SOCIAL_PLATFORMS[platform];
          if (!meta) return null;
          const Icon = meta.icon;
          const selected = value === platform;
          return (
            <Button
              key={platform}
              type="button"
              mode={selected ? "default" : "ghost"}
              tone={selected ? "positive" : "default"}
              icon={Icon}
              text={meta.title}
              selected={selected}
              onClick={() => props.onChange?.(set(platform))}
            />
          );
        })}
      </Flex>
    </Stack>
  );
}

export default PlatformSelect;
