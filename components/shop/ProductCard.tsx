import Link from "next/link";
import { GridTileImage } from "components/grid/tile";
import type { ShopProduct } from "lib/db/productQueries";

interface ProductCardProps {
  product: ShopProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0] ?? "/placeholder-product.png";

  return (
    <Link
      href={`/product/${product.id}`}
      className="group flex h-full flex-col gap-3"
      prefetch={true}
    >
      <div className="aspect-square w-full">
        <GridTileImage
          alt={product.name}
          src={primaryImage}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          label={{
            title: product.name,
            amount: product.price.toString(),
            currencyCode: "USD",
            position: "bottom",
          }}
        />
      </div>
      <div className="space-y-1 text-sm">
        {product.category ? (
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {product.category.name}
          </p>
        ) : null}
        <p className="line-clamp-2 text-sm font-medium text-neutral-900 dark:text-neutral-50">
          {product.name}
        </p>
        {typeof product.averageRating === "number" && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            ★ {product.averageRating.toFixed(1)} / 5
          </p>
        )}
      </div>
    </Link>
  );
}

