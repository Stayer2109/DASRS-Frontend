/** @format */

import Cookies from "js-cookie";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useRefreshToken from "./useRefreshToken";
import APIInUse from "../axios/AxiosInUse";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
	const refresh = useRefreshToken();
	const { auth } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const requestIntercept = APIInUse.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"]) {
					config.headers["Authorization"] = `Bearer ${auth?.accessToken}`;
				}
				return config;
			},
			(error) => {
				console.log("Request failed. Logging out.");
				Promise.reject(error);
				navigate("/login", { state: { from: location }, replace: true });
			}
		);

		const responseIntercept = APIInUse.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				if (error?.response?.status === 401 && !prevRequest?.sent) {
					prevRequest.sent = true;
					try {
						const newAccessToken = await refresh();
						prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
						return APIInUse(prevRequest);
					} catch (refreshError) {
						console.log("Refresh failed. Logging out.");
						navigate("/login", { state: { from: location }, replace: true });
					}
				}
				return Promise.reject(error);
			}
		);

		return () => {
			APIInUse.interceptors.request.eject(requestIntercept);
			APIInUse.interceptors.response.eject(responseIntercept);
		};
	}, [auth, location, navigate, refresh]);

	return APIInUse;
};

export default useAxiosPrivate;
