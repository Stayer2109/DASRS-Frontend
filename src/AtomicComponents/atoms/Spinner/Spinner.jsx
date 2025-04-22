/** @format */

import { useEffect } from "react";
import ReactDOM from "react-dom";
import "./Spinner.scss";

const Spinner = () => {
	useEffect(() => {
		document.body.classList.add("loading");
		return () => {
			document.body.classList.remove("loading");
		};
	}, []);

	// 🔥 Render into <body> using portal to escape normal z-index stacking
	return ReactDOM.createPortal(
		<div className='loader-container'>
			<div className='loader' />
		</div>,
		document.body
	);
};

export default Spinner;
