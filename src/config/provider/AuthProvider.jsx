/** @format */

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({}); // Store access token in memory (not localStorage)

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const decodeAccessToken = accessToken ? jwtDecode(accessToken) : null;
    const id = decodeAccessToken ? decodeAccessToken.id : null;
    const isLeader = decodeAccessToken ? decodeAccessToken.isLeader : null;

    if (decodeAccessToken) {
      setAuth({
        role: decodeAccessToken.role,
        accessToken: accessToken,
        id: id,
        isLeader: isLeader,
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
