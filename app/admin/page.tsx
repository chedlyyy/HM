import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "lib/db/connect";
import { Category } from "lib/db/models/Category";
import { Product } from "lib/db/models/Product";
import { AdminNav } from "components/admin/AdminNav";
import { ProductForm } from "components/admin/ProductForm";
import { CategoryForm } from "components/admin/CategoryForm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/login?callbackUrl=/admin");
  }

  await connectToDatabase();

  const [categoriesDocs, productsDocs] = await Promise.all([
    Category.find().sort({ createdAt: -1 }).lean(),
    Product.find().populate("category").sort({ createdAt: -1 }).lean(),
  ]);

  const categories = categoriesDocs.map((c) => ({
    id: c._id.toString(),
    name: c.name,
  }));

  const products = productsDocs.map((p) => ({
    id: p._id.toString(),
    name: p.name,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: p.images ?? [],
    categoryId: p.category?._id?.toString() ?? "",
    categoryName: (p.category as any)?.name ?? "",
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:px-8 md:py-12">
      <header className="mb-6 space-y-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
          Admin
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Catalog management
        </h1>
        <p className="max-w-2xl text-sm text-neutral-500 dark:text-neutral-400">
          Manage Hamdi Shop products, categories, and images. All changes update the
          public shop experience.
        </p>
      </header>

      <AdminNav />

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Products
          </h2>
          <ProductForm
            categories={categories}
            onSaved={undefined /* page refresh on save is enough for now */}
          />
          <div className="space-y-2 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              Existing products
            </p>
            {products.length === 0 ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No products yet. Create the first Hamdi Shop item above.
              </p>
            ) : (
              <ul className="divide-y divide-neutral-200 text-xs dark:divide-neutral-800">
                {products.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-900 dark:text-neutral-50">
                        {p.name}
                      </p>
                      <p className="truncate text-[0.7rem] text-neutral-500 dark:text-neutral-400">
                        {p.categoryName || "Unassigned"} • ${p.price.toFixed(2)} • Stock:{" "}
                        {p.stock}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
        <section className="space-y-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Categories
          </h2>
          <CategoryForm onSaved={undefined} />
          <div className="space-y-2 rounded-2xl border border-neutral-200 bg-white/80 p-4 text-sm dark:border-neutral-800 dark:bg-neutral-950/80">
            <p className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              Existing categories
            </p>
            {categories.length === 0 ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                No categories yet. Create &quot;merch&quot; and &quot;supplements&quot;
                to match the shop sections.
              </p>
            ) : (
              <ul className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                {categories.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2">
                    <span>{c.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

