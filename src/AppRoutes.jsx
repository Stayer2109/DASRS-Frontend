// import React from "react";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import { Routes, Route } from "react-router-dom";
import CommonLayout from "./AtomicComponents/pages/CommonLayout";
import HomePage from "./AtomicComponents/pages/Home/HomePage";

const AppRoutes = () => {
  return (
    // MAIN ROUTE IN HERE
    <Routes>
      <Route path="/" element={<CommonLayout />}>
        <Route index element={<HomePage />} />
      </Route>
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;
