"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [open]);

  if (status === "loading") {
    return (
      <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
    );
  }

  if (!session?.user) {
    const loginHref = `/login?callbackUrl=${encodeURIComponent(pathname || "/shop")}`;

    return (
      <Link
        href={loginHref}
        className="rounded-full border border-neutral-200 px-3 py-1 text-[0.7rem] font-medium uppercase tracking-wide transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:border-neutral-500 dark:hover:bg-neutral-900"
      >
        Sign in
      </Link>
    );
  }

  const isAdmin = (session.user as any).role === "admin";

  async function handleLogout() {
    setLoading(true);
    await signOut({ redirect: false });
    setLoading(false);
    setOpen(false);
    router.refresh();
  }

  const displayName = session.user.name || session.user.email;

  return (
    <div className="relative text-xs" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-neutral-200 bg-white px-3 py-1 text-[0.7rem] font-medium uppercase transition hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-neutral-500 dark:hover:bg-neutral-800"
      >
        <span className="hidden max-w-[140px] truncate text-neutral-700 sm:inline dark:text-neutral-200">
          {displayName}
        </span>
        <span className="inline text-neutral-700 sm:hidden dark:text-neutral-200">
          Account
        </span>
        <span className="text-[0.6rem] text-neutral-400 dark:text-neutral-500">
          ▼
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-44 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {isAdmin && (
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block rounded-md px-2 py-1.5 text-neutral-700 hover:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800"
            >
              Admin dashboard
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="mt-0.5 block w-full rounded-md px-2 py-1.5 text-left text-red-500 hover:bg-red-50 disabled:opacity-60 dark:hover:bg-neutral-800"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      )}
    </div>
  );
}
