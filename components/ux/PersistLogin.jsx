"use client";

import useRefresh from "@/hooks/useRefresh";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTokenLoading } from "@/redux/features/tokenSlice";

export default function PersistLogin({ children }) {
  const dispatch = useDispatch();
  const refresh = useRefresh();
  const { token } = useSelector((state) => state.token);

  useEffect(() => {
    async function verifyRefresh() {
      try {
        await refresh();
      } catch (error) {
        console.log(error.message);
        dispatch(setTokenLoading(false));
      }
    }
    !token ? verifyRefresh() : dispatch(setTokenLoading(false));
  }, []);

  return children;
}
