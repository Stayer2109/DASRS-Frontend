import useAuth from "./useAuth";
import { apiAuth } from "@/config/axios/axios";
import { decryptToken, encryptToken } from "@/utils/CryptoUtils";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      const tokenFromCookies = Cookies.get("refreshToken");
      const refreshToken = decryptToken(tokenFromCookies);

      const response = await apiAuth.post(
        "auth/refresh-token",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
          withCredentials: true,
        }
      );

      const decodedJwt = jwtDecode(response.data.data.access_token);

      setAuth((prev) => ({
        ...prev,
        teamId: decodedJwt.team_id,
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
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      setAuth(null);
      throw error;
    }
  };

  return refresh;
};

export default useRefreshToken;
