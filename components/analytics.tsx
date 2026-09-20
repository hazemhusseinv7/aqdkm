import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export type AnalyticsSettings = {
  gaMeasurementId: string | null;
  gtmId: string | null;
} | null;

export function Analytics({ settings }: { settings: AnalyticsSettings }) {
  return (
    <>
      {settings?.gaMeasurementId && (
        <GoogleAnalytics gaId={settings.gaMeasurementId} />
      )}
      {settings?.gtmId && <GoogleTagManager gtmId={settings.gtmId} />}
    </>
  );
}
