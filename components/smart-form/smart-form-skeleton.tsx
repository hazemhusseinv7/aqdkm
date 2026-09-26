"use client";

import { Fragment } from "react";
import { Card, Skeleton } from "@heroui/react";

const STEPS = 6;

function RoleCardSkeleton() {
  return (
    <div className="border-border bg-surface flex min-w-0 flex-col gap-4 rounded-3xl border p-4">
      <div className="flex min-w-0 items-center gap-3">
        <Skeleton className="size-11 shrink-0 rounded-2xl" />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
        </div>
      </div>
      <Skeleton className="h-8 w-20 rounded-full" />
    </div>
  );
}

export function SmartFormSkeleton() {
  return (
    <>
      <span role="status" className="sr-only">
        جارٍ تحميل النموذج…
      </span>
      <div aria-hidden="true" className="mx-auto w-full max-w-5xl">
        <Card className="p-4 sm:p-6">
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

            <Skeleton className="h-px w-full" />

            <div className="flex min-w-0 flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-full" />
                <Skeleton className="h-7 w-40 rounded-lg" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <RoleCardSkeleton />
                <RoleCardSkeleton />
              </div>
            </div>

            <div className="border-border bg-surface-secondary/50 flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-3">
              <Skeleton className="h-10 w-28 rounded-3xl md:h-9" />
              <Skeleton className="h-10 w-28 rounded-3xl md:h-9" />
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}
