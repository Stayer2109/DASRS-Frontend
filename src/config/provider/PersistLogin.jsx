/** @format */

import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		console.log("isLoading: ", isLoading);
		console.log(`aToken: ${JSON.stringify(auth?.accessToken)}`);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isLoading]);

	return <>{isLoading ? <p>Loading...</p> : <Outlet />}</>;
};

export default PersistLogin;
