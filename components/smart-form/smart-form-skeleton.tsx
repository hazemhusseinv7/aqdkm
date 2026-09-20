"use client";

import { Fragment } from "react";
import { Skeleton } from "@heroui/react";

const STEPS = 6;

export function SmartFormSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        جارٍ تحميل النموذج…
      </span>
      <div
        aria-hidden="true"
        className="grid gap-6 lg:grid-cols-[1fr_320px]"
      >
        <div className="flex min-w-0 flex-col gap-5">
          <div className="hidden min-w-0 flex-col gap-4 sm:flex">
            <div className="flex items-start">
              {Array.from({ length: STEPS }).map((_, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className="bg-default mx-1 mt-5 h-0.5 flex-1 rounded-full" />
                  )}
                  <div className="flex min-w-0 flex-1 flex-col items-center gap-1.5">
                    <Skeleton className="size-10 rounded-full" />
                    <Skeleton className="hidden h-4 w-12 rounded-full md:block" />
                  </div>
                </Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-48 rounded-full" />
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-3 sm:hidden">
            <div className="flex min-w-0 items-center gap-3">
              <Skeleton className="size-11 shrink-0 rounded-2xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-5 w-32 rounded-full" />
                <Skeleton className="h-4 w-44 rounded-full" />
              </div>
              <Skeleton className="h-6 w-20 shrink-0 rounded-full" />
            </div>
            <div className="flex items-center gap-1.5 py-4">
              {Array.from({ length: STEPS }).map((_, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <span className="bg-default h-0.5 w-4 shrink-0 rounded-full" />
                  )}
                  <Skeleton className="size-8 shrink-0 rounded-full" />
                </Fragment>
              ))}
            </div>
          </div>

          <div className="flex min-w-0 flex-col gap-4">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-44 rounded-3xl" />
              <Skeleton className="h-44 rounded-3xl" />
            </div>
          </div>

          <div className="border-border bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3">
            <Skeleton className="h-10 w-28 rounded-3xl md:h-9" />
            <Skeleton className="h-10 w-28 rounded-3xl md:h-9" />
          </div>
        </div>

        <div className="hidden min-w-0 self-start lg:block">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="border-border flex flex-col gap-3 rounded-3xl border p-5">
              <Skeleton className="h-6 w-36 rounded-lg" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-4 w-full rounded-full" />
              <Skeleton className="h-px w-full" />
              <Skeleton className="h-14 w-full rounded-2xl" />
            </div>
            <div className="border-border flex items-center gap-3 rounded-3xl border p-4">
              <Skeleton className="size-9 shrink-0 rounded-xl" />
              <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-3 w-40 rounded-full" />
              </div>
            </div>
          </div>
        </div>

        <div className="sticky bottom-3 z-30 lg:hidden">
          <Skeleton className="h-10 w-full rounded-3xl" />
        </div>
      </div>
    </>
  );
}
