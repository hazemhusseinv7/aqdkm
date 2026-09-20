"use client";

import { useEffect } from "react";

/** Pushes the conversion event for GTM (Google Ads tracks the page URL itself). */
export function SuccessPing({
  requestNo,
  contractType,
  value,
}: {
  requestNo: string;
  contractType: string;
  value: number | null;
}) {
  useEffect(() => {
    const w = window as unknown as {
      dataLayer?: Array<Record<string, unknown>>;
    };
    w.dataLayer ??= [];
    w.dataLayer.push({
      event: "request_submitted",
      requestNo,
      contractType,
      value,
    });
  }, [requestNo, contractType, value]);
  return null;
}
