import { notFound } from "next/navigation";
import { ProductGrid } from "components/shop/ProductGrid";
import { SectionHeader } from "components/ui/SectionHeader";
import {
  getProductsByCategorySlug,
  getProductsByCategorySlugs,
} from "lib/db/productQueries";

const MERCH_SLUGS = ["clothing"];

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage(props: CategoryPageProps) {
  const params = await props.params;
  const slug = params.category;

  if (slug === "merch") {
    const products = await getProductsByCategorySlugs(MERCH_SLUGS);
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Category"
          title="Merch"
          description="Clothing built for the gym and beyond."
        />
        <ProductGrid products={products} />
      </div>
    );
  }

  if (slug === "supplements") {
    const products = await getProductsByCategorySlug("supplements");
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
        <SectionHeader
          eyebrow="Category"
          title="Supplements"
          description="Protein, pre-workout, vitamins, and recovery. Nutrition to match your training."
        />
        <ProductGrid products={products} />
      </div>
    );
  }

  notFound();
}

