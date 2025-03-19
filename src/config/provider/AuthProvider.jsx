/** @format */

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({}); // Store access token in memory (not localStorage)
	const accessToken = Cookies.get("accessToken");
	const decodeAccessToken = accessToken ? jwtDecode(accessToken) : null;

	useEffect(() => {
		if (decodeAccessToken) {
			setAuth({
				role: decodeAccessToken.role,
				accessToken: decodeAccessToken,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
