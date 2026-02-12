import { connectToDatabase } from "lib/db/connect";
import { Category } from "lib/db/models/Category";
import { Comment } from "lib/db/models/Comment";
import { Product } from "lib/db/models/Product";

export interface ShopCategory {
  id: string;
  name: string;
  slug: string;
}

export interface ShopProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  stock: number;
  category: ShopCategory | null;
  averageRating?: number;
}

export interface SectionedProducts {
  category: ShopCategory;
  products: ShopProduct[];
}

function mapProduct(doc: any, categoryDoc?: any, averageRating?: number): ShopProduct {
  const category = categoryDoc || doc.category;

  return {
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    images: doc.images ?? [],
    stock: doc.stock,
    category: category
      ? {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        }
      : null,
    averageRating,
  };
}

export async function getProductsByCategorySlug(
  slug: string,
): Promise<ShopProduct[]> {
  await connectToDatabase();

  const category = await Category.findOne({ slug }).lean();
  if (!category) return [];

  const products = await Product.find({ category: category._id })
    .populate("category")
    .lean();

  return products.map((p) => mapProduct(p));
}

/** Get products whose category slug is in the given list (e.g. merch = tshirts, shorts, hoodies). */
export async function getProductsByCategorySlugs(
  slugs: string[],
): Promise<ShopProduct[]> {
  await connectToDatabase();

  const categories = await Category.find({ slug: { $in: slugs } }).lean();
  if (!categories.length) return [];

  const categoryIds = categories.map((c) => c._id);
  const products = await Product.find({ category: { $in: categoryIds } })
    .populate("category")
    .lean();

  return products.map((p) => mapProduct(p));
}

const MERCH_SLUGS = ["clothing"];
const SUPPLEMENTS_SLUG = "supplements";

export async function getAllSectionedProducts(): Promise<SectionedProducts[]> {
  await connectToDatabase();

  const sections: SectionedProducts[] = [];

  const merchProducts = await getProductsByCategorySlugs(MERCH_SLUGS);
  if (merchProducts.length > 0) {
    sections.push({
      category: { id: "merch", name: "Merch", slug: "merch" },
      products: merchProducts,
    });
  }

  const supplementsProducts = await getProductsByCategorySlug(SUPPLEMENTS_SLUG);
  if (supplementsProducts.length > 0) {
    sections.push({
      category: { id: "supplements", name: "Supplements", slug: "supplements" },
      products: supplementsProducts,
    });
  }

  return sections;
}

export async function getProductWithRatingAndCategory(
  id: string,
): Promise<ShopProduct | null> {
  await connectToDatabase();

  const product = await Product.findById(id).populate("category").lean();
  if (!product) return null;

  const ratingAgg = await Comment.aggregate([
    { $match: { product: product._id } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);

  const averageRating = ratingAgg[0]?.averageRating ?? undefined;

  return mapProduct(product, product.category, averageRating);
}

