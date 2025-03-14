import { useLocation, Navigate, Outlet, replace } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  return (
    <>
      {allowedRoles?.includes(auth?.role) ? (
        <Outlet />
      ) : (
        <Navigate to="/" state={{ from: location }} replace />
      )}
    </>
  );
};

export default RequireAuth;
