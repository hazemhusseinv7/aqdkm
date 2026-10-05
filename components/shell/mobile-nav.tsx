"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal, PortalBackdrop } from "@/components/portal";
import { navLinks } from "@/components/shell/header";
import { ThemeToggle } from "@/components/shell/theme-toggle";

export function MobileNav({
  pathname,
  isActive,
  dark,
  mounted,
  onThemeChange,
}: {
  pathname: string;
  isActive: (pathname: string, href: string) => boolean;
  dark: boolean;
  mounted: boolean;
  onThemeChange: (dark: boolean) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="flex items-center gap-2 md:hidden">
      {mounted ? (
        <ThemeToggle checked={dark} onChange={onThemeChange} />
      ) : (
        <span
          aria-hidden="true"
          className="bg-default inline-block h-7 w-15.5 rounded-full"
        />
      )}
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label={open ? "إغلاق القائمة" : "فتح القائمة"}
        isIconOnly
        size="sm"
        variant="secondary"
        onPress={() => setOpen(!open)}
      >
        {open ? (
          <X className="size-4" aria-hidden="true" />
        ) : (
          <Menu className="size-4" aria-hidden="true" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-95 data-[slot=open]:animate-in ease-out",
              "size-full p-4",
            )}
            data-slot={open ? "open" : "closed"}
          >
            <div className="grid gap-y-2">
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center justify-start gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-alt/10 text-alt font-medium"
                        : "text-foreground/70 hover:text-foreground hover:bg-default",
                    )}
                  >
                    <Icon className="size-5 shrink-0" aria-hidden="true" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
