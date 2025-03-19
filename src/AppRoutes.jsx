/** @format */

// import React from "react";
import { Route, Routes } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import CommonLayout from "./AtomicComponents/pages/CommonLayout";
import HomePage from "./AtomicComponents/pages/Home/Homepage";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./config/provider/PersistLogin";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./config/provider/PersistLogin";
import RequireAuth from "./config/provider/RequireAuth";
import ForgetPassword from "./AtomicComponents/pages/ForgetPassword/ForgetPassword";
import ScrollToTop from "./others/ScrollToTop";

const AppRoutes = () => {
	const { auth } = useAuth();

  return (
    // MAIN ROUTE IN HERE
    <ScrollToTop>
      <Routes>
        <Route path="reset-password" element={<ForgetPassword />} />

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
            <>
              <h1 className="text-h1 text-red-500">Adu Ang Seng</h1>
            </>
          }
        />
      </Routes>
    </ScrollToTop>
  );
};

export default AppRoutes;
