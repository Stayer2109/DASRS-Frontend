/** @format */

import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import PropTypes from "prop-types";

const RequireAuth = ({ allowedRoles }) => {
	const { auth } = useAuth();
	const location = useLocation();

	return (
		<>
			{allowedRoles?.includes(auth?.role) ? (
				<Outlet />
			) : (
				<Navigate
					to='/'
					state={{ from: location }}
					replace
				/>
			)}
		</>
	);
};

RequireAuth.propTypes = {
	allowedRoles: PropTypes.arrayOf(PropTypes.string),
};

export default RequireAuth;
