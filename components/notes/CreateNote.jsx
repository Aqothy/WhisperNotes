"use client";

import useAxiosInt from "@/hooks/useAxiosInt";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { addUser } from "@/redux/features/userSlice";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { axiosInstance } = useAxiosInt();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await axiosInstance.post("/notes", { title, text });
      dispatch(addUser({ ...user, notes: [...user.notes, data.note] }));
      setTitle("")
      setText("");
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <section className="rounded-md border p-[1.5rem] bg-white sm:w-[70%]">
      <form onSubmit={submit} className="flex flex-col">
        <label htmlFor="title" className="text-xl font-semibold">
          Title
        </label>
        <input
          type="text"
          name="title"
          placeholder="What do you want to talk about today?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-md p-[0.5rem] bg-[#F5F4F1] border-[#FCCB2A] focus:outline-none"
        />
        <label htmlFor="text" className="text-xl font-semibold mt-[1rem]">
          Text
        </label>
        <textarea
          type="text"
          name="text"
          placeholder="Express your thoughts, your secret will be kept with us"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border rounded-md p-[0.5rem] bg-[#F5F4F1] border-[#FCCB2A] focus:outline-none"
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
            Create note
          </span>
        </button>
      </form>
    </section>
  );
}
