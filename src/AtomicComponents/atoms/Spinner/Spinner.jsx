/** @format */

import { useEffect } from "react";
import "./Spinner.scss";

const Spinner = () => {
	useEffect(() => {
		// Add the "loading" class to the body when the spinner mounts
		document.body.classList.add("loading");

		return () => {
			// Remove the "loading" class when the spinner unmounts
			document.body.classList.remove("loading");
		};
	}, []);

	return (
		<div className='loader-container'>
			<div className='loader' />
		</div>
	);
};

export default Spinner;
