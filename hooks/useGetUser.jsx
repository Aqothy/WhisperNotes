"use client";

import useAxiosInt from "./useAxiosInt";
import { useDispatch } from "react-redux";
import { addUser, setUserLoading } from "@/redux/features/userSlice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function GetUser({ children }) {
  const { axiosInstance } = useAxiosInt();
  const { token } = useSelector((state) => state.token);
  const dispatch = useDispatch();

  useEffect(() => {
    let ignore = false;
    async function getUser() {
      dispatch(setUserLoading(true));
      try {
        const { data } = await axiosInstance.get("/users");
        const { user } = data;
        dispatch(addUser(user));
        dispatch(setUserLoading(false));
        return user;
      } catch (error) {
        console.log(error.message);
        dispatch(setUserLoading(false));
      }
    }
    if (!ignore) {
      if (token) {
        getUser();
      }
    }
    return () => {
      ignore = true;
    };
  }, []);

  return children;
}
