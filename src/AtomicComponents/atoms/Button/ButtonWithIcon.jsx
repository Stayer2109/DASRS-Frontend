/** @format */

import PropTypes from "prop-types";
import "./ButtonWithIcon.scss";
import { LongRightArrowIcon, RightConnector } from "@/assets/icon-svg";
import { useState } from "react";

const ButtonWithIcon = ({
	content,
	className,
	onClick,
	bgColor = "#0000FF",
}) => {
	const [isHovered, setIsHovered] = useState(false);

	// DARKEN COLOR FUNCTION
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
		<div className='cursor-pointer button-container flex items-center gap-2 relative group z-1'>
			<button
				className={`${className} px-4 py-3 rounded-3xl cursor-pointer hover:`}
				onClick={onClick}
				style={{ backgroundColor: bgColor }}
				onMouseEnter={handleHover}
				onMouseLeave={handleLeave} // Reset hover state when leaving
			>
				{content}
			</button>

			<div className='absolute left-[53%] translate-x-[65%] z-0'>
				<RightConnector
					color={bgColor}
					width={64}
				/>
			</div>

			{/* ICON CONTAINER (HOVER TO DARKEN BACKGROUND) */}
			<div
				style={{
					backgroundColor: bgColor, // Keep original background color
					transition: "background-color 0.3s ease-in-out",
				}}
				className='rounded-full p-1 flex items-center justify-center icon-container z-1'
				onMouseEnter={handleHover}
				onMouseLeave={handleLeave}
			>
				<div
					className='rounded-full flex items-center justify-center'
					style={{
						backgroundColor: isHovered ? darkenColor(bgColor, 0.15) : bgColor, // Only this part darkens
						transition: "background-color 0.3s ease-in-out",
					}}
				>
					<LongRightArrowIcon
						style={{
							fill: isHovered ? darkenColor(bgColor, 0.2) : bgColor, // Darkens fill slightly more
							transition: "fill 0.5s ease-in-out",
						}}
						className='right-icon p-1 rounded-full'
						width={40}
						height={40}
					/>
				</div>
			</div>
		</div>
	);
};

ButtonWithIcon.propTypes = {
	content: PropTypes.string.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func.isRequired,
	bgColor: PropTypes.string,
};

export default ButtonWithIcon;
