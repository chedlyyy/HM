import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "lib/db/connect";
import { Product } from "lib/db/models/Product";
import { Category } from "lib/db/models/Category";

function ensureAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "admin") {
    return false;
  }
  return true;
}

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, props: Params) {
  const params = await props.params;
  await connectToDatabase();

  const product = await Product.findById(params.id).populate("category").lean();
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: product._id.toString(),
    name: product.name,
    description: product.description,
    price: product.price,
    stock: product.stock,
    images: product.images,
    category: product.category
      ? {
          id: product.category._id.toString(),
          name: (product.category as any).name,
          slug: (product.category as any).slug,
        }
      : null,
    createdAt: product.createdAt,
  });
}

export async function PATCH(req: NextRequest, props: Params) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = await props.params;
  const body = await req.json();
  const { name, description, price, images, stock, categoryId } = body ?? {};

  await connectToDatabase();

  const product = await Product.findById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (categoryId) {
    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }
    product.category = category._id;
  }

  if (typeof name === "string") product.name = name;
  if (typeof description === "string") product.description = description;
  if (typeof price === "number") product.price = price;
  if (Array.isArray(images)) product.images = images;
  if (typeof stock === "number") product.stock = stock;

  await product.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, props: Params) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = await props.params;

  await connectToDatabase();

  await Product.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}

