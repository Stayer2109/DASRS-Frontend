/** @format */

import { createContext, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
	const [auth, setAuth] = useState({}); // Store access token in memory (not localStorage)

	return (
		<AuthContext.Provider value={{ auth, setAuth }}>
			{children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
