"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\app\admin\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { codeInput } from "@sanity/code-input";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./sanity/env";
import { schema } from "./sanity/schemaTypes";
import { structure } from "./sanity/structure";
import { copyFieldValueAction } from "./sanity/lib/components/CopyFieldValueAction";
import { AdvancedRequestsTool } from "./sanity/lib/components/AdvancedRequestsTool";
import { createNotifyPublishAction } from "./sanity/lib/notify-publish-action";
import { RtlTextInput } from "./sanity/lib/components/RtlTextInput";

// Personal-data document types, stored as drafts only (see the comment in
// document.actions below).
const PRIVATE_DOC_TYPES: readonly string[] = [
  "rentalRequest",
  "subscriber",
  "contactMessage",
];

export default defineConfig({
  basePath: "/admin",
  projectId,
  dataset,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    codeInput(),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: [
    {
      name: "advanced",
      title: "Advanced",
      component: AdvancedRequestsTool,
    },
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
    //
    // rentalRequest/subscriber/contactMessage contain personal data and the
    // dataset is publicly readable on the Free plan, so they must ONLY ever
    // exist as drafts (anonymous API readers cannot see drafts, verified).
    // The server write path creates drafts directly; here we remove the
    // publish/unpublish actions so nothing can flip them into the
    // publicly-readable published state, ever.
    actions: (prev, context) => {
      if (context.schemaType === "post") {
        return prev.map((originalAction) =>
          originalAction.action === "publish"
            ? createNotifyPublishAction(originalAction)
            : originalAction,
        );
      }
      if (PRIVATE_DOC_TYPES.includes(context.schemaType)) {
        return prev.filter(
          (originalAction) =>
            originalAction.action !== "publish" &&
            originalAction.action !== "unpublish",
        );
      }
      return prev;
    },
    unstable_fieldActions: (prev, context) =>
      context.documentType === "rentalRequest"
        ? [...prev, copyFieldValueAction]
        : prev,
  },
});
