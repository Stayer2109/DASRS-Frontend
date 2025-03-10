/** @format */

import { useState } from "react";
import "./Button.scss";
import PropTypes from "prop-types";

const Button = ({
	className = "",
	content = "Button",
	onClick = () => {},
	bgColor = "#4683FF", // Default color is blue
	type = "button",
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const darkenColor = (hex, percent) => {
		let r = parseInt(hex.substring(1, 3), 16);
		let g = parseInt(hex.substring(3, 5), 16);
		let b = parseInt(hex.substring(5, 7), 16);

		r = Math.floor(r * (1 - percent));
		g = Math.floor(g * (1 - percent));
		b = Math.floor(b * (1 - percent));

		return `rgb(${r}, ${g}, ${b})`;
	};

	// HANDLE HOVER EVENTS
	const handleHover = () => setIsHovered(true);
	const handleLeave = () => setIsHovered(false);

	return (
		<button
			className={`${className} px-standard-x py-standard-y rounded-[12px] cursor-pointer transition-all duration-300 ease-linear`}
			onMouseEnter={handleHover}
			onMouseLeave={handleLeave}
			type={type}
			onClick={onClick}
			style={{
				backgroundColor: isHovered ? darkenColor(bgColor, 0.2) : bgColor, // Darkens background on hover
				color: "#ffffff", // Keep text color white
			}}
		>
			{content}
		</button>
	);
};

Button.propTypes = {
	className: PropTypes.string,
	content: PropTypes.string,
	onClick: PropTypes.func,
	bgColor: PropTypes.string,
	type: PropTypes.string,
};

export default Button;
