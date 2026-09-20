"use client";

import {
  TextField,
  InputGroup,
  Label,
  Description,
  FieldError,
  NumberField,
  Select,
  ListBox,
  CheckboxGroup,
  Checkbox,
  Switch,
  Slider,
} from "@heroui/react";
import { FieldLabel } from "@/components/ui/field-label";
import { FieldMessage } from "@/components/ui/field-message";
import { WheelDatePicker } from "./wheel-date-picker";
import type { CalendarDate } from "@internationalized/date";
import type { IconOption } from "@/lib/options";

export function IconText({
  label,
  icon,
  tooltip,
  helpTitle,
  helpText,
  description,
  error,
  required,
  ...inputProps
}: {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  helpTitle?: string;
  helpText?: string;
  description?: string;
  error?: string | null;
  required?: boolean;
  value: string;
  onChange: (v: string) => void;
  name?: string;
  placeholder?: string;
  inputMode?: "text" | "numeric" | "tel";
  dir?: "ltr" | "rtl";
}) {
  const { value, onChange, name, placeholder, inputMode, dir } = inputProps;
  const invalid = !!error;
  return (
    <TextField
      fullWidth
      isInvalid={invalid}
      isRequired={required}
      name={name}
      value={value}
      onChange={onChange}
      className="min-w-0"
    >
      <FieldLabel
        icon={icon}
        tooltip={tooltip}
        helpTitle={helpTitle}
        helpText={helpText}
      >
        {label}
      </FieldLabel>
      <InputGroup className="w-full min-w-0">
        <InputGroup.Input
          className="min-w-0 flex-1"
          placeholder={placeholder}
          inputMode={inputMode}
          dir={dir}
        />
      </InputGroup>
      {invalid ? (
        <FieldError>{error}</FieldError>
      ) : description ? (
        <Description>{description}</Description>
      ) : null}
    </TextField>
  );
}

export function IconSelect({
  label,
  icon,
  tooltip,
  description,
  error,
  options,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  description?: string;
  error?: string | null;
  options: IconOption[];
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <span aria-hidden="true">
        <FieldLabel icon={icon} tooltip={tooltip}>
          {label}
        </FieldLabel>
      </span>
      <Select
        className="w-full min-w-0"
        aria-label={label}
        placeholder={placeholder ?? "اختر…"}
        selectedKey={value || null}
        isRequired={required}
        isInvalid={!!error}
        onSelectionChange={(key) => onChange(String(key ?? ""))}
      >
        <Select.Trigger>
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {options.map((o) => (
              <ListBox.Item key={o.value} id={o.value} textValue={o.label}>
                <span className="flex items-center gap-2">
                  <span className="text-accent">{o.icon}</span>
                  <Label>{o.label}</Label>
                </span>
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>
      {error ? (
        <FieldMessage>{error}</FieldMessage>
      ) : description ? (
        <Description>{description}</Description>
      ) : null}
    </div>
  );
}

export function IconNumber({
  label,
  icon,
  tooltip,
  description,
  error,
  value,
  onChange,
  min = 0,
  max,
  suffix,
  required,
}: {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  description?: string;
  error?: string | null;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  required?: boolean;
}) {
  return (
    <NumberField
      fullWidth
      minValue={min}
      maxValue={max}
      value={value || 0}
      onChange={(v) => onChange(typeof v === "number" ? v : 0)}
      isInvalid={!!error}
      isRequired={required}
      className="min-w-0"
    >
      <FieldLabel icon={icon} tooltip={tooltip}>
        {label}
        {suffix ? ` (${suffix})` : ""}
      </FieldLabel>
      <NumberField.Group className="w-full min-w-0">
        <NumberField.DecrementButton />
        <NumberField.Input className="min-w-0 flex-1" />
        <NumberField.IncrementButton />
      </NumberField.Group>
      {error ? (
        <FieldError>{error}</FieldError>
      ) : description ? (
        <Description>{description}</Description>
      ) : null}
    </NumberField>
  );
}

export function IconDate({
  label,
  icon,
  tooltip,
  description,
  value,
  onChange,
  error,
  minYear,
  maxYear,
}: {
  label: string;
  icon?: React.ReactNode;
  tooltip?: string;
  name: string;
  description?: string;
  value?: CalendarDate | null;
  onChange?: (v: CalendarDate | null) => void;
  required?: boolean;
  error?: string | null;
  minYear?: number;
  maxYear?: number;
}) {
  const invalid = !!error;
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <FieldLabel icon={icon} tooltip={tooltip}>
        {label}
      </FieldLabel>
      <div
        aria-invalid={invalid}
        className={
          invalid ? "rounded-2xl ring-2 ring-[var(--danger)]" : undefined
        }
      >
        <WheelDatePicker
          label={label}
          value={value ?? null}
          onChange={(v) => onChange?.(v)}
          minYear={minYear}
          maxYear={maxYear}
        />
      </div>
      {error ? (
        <FieldMessage>{error}</FieldMessage>
      ) : description ? (
        <Description>{description}</Description>
      ) : null}
    </div>
  );
}

export function IconSwitch({
  label,
  icon,
  description,
  checked,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="border-border bg-surface-secondary/60 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3">
      <span className="flex items-center gap-2 text-sm font-medium">
        {icon ? <span className="text-accent text-lg">{icon}</span> : null}
        {label}
      </span>
      <Switch aria-label={label} isSelected={checked} onChange={onChange}>
        <Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Content>
      </Switch>
      {description ? <span className="sr-only">{description}</span> : null}
    </div>
  );
}

export function IconChecks({
  label,
  icon,
  options,
  values,
  onChange,
}: {
  label: string;
  icon?: React.ReactNode;
  options: { value: string; label: string; icon: React.ReactNode }[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  return (
    <CheckboxGroup value={values} onChange={onChange}>
      <FieldLabel icon={icon}>{label}</FieldLabel>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => (
          <Checkbox key={o.value} value={o.value}>
            <Checkbox.Content>
              <Checkbox.Control>
                <Checkbox.Indicator />
              </Checkbox.Control>
              <span className="flex items-center gap-1.5 text-sm">
                <span className="text-accent">{o.icon}</span>
                {o.label}
              </span>
            </Checkbox.Content>
          </Checkbox>
        ))}
      </div>
    </CheckboxGroup>
  );
}

export function DurationSlider({
  months,
  onChange,
}: {
  months: number;
  onChange: (m: number) => void;
}) {
  return (
    <Slider
      aria-label="مدة العقد بالأشهر"
      minValue={1}
      maxValue={120}
      value={[months]}
      onChange={(v) => onChange((Array.isArray(v) ? v[0] : v) as number)}
    >
      <Slider.Output>{months} شهر</Slider.Output>
      <Slider.Track>
        <Slider.Fill className="right-0 left-auto rounded-s-xl" />
        <Slider.Thumb />
      </Slider.Track>
    </Slider>
  );
}
