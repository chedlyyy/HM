import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { connectToDatabase } from "lib/db/connect";
import { Comment } from "lib/db/models/Comment";
import { Product } from "lib/db/models/Product";

export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get("productId");

  if (!productId) {
    return NextResponse.json(
      { error: "productId query param is required" },
      { status: 400 },
    );
  }

  await connectToDatabase();

  const comments = await Comment.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    comments: comments.map((c) => ({
      id: c._id.toString(),
      text: c.text,
      rating: c.rating,
      createdAt: c.createdAt,
      user: {
        id: c.user?._id?.toString() ?? "",
        name: (c.user as any)?.name ?? "User",
      },
    })),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !(session.user as any).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { productId, text, rating } = body ?? {};

    if (!productId || !text || typeof rating !== "number") {
      return NextResponse.json(
        { error: "productId, text and rating are required" },
        { status: 400 },
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const productExists = await Product.exists({ _id: productId });
    if (!productExists) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 },
      );
    }

    const comment = await Comment.create({
      user: (session.user as any).id,
      product: productId,
      text,
      rating,
    });

    return NextResponse.json(
      {
        success: true,
        comment: {
          id: comment._id.toString(),
          text: comment.text,
          rating: comment.rating,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create comment error", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}

