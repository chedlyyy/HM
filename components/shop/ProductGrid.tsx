import Grid from "components/grid";
import type { ShopProduct } from "lib/db/productQueries";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: ShopProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (!products.length) {
    return (
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        No products found in this category yet.
      </p>
    );
  }

  return (
    <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <Grid.Item key={product.id} className="animate-fadeIn">
          <ProductCard product={product} />
        </Grid.Item>
      ))}
    </Grid>
  );
}

