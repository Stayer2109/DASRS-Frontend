/** @format */
import "./App.scss";

import AppRoutes from "./AppRoutes";
import ScrollToTop from "./others/ScrollToTop";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
	return (
		<>
			<Router>
				<ScrollToTop>
					<AppRoutes />
				</ScrollToTop>
			</Router>
		</>
	);
}

export default App;
