/** @format */

import useAuth from "./useAuth";
import { apiAuth } from "@/config/axios/axios";
import { decryptToken, encryptToken } from "@/utils/CryptoUtils";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuth();
  const tokenFromCookies = Cookies.get("refreshToken");
  const refreshToken = decryptToken(tokenFromCookies);

  const refresh = async () => {
    // Get refresh token using axios
    var response;
    try {
      response = await apiAuth.post(
        "auth/refresh-token",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        }
      );

      const decodedJwt = jwtDecode(response.data.data.access_token);

      // Set access token by new refresh token
      setAuth((prev) => {
        return {
          ...prev,
          role: decodedJwt.role,
          accessToken: response.data.data.access_token,
        };
      });

      Cookies.set("accessToken", response.data.data.access_token);
      Cookies.set(
        "refreshToken",
        encryptToken(response.data.data.refresh_token)
      );
    } catch (error) {
      console.log("Error: ", error);
    }

    return response.data.data.access_token;
  };

  return refresh;
};

export default useRefreshToken;
