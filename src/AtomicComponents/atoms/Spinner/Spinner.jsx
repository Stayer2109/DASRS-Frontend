/** @format */

import { useEffect } from "react";
import "./Spinner.scss";

const Spinner = () => {
	useEffect(() => {
		// Disable scrolling when the spinner is mounted
		document.body.style.overflow = "hidden";

		return () => {
			// Enable scrolling when the spinner is unmounted
			document.body.style.overflow = "auto";
		};
	}, []);

	return (
		<div className='loader-container'>
			<div className='loader'></div>
		</div>
	);
};

export default Spinner;
