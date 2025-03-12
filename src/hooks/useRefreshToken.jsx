/** @format */

import React from "react";
import useAuth from "./useAuth";
import { apiAuth } from "@/config/axios/axios";
import Cookies from "js-cookie";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    // Retrieve refresh token from cookies
    const refreshToken = Cookies.get("refreshToken");

    // Get refresh token using axios
    const response = await apiAuth.post(
      "auth/refresh-token",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    const newRefreshToken = response.data.data.refresh_token;

    // Set access token by new refresh token
    setAuth((prev) => ({
      prev,
      accessToken: newRefreshToken,
    }));

    return refreshToken;
  };

  return refresh;
};

export default useRefreshToken;
