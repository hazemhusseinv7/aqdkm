"use client";

import type { ReactNode } from "react";
import { TextArea, TextInput } from "@sanity/ui";
import type { InputProps, StringInputProps } from "sanity";

function isTextualInput(props: InputProps): props is StringInputProps {
  const name = (props as StringInputProps).schemaType?.type?.name;
  return name === "string" || name === "text";
}

export function RtlTextInput(props: InputProps): ReactNode {
  if (!isTextualInput(props)) {
    return props.renderDefault(props);
  }
  const { schemaType } = props;
  const hasOwnInput = !!schemaType.components?.input;
  const hasListOptions = Array.isArray(
    (schemaType.options as unknown as { list?: unknown } | undefined)?.list,
  );
  if (hasOwnInput || hasListOptions || !props.elementProps) {
    return props.renderDefault(props);
  }
  const { elementProps, validationError } = props;
  if (schemaType.type?.name === "text") {
    const rows = (schemaType as unknown as { rows?: unknown }).rows;
    return (
      <TextArea
        {...elementProps}
        rows={typeof rows === "number" ? rows : 10}
        dir="auto"
        customValidity={validationError}
      />
    );
  }
  return (
    <TextInput
      {...elementProps}
      dir="auto"
      customValidity={validationError}
      data-testid="string-input"
    />
  );
}
