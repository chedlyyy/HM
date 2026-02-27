import Footer from "components/layout/footer";
import { UserMenu } from "components/auth/UserMenu";
import { AuthProvider } from "components/auth/AuthProvider";
import { CartProvider } from "components/cart/CartContext";
import { CartDrawer } from "components/cart/CartDrawer";
import { CartIcon } from "components/cart/CartIcon";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, Suspense } from "react";
import "./globals.css";
import { baseUrl } from "lib/utils";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white">
        <AuthProvider>
          <CartProvider>
            <div className="flex min-h-screen flex-col">
              <header className="relative z-50 border-b border-neutral-200 bg-white/80 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-8">
                  <div className="flex items-center gap-3 md:gap-6">
                    <Link href="/" className="flex items-center gap-2">
                      <Image
                        src="/logo.png"
                        alt="Hamdi Shop"
                        width={28}
                        height={28}
                        className="h-7 w-7 object-contain"
                      />
                      <span className="text-sm font-semibold tracking-tight md:text-base">
                        Hamdi Shop
                      </span>
                    </Link>
                    <nav className="hidden items-center gap-4 text-xs font-medium text-neutral-600 md:flex md:text-sm dark:text-neutral-300">
                      <Link
                        href="/shop"
                        className="transition hover:text-black dark:hover:text-white"
                      >
                        All
                      </Link>
                      <Link
                        href="/shop/merch"
                        className="transition hover:text-black dark:hover:text-white"
                      >
                        Merch
                      </Link>
                      <Link
                        href="/shop/supplements"
                        className="transition hover:text-black dark:hover:text-white"
                      >
                        Supplements
                      </Link>
                    </nav>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4">
                    <Suspense
                      fallback={
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className="h-6 w-16 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                          <div className="h-9 w-9 animate-pulse rounded-full bg-neutral-200 dark:bg-neutral-800" />
                        </div>
                      }
                    >
                      <UserMenu />
                      <CartIcon />
                    </Suspense>
                  </div>
                </div>
              </header>

              <main className="flex-1">{children}</main>

              <CartDrawer />
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
