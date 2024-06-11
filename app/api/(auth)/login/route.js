import User from "@/models/userModel";
import connectDB from "@/utils/connectDB";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import Note from "@/models/notesModel";

export async function POST(req) {
  await connectDB();

  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { msg: "All fields are required!" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ msg: "no user found" }, { status: 401 });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match)
    return NextResponse.json({ msg: "Incorrect username or password" }, { status: 401 });

  const accessToken = jwt.sign(
    { uid: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  const refreshToken = jwt.sign(
    { uid: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "365d" }
  );

  const newUser = await User.findOne({ username })
    .select("-password")
    .populate("notes")
    .lean()
    .exec();

  cookies().set({
    name: "jwt",
    value: refreshToken,
    path: "/",
    httpOnly: true,
    maxAge: 365 * 24 * 60 * 60,
    secure: true,
    sameSite: "strict",
  });

  return NextResponse.json({ accessToken, newUser });
}
