// import React from "react";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import HomePage from "./AtomicComponents/pages/HomePage/HomePage";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
  return (
    // MAIN ROUTE IN HERE
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};

export default AppRoutes;
