"use client";

import Link from "next/link";
import { clsx } from "clsx";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const items = [
    { href: "/admin", label: "Manage" },
    { href: "/admin/stats", label: "Stats" },
  ];

  return (
    <nav className="mb-6 flex gap-2 text-xs font-medium">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              "rounded-full border px-3 py-1.5 transition",
              active
                ? "border-neutral-900 bg-neutral-900 text-white dark:border-white dark:bg-white dark:text-black"
                : "border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:text-neutral-300 dark:hover:border-neutral-600 dark:hover:bg-neutral-900",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

