"use client";

import { selectNoteById } from "@/redux/features/userSlice";
import { useState } from "react";
import useAxiosInt from "@/hooks/useAxiosInt";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addUser } from "@/redux/features/userSlice";

export default function EditNote({ id }) {
  const note = useSelector((state) => selectNoteById(state, id));
  const [title, setTitle] = useState(note.title);
  const [text, setText] = useState(note.text);
  const { axiosInstance } = useAxiosInt();
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.put("/notes", { id, title, text });
      dispatch(addUser({ ...user, notes: user.notes.map((note) => note._id === id ? data.note : note) }));
      router.push("/home");
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col sm:w-[50%]">
      <label htmlFor="title">Title</label>
      <input
        type="text"
        name="title"
        placeholder="title"
        value={title}
        className="rounded-md p-[0.5rem] border-[#FCCB2A] border focus:outline-none"
        onChange={(e) => setTitle(e.target.value)}
      />
      <label htmlFor="text">Text</label>
      <textarea
        type="text"
        name="text"
        placeholder="text"
        value={text}
        className="border-[#FCCB2A] border focus:outline-none rounded-md p-[0.5rem]"
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="mt-[1rem] p-[0.3rem] rounded-md ml-auto"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,207,0,1) 0%, rgba(252,169,3,1) 100%)",
        }}
      >
        <span
          className="p-[0.5rem] flex justify-center items-center rounded-md font-semibold text-xl text-[#efebe1]"
          style={{
            background:
              "linear-gradient(180deg, rgba(252,169,3,1) 0%, rgba(255,207,0,1) 100%)",
          }}
        >
          Update note
        </span>
      </button>
    </form>
  );
}
