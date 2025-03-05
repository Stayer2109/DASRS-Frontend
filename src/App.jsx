/** @format */
import "./App.scss";

import AppRoutes from "./AppRoutes";
import ScrollToTop from "./Other/ScrollToTop";

function App() {
	return (
		<>
			<ScrollToTop>
				<AppRoutes />
			</ScrollToTop>
		</>
	);
}

export default App;
