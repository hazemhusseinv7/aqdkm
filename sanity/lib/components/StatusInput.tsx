"use client";

import { type StringInputProps } from "sanity";
import { Badge, Flex, Stack } from "@sanity/ui";

export function StatusInput(props: StringInputProps) {
  const configured = !!props.value;

  return (
    <Stack gap={2}>
      <Flex>
        <Badge tone={configured ? "positive" : "default"}>
          {configured ? "Configured" : "Not set"}
        </Badge>
      </Flex>
      {props.renderDefault(props)}
    </Stack>
  );
}

export default StatusInput;
