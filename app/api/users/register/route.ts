import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "lib/db/connect";
import { User } from "lib/db/models/User";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.toLowerCase();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body ?? {};

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    const role =
      ADMIN_EMAIL && email.toLowerCase() === ADMIN_EMAIL ? "admin" : "user";

    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User registration error", error);
    return NextResponse.json(
      { error: "Something went wrong while registering" },
      { status: 500 }
    );
  }
}

