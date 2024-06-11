import { NextResponse } from "next/server";
import User from "@/models/userModel";
import connectDB from "@/utils/connectDB";
import bcrypt from "bcrypt";
import { verifyToken } from "@/utils/verifyToken";
import Note from "@/models/notesModel";

export async function GET(req) {
  try {
    await verifyToken(req);
    await connectDB();

    const { uid } = req;

    const user = await User.findById(uid)
      .populate("notes")
      .select("-password")
      .lean()
      .exec();

    if (user) {
      return NextResponse.json({ user }, { status: 201 });
    } else {
      return NextResponse.json({ msg: "Invalid user" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { msg: error.msg },
      { status: error.status || 401 }
    );
  }
}

// @route POST /api/users
// Create new user
export async function POST(req) {
  const salt = parseInt(process.env.SALT_ROUNDS);
  await connectDB();

  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { msg: "All fields are required" },
      { status: 400 }
    );
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  //409 means conflicts and 400 means error
  if (duplicate) {
    return NextResponse.json({ msg: "User already exists" }, { status: 409 });
  }

  const hashedPass = await bcrypt.hash(password, salt);

  const user = await User.create({
    username,
    password: hashedPass,
  });

  if (user) {
    //201 means resource been created
    return NextResponse.json({ msg: "New user created!" }, { status: 201 });
  } else {
    return NextResponse.json({ msg: "Invalid user data" }, { status: 400 });
  }
}

// @route PUT /api/users
// Updating user
export async function PUT(req) {
  try {
    const salt = parseInt(process.env.SALT_ROUNDS);
    await verifyToken(req);
    await connectDB();
    const { username, password, oldPassword } = await req.json();

    const id = req.uid;

    if (!id || !username) {
      return NextResponse.json(
        { msg: "All fields are required" },
        { status: 400 }
      );
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return NextResponse.json({ msg: "User not found" }, { status: 400 });
    }

    const duplicate = await User.findOne({ username }).lean().exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return NextResponse.json({ msg: "Username already exists" }, { status: 409 });
    }

    user.username = username;

    let match

    if (password && oldPassword) {
      match = await bcrypt.compare(oldPassword, user.password);
      if (match) {
        user.password = await bcrypt.hash(password, salt);
      }
    }

    await user.save();

    return NextResponse.json({
      msg: "Username updated!",
      passwordUpdate: match,
      error: !match
        ? "Password doesn't match, password is not updated"
        : "Password updated",
    });
  } catch (error) {
    return NextResponse.json({ msg: error.message }, { status: 401 });
  }
}

// @route DELETE /api/users
// Deleting users
export async function DELETE(req) {
  try {
    await verifyToken(req);
    await connectDB();
    const id = req.uid;

    if (!id) {
      return NextResponse.json({ msg: "User id required" }, { status: 400 });
    }

    const user = await User.findById(id).exec();

    if (!user) {
      return NextResponse.json({ msg: "User not found" });
    }

    const userNoteIds = user.notes;

    await Note.deleteMany({ _id: { $in: userNoteIds } });

    const result = await user.deleteOne();

    return NextResponse.json({ msg: "User is deleted!", result });
  } catch (error) {
    return NextResponse.json({ msg: error.message }, { status: 401 });
  }
}
