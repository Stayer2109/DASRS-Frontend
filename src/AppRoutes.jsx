/** @format */

// import React from "react";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import CommonLayout from "./AtomicComponents/pages/CommonLayout";
import HomePage from "./AtomicComponents/pages/Home/Homepage";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./config/provider/PersistLogin";
import "react-tooltip/dist/react-tooltip.css";
import RequireAuth from "./config/provider/RequireAuth";
import ForgetPassword from "./AtomicComponents/pages/ForgetPassword/ForgetPassword";
import ScrollToTop from "./others/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";

const AppRoutes = () => {
  const { auth } = useAuth();
  const [toastPosition, setToastPosition] = useState("top-right");

  // Detect screen size
  useEffect(() => {
    const checkScreen = () => {
      if (window.innerWidth <= 480) {
        setToastPosition("top-center");
      } else {
        setToastPosition("top-right");
      }
    };

    checkScreen(); // check on load
    window.addEventListener("resize", checkScreen); // check on resize

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  return (
    <ScrollToTop>
      <Toaster position={toastPosition} />
      <Routes>
        <Route path="reset-password/:token" element={<ForgetPassword />} />

        {/* Unauthenticated Roles */}
        {!auth?.role && (
          <Route path="/" element={<CommonLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        )}

        {/* Authenticated Roles */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
            <Route path="/">
              <Route index element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={
            <h1 className="text-h1 text-red-500">Adu Ang Seng</h1>
          }
        />
      </Routes>
    </ScrollToTop>
  );
};

export default AppRoutes;
