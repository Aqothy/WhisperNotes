import axios from "axios";
import { useEffect } from "react";
import useRefresh from "./useRefresh";
import { useSelector } from "react-redux";

//dont have to use axios interceptors, you can just use middleware to refresh the token
export default function useAxiosInt() {
  const refresh = useRefresh();
  const { token } = useSelector((state) => state.token);

  // Create a new Axios instance
  const axiosInstance = axios.create({
    baseURL: "/api",
  });

  let reqInt, resInt;

  useEffect(() => {
    reqInt = axiosInstance.interceptors.request.use(
      (config) => {

        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (err) => {
        throw new Error(err.response.data.msg);
      }
    );

    resInt = axiosInstance.interceptors.response.use(
      (res) => res,
      async (err) => {
        const prevReq = err.config;
        if (err?.response?.status === 403 && !prevReq.sent) {
          prevReq.sent = true;
          const newAccessToken = await refresh();
          prevReq.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(prevReq);
        }
        throw new Error(err.response.data.msg);
      }
    );

    return () => {
      axiosInstance.interceptors.response.eject(resInt);
      axiosInstance.interceptors.request.eject(reqInt);
    }

  }, [token, refresh]);

  return { axiosInstance };
}
