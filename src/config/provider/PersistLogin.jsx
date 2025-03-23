/** @format */

import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

const PersistLogin = () => {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <Outlet />
    </>
  );
};

export default PersistLogin;
