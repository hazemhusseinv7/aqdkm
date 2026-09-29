import type { ReactElement } from "react";
import type { InputProps } from "sanity";

export function RtlPortableTextInput(props: InputProps): ReactElement {
  return (
    <div className="rtl-portable-text-input">
      <style>{`
        .rtl-portable-text-input [contenteditable="true"] {
          direction: rtl;
          text-align: right;
        }
      `}</style>
      {props.renderDefault(props)}
    </div>
  );
}
