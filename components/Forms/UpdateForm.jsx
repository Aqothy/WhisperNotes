"use client";

import { useState } from "react";
import useAxiosInt from "@/hooks/useAxiosInt";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { addUser } from "@/redux/features/userSlice";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export default function UpdateForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const { axiosInstance } = useAxiosInt();
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  async function submit(e) {
    try {
      e.preventDefault();
      const { data } = await axiosInstance.put("/users", {
        username,
        password,
        oldPassword,
      });
      dispatch(addUser({...user, username}));
      router.push("/home");
      toast.success(data.msg);
      if (data?.passwordUpdate) {
        toast.success(data.error);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col w-[350px]">
      <label htmlFor="username">Username</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
        className="border rounded-md p-[0.5rem] bg-[#F5F4F1] border-[#FCCB2A] focus:outline-none"
        name="username"
        placeholder="username"
      />
      <label htmlFor="oldPassword" className="mt-[1rem]">
        Old password
      </label>
      <input
        type="password"
        onChange={(e) => setOldPassword(e.target.value)}
        value={oldPassword}
        className="border rounded-md p-[0.5rem] bg-[#F5F4F1] border-[#FCCB2A] focus:outline-none"
        name="oldPassword"
        placeholder="old password"
      />
      <label htmlFor="password" className="mt-[1rem]">
        password
      </label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        className="border rounded-md p-[0.5rem] bg-[#F5F4F1] border-[#FCCB2A] focus:outline-none"
        name="password"
        placeholder="password"
      />
      <button
        className="mt-[1rem] p-[0.3rem] rounded-md"
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
          Update Information
        </span>
      </button>
    </form>
  );
}
