"use client";

import Link from "next/link";
import { useCart } from "components/cart/CartContext";

export default function CartPage() {
  const { items, removeItem, updateQuantity, itemCount } = useCart();

  if (itemCount === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">My Cart</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Your cart is empty.{" "}
          <Link
            href="/shop"
            className="font-medium text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100"
          >
            Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">My Cart</h1>

      <ul className="space-y-4 border-b border-neutral-200 pb-6 dark:border-neutral-800">
        {items.map((item) => (
          <li
            key={item.productId}
            className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white/80 p-4 dark:border-neutral-800 dark:bg-neutral-950/80 sm:flex-nowrap"
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              {item.image ? (
                <img
                  src={item.image}
                  alt=""
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
              )}
              <div className="min-w-0">
                <Link
                  href={`/product/${item.productId}`}
                  className="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, Math.max(0, item.quantity - 1))
                  }
                  className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    updateQuantity(item.productId, item.quantity + 1)
                  }
                  className="flex h-8 w-8 items-center justify-center text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              <p className="w-20 text-right text-sm font-medium">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
              <button
                type="button"
                onClick={() => removeItem(item.productId)}
                className="text-xs text-red-500 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col items-end gap-2">
        <p className="text-lg font-semibold">
          Total: ${total.toFixed(2)}
        </p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          Payments are not enabled. This is a demo cart.
        </p>
        <Link
          href="/shop"
          className="mt-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
