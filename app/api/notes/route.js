import { NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { verifyToken } from "@/utils/verifyToken";
import User from "@/models/userModel";
import Note from "@/models/notesModel";

// @route POST /api/notes
// Create new note
export async function POST(req) {
  try {
    await verifyToken(req);
    await connectDB();

    const { title, text } = await req.json();

    const { uid } = req;

    //409 means conflicts and 400 means erorr
    const note = await Note.create({ title, text });

    const user = await User.findById(uid).exec();

    await user.updateOne({ $push: { notes: note } });

    if (note) {
      //201 means resource been created
      return NextResponse.json({ msg: "New note created!", note}, { status: 201 });
    } else {
      return NextResponse.json({ msg: "Invalid note data" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json(
      { msg: error.msg },
      { status: error.status || 401 }
    );
  }
}

// @route PUT /api/notes
// Updating note
export async function PUT(req) {
  try {
    await verifyToken(req);
    await connectDB();
    const { id, title, text } = await req.json();

    if (!id || !title || !text) {
      return NextResponse.json(
        { msg: "All fields are required" },
        { status: 400 }
      );
    }

    const note = await Note.findById(id).exec();

    note.text = text;
    note.title = title;

    await note.save();

    return NextResponse.json({ msg: "Note updated!", note});
  } catch (error) {
    return NextResponse.json({ msg: error.message }, { status: 401 });
  }
}

// @route DELETE /api/notes
// Deleting notes
export async function DELETE(req) {
  try {
    await verifyToken(req);
    await connectDB();

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ msg: "Note id required" }, { status: 400 });
    }

    const note = await Note.findById(id).exec();

    if (!note) {
      return NextResponse.json({ msg: "Note not found" }, { status: 400 });
    }

    const result = await note.deleteOne();

    return NextResponse.json({ msg: "Note is deleted!", result });
  } catch (error) {
    return NextResponse.json({ msg: error }, { status: error.status || 401 });
  }
}
