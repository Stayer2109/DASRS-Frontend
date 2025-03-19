/** @format */

import useAuth from "./useAuth";
import { apiAuth } from "@/config/axios/axios";
import { decryptToken } from "@/utils/CryptoUtils";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const useRefreshToken = () => {
	const { setAuth } = useAuth();
	const encryptedToken = Cookies.get("refreshToken");
	const refreshToken = decryptToken(encryptedToken);

	const refresh = async () => {
		// Get refresh token using axios
		const response = await apiAuth.post(
			"auth/refresh-token",
			{},
			{
				headers: { Authorization: `Bearer ${refreshToken}` },
				withCredentials: true,
			}
		);

		const decodedJwt = jwtDecode(response.data.data.access_token);
		Cookies.set(
			"refreshToken",
			encryptedToken(response.data.data.refresh_token)
		);

		// Set access token by new refresh token
		setAuth((prev) => {
			return {
				...prev,
				role: decodedJwt.role,
				accessToken: response.data.data.access_token,
			};
		});

		return response.data.data.access_token;
	};

	return refresh;
};

export default useRefreshToken;
