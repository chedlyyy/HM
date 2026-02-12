import { Suspense } from "react";
import { notFound } from "next/navigation";
import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import Price from "components/price";
import { CommentsList } from "components/product/CommentsList";
import { CommentForm } from "components/product/CommentForm";
import { AddToCartButton } from "components/cart/AddToCartButton";
import { getProductWithRatingAndCategory } from "lib/db/productQueries";
import { connectToDatabase } from "lib/db/connect";
import { Comment } from "lib/db/models/Comment";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params;
  const product = await getProductWithRatingAndCategory(params.id);

  if (!product) {
    return notFound();
  }

  const images =
    product.images.length > 0
      ? product.images.map((src) => ({
          src,
          altText: product.name,
        }))
      : [
          {
            src: "/placeholder-product.png",
            altText: product.name,
          },
        ];

  await connectToDatabase();
  const session = await getServerSession(authOptions);

  const rawComments = await Comment.find({ product: params.id })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  const comments = rawComments.map((c) => ({
    id: c._id.toString(),
    text: c.text,
    rating: c.rating,
    createdAt: c.createdAt.toISOString?.() ?? "",
    user: {
      id: c.user?._id?.toString() ?? "",
      name: (c.user as any)?.name ?? "User",
    },
  }));

  const isAuthenticated = !!session?.user;

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 pb-10 pt-8 md:px-8 md:pb-14 md:pt-10">
        <div className="flex flex-col gap-10 rounded-2xl border border-neutral-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/80 md:p-10 lg:flex-row lg:gap-10">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery images={images} />
            </Suspense>
          </div>

          <div className="mt-8 flex basis-full flex-col gap-8 lg:mt-0 lg:basis-2/6">
            <div className="flex flex-col gap-3 border-b pb-6 dark:border-neutral-800">
              {product.category ? (
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.25em] text-neutral-500 dark:text-neutral-400">
                  {product.category.name}
                </p>
              ) : null}
              <h1 className="text-3xl font-semibold tracking-tight">
                {product.name}
              </h1>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
                <Price amount={product.price.toString()} currencyCode="USD" />
                {typeof product.averageRating === "number" && (
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
                    ★ {product.averageRating.toFixed(1)} / 5
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {product.description}
              </p>
              <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                Stock:{" "}
                <span className="font-medium text-neutral-900 dark:text-neutral-100">
                  {product.stock > 0 ? product.stock : "Out of stock"}
                </span>
              </p>
            </div>

            <div className="space-y-4">
              <AddToCartButton
                productId={product.id}
                name={product.name}
                price={product.price}
                image={product.images[0]}
                disabled={product.stock <= 0}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Payments are not enabled yet. Cart is for demo only.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.5fr)]">
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Comments
            </h2>
            <CommentsList comments={comments} />
          </section>
          <section>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
              Rate this product
            </h2>
            {isAuthenticated ? (
              <CommentForm productId={product.id} />
            ) : (
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Sign in to rate and comment. Use the button in the header to log in or
                create an account.
              </p>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}

