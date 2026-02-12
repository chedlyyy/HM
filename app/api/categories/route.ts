import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "lib/db/connect";
import { Category } from "lib/db/models/Category";

function ensureAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "admin") {
    return false;
  }
  return true;
}

export async function GET() {
  await connectToDatabase();
  const categories = await Category.find().sort({ createdAt: -1 }).lean();

  return NextResponse.json({
    categories: categories.map((c) => ({
      id: c._id.toString(),
      name: c.name,
      slug: c.slug,
      createdAt: c.createdAt,
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
    const { name, slug } = body ?? {};

    if (!name || !slug) {
      return NextResponse.json(
        { error: "name and slug are required" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const exists = await Category.findOne({ slug: slug.toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 400 },
      );
    }

    const category = await Category.create({
      name,
      slug: slug.toLowerCase(),
    });

    return NextResponse.json(
      { success: true, id: category._id.toString() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create category error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

