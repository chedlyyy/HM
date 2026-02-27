import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "lib/db/connect";
import { Product } from "lib/db/models/Product";
import { Category } from "lib/db/models/Category";


interface CategoryDocument {
  id: string;
  name: string;
  slug: string;
}


function ensureAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  await connectToDatabase();
  const products = await Product.find().populate("category").sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    products: products.map((p) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      price: p.price,
      stock: p.stock,
      images: p.images,
      category: p.category
        ? {
            id: p.category._id.toString(),
            name: (p.category as any).name,
            slug: (p.category as any).slug,
          }
        : null,
      createdAt: p.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { name, description, price, images, stock, categoryId } = body ?? {};

    if (!name || !description || typeof price !== "number" || !categoryId) {
      return NextResponse.json(
        { error: "name, description, price, stock and categoryId are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    const product = await Product.create({
      name,
      description,
      price,
      images: Array.isArray(images) ? images : [],
      stock: typeof stock === "number" ? stock : 0,
      category: category._id,
    });

    return NextResponse.json(
      { success: true, id: product._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create product error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

