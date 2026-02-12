"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, itemCount, isDrawerOpen, closeDrawer } =
    useCart();

  if (!isDrawerOpen) return null;

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/20 dark:bg-black/40"
        aria-hidden
        onClick={closeDrawer}
      />
      <div className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-neutral-200 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-950">
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <h2 className="text-sm font-semibold">My Cart</h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full p-1 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {itemCount === 0 ? (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.productId}
                  className="flex gap-3 rounded-lg border border-neutral-200 p-2 text-sm dark:border-neutral-800"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt=""
                      className="h-14 w-14 shrink-0 rounded object-cover"
                    />
                  ) : (
                    <div className="h-14 w-14 shrink-0 rounded bg-neutral-200 dark:bg-neutral-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productId}`}
                      onClick={closeDrawer}
                      className="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      ${item.price.toFixed(2)} × {item.quantity}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(0, item.quantity - 1))
                        }
                        className="h-6 w-6 rounded border border-neutral-200 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        −
                      </button>
                      <span className="min-w-[1.5rem] text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        className="h-6 w-6 rounded border border-neutral-200 text-xs hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-1 text-xs text-red-500 hover:text-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        {itemCount > 0 && (
          <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
            <p className="mb-2 text-sm font-semibold">
              Total: ${total.toFixed(2)}
            </p>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="block w-full rounded-full border border-neutral-200 py-2 text-center text-sm font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
            >
              View full cart
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
