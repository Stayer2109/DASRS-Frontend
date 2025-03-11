/** @format */

import React, { useEffect, useState } from "react";
import useAuth from "./useAuth";
import { Outlet } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import useRefreshToken from "./useRefreshToken";

function PersistLogin() {
	const [isLoading, setIsLoading] = useState(true);
	const refresh = useRefreshToken();
	const { auth } = useAuth();

	useEffect(() => {
		let isMounted = true;
		const verifyRefreshToken = async () => {
			try {
				await refresh();
			} catch (error) {
				console.log(error);
			} finally {
				isMounted && setIsLoading(false);
			}
		};

		!auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

		return () => (isMounted = false);
	}, [auth?.accessToken, refresh]);

	return (
		<>
			{isLoading ? (
				<Backdrop
					sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
					open={isLoading}
				>
					<div className='flex flex-col justify-center items-center gap-2'>
						<CircularProgress color='inherit' />
						<h1>Waiting</h1>
					</div>
				</Backdrop>
			) : (
				<Outlet />
			)}
		</>
	);
}

export default PersistLogin;
