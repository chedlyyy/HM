import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "app/api/auth/[...nextauth]/route";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

function ensureAdmin(session: any) {
  if (!session?.user || (session.user as any).role !== "admin") {
    return false;
  }
  return true;
}

function safeFilename(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!ensureAdmin(session)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || "";
    const base = safeFilename(path.basename(file.name, ext));
    const id = crypto.randomUUID();
    const filename = `${base}-${id}${ext}`;
    const fullPath = path.join(uploadsDir, filename);

    await writeFile(fullPath, buffer);

    return NextResponse.json({ url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Upload error", error);
    return NextResponse.json(
      { error: "Unable to upload file" },
      { status: 500 },
    );
  }
}

