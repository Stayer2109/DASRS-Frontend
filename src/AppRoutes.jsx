/** @format */

// import React from "react";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import HomePage from "./AtomicComponents/pages/Home/HomePage";
import CommonLayout from "./AtomicComponents/pages/CommonLayout";
import { Routes, Route } from "react-router-dom";

const AppRoutes = () => {
	return (
		// MAIN ROUTE IN HERE
		<Routes>
			<Route
				path='/'
				element={<CommonLayout />}
			>
				<Route
					index
					element={<HomePage />}
				/>
			</Route>
			<Route
				path='/admin'
				element={<AdminPage />}
			/>
		</Routes>
	);
};

export default AppRoutes;
