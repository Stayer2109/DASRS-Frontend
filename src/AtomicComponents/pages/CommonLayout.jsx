/** @format */

import { Outlet } from "react-router-dom";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header/Header";

const CommonLayout = () => {
	return (
		<>
			<Header />
			<div className='page-layout-body px-standard-x py-standard-y'>
				<Outlet />
			</div>
			<Footer />
		</>
	);
};

export default CommonLayout;
