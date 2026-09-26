"use client";

import { type ObjectInputProps } from "sanity";
import { Card, Flex, Stack, Text } from "@sanity/ui";

type FeesValue = {
  residentialFirstGov?: number;
  residentialFirstCompany?: number;
  residentialExtraGov?: number;
  residentialExtraCompany?: number;
  commercialFirstGov?: number;
  commercialFirstCompany?: number;
  commercialExtraGov?: number;
  commercialExtraCompany?: number;
};

function num(v: unknown): number {
  return typeof v === "number" ? v : 0;
}

export function FeesInput(props: ObjectInputProps) {
  const value = (props.value ?? {}) as FeesValue;
  const residentialFirst =
    num(value.residentialFirstGov) + num(value.residentialFirstCompany);
  const residentialExtra =
    num(value.residentialExtraGov) + num(value.residentialExtraCompany);
  const commercialFirst =
    num(value.commercialFirstGov) + num(value.commercialFirstCompany);
  const commercialExtra =
    num(value.commercialExtraGov) + num(value.commercialExtraCompany);

  return (
    <Stack gap={3}>
      <Card padding={3} radius={2} shadow={1} tone="transparent">
        <Text size={1} weight="semibold">
          Yearly totals
        </Text>
        <Flex gap={4} wrap="wrap" marginTop={2}>
          <Stack gap={1}>
            <Text size={1} muted>
              Residential first year
            </Text>
            <Text size={2} weight="semibold">
              {residentialFirst} SAR
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text size={1} muted>
              Residential extra year
            </Text>
            <Text size={2} weight="semibold">
              {residentialExtra} SAR
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text size={1} muted>
              Commercial first year
            </Text>
            <Text size={2} weight="semibold">
              {commercialFirst} SAR
            </Text>
          </Stack>
          <Stack gap={1}>
            <Text size={1} muted>
              Commercial extra year
            </Text>
            <Text size={2} weight="semibold">
              {commercialExtra} SAR
            </Text>
          </Stack>
        </Flex>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  );
}

export default FeesInput;
