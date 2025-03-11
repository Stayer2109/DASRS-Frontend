/** @format */

// import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import CommonLayout from "./AtomicComponents/pages/CommonLayout";
import HomePage from "./AtomicComponents/pages/Home/Homepage";
import RequireAuth from "./config/provider/RequireAuth";
import useAuth from "./hooks/useAuth";

const AppRoutes = () => {
  const { auth } = useAuth();

  return (
    // MAIN ROUTE IN HERE
    <Routes>
      {/* Unauthenticated Roles */}
      {!auth?.roles && (
        <Route path="/" element={<CommonLayout />}>
          <Route index element={<HomePage />} />
        </Route>
      )}

      {auth?.roles === "ADMIN" && (
        <Route path="/">
          <Route index element={<AdminPage />} />
        </Route>
      )}

      <Route
        path="*"
        element={
          <>
            <h1 className="text-h1 text-red-500">Adu Ang Seng</h1>
          </>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
