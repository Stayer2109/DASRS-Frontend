/** @format */

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "./useAuth";

const RequireAuth = ({ allowedRoles }) => {
	const { auth } = useAuth();
	const location = useLocation();

	return (
		<>
			{allowedRoles?.includes(auth?.role) ? (
				<Outlet />
			) : (
				<Navigate
					to='/login'
					state={{ from: location }}
					replace
				/>
			)}
		</>
	);
};

export default RequireAuth;
