/** @format */

// import React from "react";
import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import HomePage from "./AtomicComponents/pages/Home/Homepage";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./config/provider/PersistLogin";
import RequireAuth from "./config/provider/RequireAuth";
import ForgetPassword from "./AtomicComponents/pages/ForgetPassword/ForgetPassword";
import ScrollToTop from "./others/ScrollToTop";
import CommonLayout from "./AtomicComponents/pages/CommonLayouts/GuestCommonLayout/CommonLayout";
import StaffCommonLayout from "./AtomicComponents/pages/CommonLayouts/StaffCommonLayout/StaffCommonLayout";
import StaffHomePage from "./AtomicComponents/pages/Staff/HomePage/StaffHomePage";
import AddPlayerByImport from "./AtomicComponents/pages/Staff/AddPlayerByImport/AddPlayerByImport";
import "react-tooltip/dist/react-tooltip.css";

const AppRoutes = () => {
	const { auth } = useAuth();
	const [toastPosition, setToastPosition] = useState("top-right");

	useEffect(() => {
		const checkScreen = () => {
			setToastPosition(window.innerWidth <= 480 ? "top-center" : "top-right");
		};

		checkScreen();
		window.addEventListener("resize", checkScreen);
		return () => window.removeEventListener("resize", checkScreen);
	}, []);

	const renderRoutesByRole = () => {
		const role = auth?.role;

		switch (role) {
			case undefined:
				return (
					<Route
						path='/'
						element={<CommonLayout />}
					>
						<Route
							index
							element={<HomePage />}
						/>
					</Route>
				);

			case "STAFF":
				return (
					<Route element={<PersistLogin />}>
						<Route element={<RequireAuth allowedRoles={["STAFF"]} />}>
							<Route
								path='/'
								element={<StaffCommonLayout />}
							>
								<Route
									index
									element={<StaffHomePage />}
								/>
								<Route
									path='my-profile'
									element={<h1>My Profile</h1>}
								/>

								<Route path='player-management'>
									<Route
										path='player-list'
										element={<h1>Player List</h1>}
									/>

									<Route
										path='add-player'
										element={<AddPlayerByImport />}
									/>
								</Route>
							</Route>
						</Route>
					</Route>
				);

			case "ADMIN":
				return (
					<Route element={<PersistLogin />}>
						<Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
							<Route
								path='/'
								element={<AdminPage />}
							>
								<Route
									index
									element={<h1>close</h1>}
								/>
							</Route>
						</Route>
					</Route>
				);

			case "ORGANIZER":
				return (
					<Route element={<PersistLogin />}>
						<Route element={<RequireAuth allowedRoles={["ORGANIZER"]} />}>
							<Route
								path='/'
								element={<h1>Organizer page</h1>}
							/>
						</Route>
					</Route>
				);

			default:
				return (
					<Route
						path='/'
						element={<h1>Not yet</h1>}
					/>
				);
		}
	};

	return (
		<ScrollToTop>
			<Toaster position={toastPosition} />
			<Routes>
				{renderRoutesByRole()}
				<Route
					path='reset-password/:token'
					element={<ForgetPassword />}
				/>
				<Route
					path='*'
					element={<h1 className='text-h1 text-red-500'>Adu Ang Seng</h1>}
				/>
			</Routes>
		</ScrollToTop>
	);
};

export default AppRoutes;
