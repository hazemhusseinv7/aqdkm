"use client";

import { useToast } from "@sanity/ui/toast";
import { useEffect, useState } from "react";
import type { DocumentActionComponent, DocumentActionProps } from "sanity";

/**
 * Wraps the default publish action for posts: first-ever publishes also
 * email subscribers, edits publish silently.
 *
 * First publish is detected as "no published version exists yet" at click
 * time; completion is detected as "draft is gone" (documented Sanity
 * pattern). The broadcast itself stays idempotent via
 * broadcastSentAt/broadcastId flags, so retries and redeliveries are safe.
 */
export function createNotifyPublishAction(
  originalAction: DocumentActionComponent,
): DocumentActionComponent {
  return function NotifyPublishAction(props: DocumentActionProps) {
    const toast = useToast();
    const originalResult = originalAction(props);
    const [awaitingPublish, setAwaitingPublish] = useState(false);

    useEffect(() => {
      if (!awaitingPublish || props.draft) return;
      // Publish completed (draft is gone) - notify once.
      setAwaitingPublish(false);
      const token = process.env.NEXT_PUBLIC_BROADCAST_TOKEN;
      if (!token) {
        toast.push({
          status: "warning",
          title: "Published, but broadcast token is missing",
          description: "Set NEXT_PUBLIC_BROADCAST_TOKEN and rebuild.",
        });
        return;
      }
      fetch("/api/broadcast/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ postId: props.id, token }),
      })
        .then(async (res) => {
          const json = (await res.json().catch(() => null)) as {
            result?: { broadcastId?: string; skipped?: string };
            error?: string;
          } | null;
          if (!res.ok || !json || json.error) {
            throw new Error(json?.error ?? `HTTP ${res.status}`);
          }
          if (json.result?.broadcastId) {
            toast.push({
              status: "success",
              title: "Published - subscribers emailed",
            });
          } else {
            toast.push({
              status: "info",
              title: "Published - no email sent",
              description: `Broadcast skipped (${json.result?.skipped ?? "unknown reason"}).`,
            });
          }
        })
        .catch((err: unknown) => {
          toast.push({
            status: "error",
            title: "Published - email failed",
            description: err instanceof Error ? err.message : "Retry publish.",
          });
        });
    }, [awaitingPublish, props.draft, props.id, toast]);

    // Hooks above run unconditionally; hiding the action is safe here.
    if (!originalResult) return null;

    const isFirstPublish = !props.published;

    return {
      ...originalResult,
      label: isFirstPublish ? "Publish & notify" : originalResult.label,
      onHandle: () => {
        if (isFirstPublish && !originalResult.disabled) {
          setAwaitingPublish(true);
        }
        originalResult.onHandle?.();
      },
    };
  };
}
