import { useContext } from "react";
import AuthContext from "@/config/provider/AuthProvider";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
