import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";

const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});
  const [isAuthLoading, setIsAuthLoading] = useState(true); // Add this

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const decodeAccessToken = accessToken ? jwtDecode(accessToken) : null;

    if (decodeAccessToken) {
      const { id, isLeader, teamId, role } = decodeAccessToken;
      setAuth({
        role,
        accessToken,
        id,
        isLeader,
        teamId,
      });
    }

    setIsAuthLoading(false); // Done loading
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, isAuthLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
