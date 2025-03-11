/** @format */
import "./App.scss";

import AppRoutes from "./AppRoutes";
import ScrollToTop from "./Other/ScrollToTop";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
	return (
		<>
			<ScrollToTop>
				<Router>
					<AppRoutes />
				</Router>
			</ScrollToTop>
		</>
	);
}

export default App;
