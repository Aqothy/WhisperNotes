"use client";

import useAxiosInt from "@/hooks/useAxiosInt";
import { logoutUser } from "@/redux/features/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { logout } from "@/redux/features/tokenSlice";

export default function DeleteUser() {
  const dispatch = useDispatch();
  const { axiosInstance} = useAxiosInt();
  const router = useRouter();
  async function deleteAcc() {
    try {
      const { data } = await axiosInstance.delete("/users");

      dispatch(logoutUser());
      dispatch(logout());
      toast.success(data.msg);
      router.push("/");
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <button
      className="mt-[1rem] p-[0.3rem] rounded-md flex-1"
      style={{
        background:
          "linear-gradient(180deg, rgba(87,84,84,1) 0%, rgba(20,5,2,1) 100%)",
      }}
      onClick={deleteAcc}
    >
      <span
        className="p-[0.5rem] flex justify-center items-center rounded-md font-semibold text-xl text-[#efebe1]"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,5,2,1) 0%, rgba(87,84,84,1) 100%)",
        }}
      >
        DELETE ACCOUNT
      </span>
    </button>
  );
}
