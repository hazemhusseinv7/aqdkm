"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\admin\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { copyFieldValueAction } from "./sanity/lib/components/CopyFieldValueAction";
import { createNotifyPublishAction } from "./sanity/lib/notify-publish-action";
import { RtlTextInput } from "./sanity/lib/components/RtlTextInput";

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  form: {
    components: {
      input: RtlTextInput,
    },
  },
  document: {
    // Posts: first-ever publish also emails subscribers ("Publish &
    // notify"); edits publish silently. Other types keep default actions.
    // Zero webhooks involved - the action calls the app API same-origin.
    actions: (prev, context) =>
      context.schemaType === "post"
        ? prev.map((originalAction) =>
            originalAction.action === "publish"
              ? createNotifyPublishAction(originalAction)
              : originalAction,
          )
        : prev,
    unstable_fieldActions: (prev, context) =>
      context.documentType === "rentalRequest"
        ? [...prev, copyFieldValueAction]
        : prev,
  },
});
