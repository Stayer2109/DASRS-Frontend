// @/hooks/useLogout.js

import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import useAuth from "./useAuth";
import { apiAuth } from "@/config/axios/axios";

const useLogout = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const logout = async () => {
    try {
      const accessToken = Cookies.get("accessToken");

      // Optional: call logout API
      await apiAuth.post(
        "auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear everything
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setAuth(null);
      navigate("/", { replace: true }); // Or /login or wherever
    }
  };

  return logout;
};

export default useLogout;
