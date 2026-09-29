import type { ReactElement } from "react";
import type { InputProps } from "sanity";

export function RtlTextFieldInput(props: InputProps): ReactElement {
  return (
    <div className="rtl-text-field-input">
      <style>{`
        .rtl-text-field-input textarea,
        .rtl-text-field-input input[type="text"],
        .rtl-text-field-input input:not([type]) {
          direction: rtl;
          text-align: right;
        }
      `}</style>
      {props.renderDefault(props)}
    </div>
  );
}
