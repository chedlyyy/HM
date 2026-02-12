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

interface Params {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, props: Params) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = await props.params;
  const body = await req.json();
  const { name, slug } = body ?? {};

  await connectToDatabase();

  const category = await Category.findById(params.id);
  if (!category) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (typeof name === "string") category.name = name;
  if (typeof slug === "string") category.slug = slug.toLowerCase();

  await category.save();

  return NextResponse.json({ success: true });
}

export async function DELETE(_: NextRequest, props: Params) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const params = await props.params;

  await connectToDatabase();
  await Category.findByIdAndDelete(params.id);

  return NextResponse.json({ success: true });
}

