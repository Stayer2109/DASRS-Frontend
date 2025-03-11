/** @format */

import "./CircularButton.scss";
import PropTypes, { object } from "prop-types";

const CircularButton = ({
	className = "",
	content = "",
	icon = object,
	onClick = () => {},
	noBackground = false,
}) => {
	return (
		<>
			{noBackground ? (
				<button
					className={`circular-btn rounded-full text-white font-bold
        w-fit p-3 cursor-pointer z-10 gap-2 bg-tran
        flex items-center justify-center ${className}`}
					onClick={onClick}
				>
					{content && <p>{content}</p>}
					{icon}
				</button>
			) : (
				<button
					className={`circular-btn rounded-full bg-blue-500 text-white font-bold
        w-fit p-3 cursor-pointer z-10 gap-2
        flex items-center justify-center shadow-md 
        hover:bg-blue-700 transition-all ${className}`}
					onClick={onClick}
				>
					{content && <p>{content}</p>}
					{icon}
				</button>
			)}
		</>
	);
};

CircularButton.propTypes = {
	className: PropTypes.string,
	content: PropTypes.string,
	icon: PropTypes.object,
	onClick: PropTypes.func,
	noBackground: PropTypes.bool,
};

export default CircularButton;
