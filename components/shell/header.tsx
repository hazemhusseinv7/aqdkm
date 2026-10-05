"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { SiHomepage } from "react-icons/si";
import { FaBuilding, FaHome } from "react-icons/fa";
import { HiNewspaper, HiTicket } from "react-icons/hi2";
import { MdMail } from "react-icons/md";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { ThemeToggle } from "@/components/shell/theme-toggle";
import { MobileNav } from "@/components/shell/mobile-nav";
import { playThemeTransition } from "@/lib/theme-transition";

export const navLinks = [
  { label: "الرئيسية", href: "/", icon: SiHomepage },
  { label: "عقد سكني", href: "/residential", icon: FaHome },
  { label: "عقد تجاري", href: "/commercial", icon: FaBuilding },
  { label: "المدونة", href: "/blog", icon: HiNewspaper },
  { label: "تتبع الطلب", href: "/track", icon: HiTicket },
  { label: "تواصل", href: "/contact", icon: MdMail },
];

export function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const scrolled = useScroll(10);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-only mount flag (theme unknown during SSR)
    setMounted(true);
  }, []);

  useEffect(() => {
    if (resolvedTheme) {
      document.documentElement.dataset.theme = resolvedTheme;
    }
  }, [resolvedTheme]);

  const dark = mounted ? resolvedTheme === "dark" : false;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 mx-auto w-full max-w-4xl border-b border-transparent md:rounded-md md:border md:transition-all md:ease-out",
        {
          "border-border bg-background/95 supports-backdrop-filter:bg-background/50 backdrop-blur-sm md:top-2 md:max-w-200 md:shadow":
            scrolled,
        },
      )}
    >
      <nav
        className={cn(
          "flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
          {
            "md:px-2": scrolled,
          },
        )}
      >
        <Link
          className="rounded-md px-2"
          href="/"
          aria-label="عقدكم - الرئيسية"
        >
          <Logo />
        </Link>
        <div className="hidden items-center gap-2 md:flex">
          <div>
            {navLinks.map((link) => {
              const active = isActive(pathname, link.href);
              const Icon = link.icon;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm whitespace-nowrap transition-colors",
                    active
                      ? "bg-accent/10 text-accent dark:bg-alt/10 dark:text-alt font-medium"
                      : "text-foreground/70 hover:text-foreground hover:bg-default",
                  )}
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {link.label}
                </Link>
              );
            })}
          </div>
          {mounted ? (
            <ThemeToggle
              checked={dark}
              onChange={(v) =>
                playThemeTransition(() => setTheme(v ? "dark" : "light"))
              }
            />
          ) : (
            <span
              aria-hidden="true"
              className="bg-default inline-block h-7 w-15.5 rounded-full"
            />
          )}
        </div>
        <MobileNav
          pathname={pathname}
          isActive={isActive}
          dark={dark}
          mounted={mounted}
          onThemeChange={(v) =>
            playThemeTransition(() => setTheme(v ? "dark" : "light"))
          }
        />
      </nav>
    </header>
  );
}
