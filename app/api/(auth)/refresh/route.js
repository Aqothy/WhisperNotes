import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import connectDB from "@/utils/connectDB";
import Note from "@/models/notesModel";

export async function GET(req) {
  await connectDB();
  const cookie = cookies().get("jwt");

  if (!cookie)
    return NextResponse.json({ msg: "Unauthorized" }, { status: 401 });

  const refreshToken = cookie.value;

  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decoded.uid)
    .populate("notes")
    .select("-password")
    .lean()
    .exec();

  if (!user) {
    return NextResponse.json({ msg: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    { uid: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "30d" }
  );

  return NextResponse.json({ accessToken, user });
}
