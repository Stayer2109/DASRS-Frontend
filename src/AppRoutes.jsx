/** @format */

// import React from "react";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
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
					element={<AdminPage />}
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
