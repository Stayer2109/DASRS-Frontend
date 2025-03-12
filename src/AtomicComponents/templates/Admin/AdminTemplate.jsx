/** @format */

import { useEffect, useState } from "react";
import { MainContent } from "@/AtomicComponents/organisms/MainContent/MainContent";
import { AdminHeader } from "@/AtomicComponents/molecules/AdminHeader/AdminHeader";
import { Sidebar } from "@/AtomicComponents/organisms/Sidebar/Sidebar";
import useRefreshToken from "@/hooks/useRefreshToken";

const AdminTemplate = () => {
	const [activeTab, setActiveTab] = useState("overview");
	const refreshToken = useRefreshToken();

	useEffect(() => {
		const getToken = async () => {
			await refreshToken(); // Call the function
		};

		getToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className='flex h-screen bg-gray-50'>
			<Sidebar
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>

			{/* Main Content */}
			<div className='flex-1 overflow-auto'>
				<AdminHeader activeTab={activeTab} />
				<MainContent activeTab={activeTab} />
			</div>
		</div>
	);
};

export default AdminTemplate;
