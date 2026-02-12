import { SectionHeader } from "components/ui/SectionHeader";
import { ProductGrid } from "components/shop/ProductGrid";
import { getAllSectionedProducts } from "lib/db/productQueries";

export const metadata = {
  title: "Shop",
  description: "Browse Hamdi Shop merch and supplements.",
};

export default async function ShopPage() {
  const sections = await getAllSectionedProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
      <header className="mb-10 space-y-3">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Hamdi Shop
        </p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Merch &amp; gym nutrition
        </h1>
      </header>

      <div className="space-y-12">
        {sections.map((section) => (
          <section key={section.category.id}>
            <SectionHeader
              eyebrow={section.category.slug === "merch" ? "Merch" : "Supplements"}
              title={section.category.name}
              description={
                section.category.slug === "merch"
                  ? ""
                  : ""
              }
            />
            <ProductGrid products={section.products} />
          </section>
        ))}

        {sections.length === 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No products are available yet. Once Hamdi adds merch and supplements, they
            will appear here automatically.
          </p>
        )}
      </div>
    </div>
  );
}

