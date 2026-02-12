"use client";

import { useCart } from "./CartContext";

interface AddToCartButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  disabled?: boolean;
}

export function AddToCartButton({
  productId,
  name,
  price,
  image,
  disabled,
}: AddToCartButtonProps) {
  const { addItem, openDrawer } = useCart();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;
    addItem({ productId, name, price, image });
    openDrawer();
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={handleClick}
      className="flex w-full cursor-pointer items-center justify-center rounded-full bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-black dark:hover:bg-neutral-100"
    >
      Add to cart
    </button>
  );
}
