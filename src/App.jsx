/** @format */
import "./App.scss";

import AppRoutes from "./AppRoutes";
import ScrollToTop from "./Other/ScrollToTop";
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
