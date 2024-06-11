"use client";

import useAxiosInt from "@/hooks/useAxiosInt";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addUser } from "@/redux/features/userSlice";

export default function DeleteNote({ id }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { axiosInstance } = useAxiosInt();
  async function deleteNote() {
    try {
      const { data } = await axiosInstance.delete("/notes", { data: { id } });
      dispatch(addUser({ ...user, notes: user.notes.filter((note) => note._id !== id)}));
      toast.success(data.msg);
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <button onClick={deleteNote}>
      <MdDelete />
    </button>
  );
}
