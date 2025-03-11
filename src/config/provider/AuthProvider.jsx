/** @format */

import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({});

	useEffect(() => {
		const role = Cookies.get("role");
		const accessToken = Cookies.get("accessToken");
		const fullName = Cookies.get("fullName");
		const userName = Cookies.get("userName");
		const refToken = Cookies.get("refToken");
		const userId = Cookies.get("userId");

		if (role) {
			setAuth({ accessToken, fullName, userName, refToken, role, userId });
		}
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
