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
    try {
      const response = await apiAuth.post(
        "auth/refresh-token",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        }
      );

      const decodedJwt = jwtDecode(response.data.data.access_token);

      // Save new token
      setAuth((prev) => ({
        ...prev,
        role: decodedJwt.role,
        accessToken: response.data.data.access_token,
      }));

      Cookies.set("accessToken", response.data.data.access_token);
      Cookies.set(
        "refreshToken",
        encryptToken(response.data.data.refresh_token)
      );

      return response.data.data.access_token;
    } catch (error) {
      console.error("Refresh token failed:", error);

      // Auto logout here
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setAuth(null); // <- this kicks them out

      throw error; // still throw so components know
    }
  };

  return refresh;
};

export default useRefreshToken;
