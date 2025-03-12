/** @format */

import React from "react";
import useAuth from "./useAuth";
import Cookies from "js-cookie";
import { apiAuth } from "@/config/axios/axios";

const useRefreshToken = () => {
	const { setAuth } = useAuth();

	const refresh = async () => {
		const refreshToken = apiAuth.post("auth/refresh-token", {});
		console.log(refreshToken);

		return refreshToken;
	};

	return refresh;
};

export default useRefreshToken;
