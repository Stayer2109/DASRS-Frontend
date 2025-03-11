/** @format */

export const SidebarIcon = ({ className, color, height, width, ...props }) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<path
					d='M2 6C2 5.44772 2.44772 5 3 5H21C21.5523 5 22 5.44772 22 6C22 6.55228 21.5523 7 21 7H3C2.44772 7 2 6.55228 2 6Z'
					fill={color ? color : "#000000"}
				></path>{" "}
				<path
					d='M2 12C2 11.4477 2.44772 11 3 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H3C2.44772 13 2 12.5523 2 12Z'
					fill={color ? color : "#000000"}
				></path>{" "}
				<path
					d='M3 17C2.44772 17 2 17.4477 2 18C2 18.5523 2.44772 19 3 19H21C21.5523 19 22 18.5523 22 18C22 17.4477 21.5523 17 21 17H3Z'
					fill={color ? color : "#000000"}
				></path>{" "}
			</g>
		</svg>
	);
};

export const LeftArrowIcon = ({
	className,
	color,
	height,
	width,
	onClick,
	...props
}) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			onClick={onClick}
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<path
					d='M6 12H18M6 12L11 7M6 12L11 17'
					stroke={color ? color : "#000000"}
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>{" "}
			</g>
		</svg>
	);
};

export const RightArrowIcon = ({
	className,
	color,
	height,
	width,
	...props
}) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<path
					d='M6 12H18M18 12L13 7M18 12L13 17'
					stroke={color ? color : "#000000"}
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>{" "}
			</g>
		</svg>
	);
};

export const LongRightArrowIcon = ({
	className,
	color,
	height,
	width,
	...props
}) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<path
					d='M5 12H19M19 12L13 6M19 12L13 18'
					stroke={color ? color : "#000000"}
					strokeWidth='2'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>{" "}
			</g>
		</svg>
	);
};

export const RightConnector = ({
	className,
	color,
	height,
	width,
	style,
	...props
}) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 69 52'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
			style={style}
		>
			<path
				id='Vector'
				d='M24.2738 44.0352L19.893 39.2517C15.7224 34.6985 8.55137 34.6985 4.38085 39.2517L0 44.0319L0 7.94179L4.37757 12.722C8.54809 17.2752 15.7191 17.2752 19.8897 12.722L24.2672 7.94179C28.9965 3.03328 35.6351 0 42.9836 0C57.329 0 68.9565 11.6396 68.9565 26C68.9565 40.3604 57.329 52 42.9836 52C35.6351 52 28.9997 48.9437 24.2738 44.0352Z'
				fill={color ? color : "#000000"}
			/>
		</svg>
	);
};

export const CancelIcon = ({
	className,
	color,
	height,
	width,
	style,
	...props
}) => {
	return (
		<svg
			fill={color ? color : "#000000"}
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 32 32'
			version='1.1'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<title>cancel2</title>{" "}
				<path d='M19.587 16.001l6.096 6.096c0.396 0.396 0.396 1.039 0 1.435l-2.151 2.151c-0.396 0.396-1.038 0.396-1.435 0l-6.097-6.096-6.097 6.096c-0.396 0.396-1.038 0.396-1.434 0l-2.152-2.151c-0.396-0.396-0.396-1.038 0-1.435l6.097-6.096-6.097-6.097c-0.396-0.396-0.396-1.039 0-1.435l2.153-2.151c0.396-0.396 1.038-0.396 1.434 0l6.096 6.097 6.097-6.097c0.396-0.396 1.038-0.396 1.435 0l2.151 2.152c0.396 0.396 0.396 1.038 0 1.435l-6.096 6.096z'></path>{" "}
			</g>
		</svg>
	);
};

export const LoginIcon = ({
	className,
	color,
	height,
	width,
	style,
	...props
}) => {
	return (
		<svg
			width={width ? width : "32px"}
			height={height ? height : "32px"}
			className={className}
			viewBox='0 0 24 24'
			fill='none'
			xmlns='http://www.w3.org/2000/svg'
		>
			<g
				id='SVGRepo_bgCarrier'
				strokeWidth='0'
			></g>
			<g
				id='SVGRepo_tracerCarrier'
				strokeLinecap='round'
				strokeLinejoin='round'
			></g>
			<g id='SVGRepo_iconCarrier'>
				{" "}
				<path
					d='M8 16C8 18.8284 8 20.2426 8.87868 21.1213C9.75736 22 11.1716 22 14 22H15C17.8284 22 19.2426 22 20.1213 21.1213C21 20.2426 21 18.8284 21 16V8C21 5.17157 21 3.75736 20.1213 2.87868C19.2426 2 17.8284 2 15 2H14C11.1716 2 9.75736 2 8.87868 2.87868C8 3.75736 8 5.17157 8 8'
					stroke='#1C274C'
					strokeWidth='1.5'
					strokeLinecap='round'
				></path>{" "}
				<path
					opacity='0.5'
					d='M8 19.5C5.64298 19.5 4.46447 19.5 3.73223 18.7678C3 18.0355 3 16.857 3 14.5V9.5C3 7.14298 3 5.96447 3.73223 5.23223C4.46447 4.5 5.64298 4.5 8 4.5'
					stroke='#1C274C'
					strokeWidth='1.5'
				></path>{" "}
				<path
					d='M6 12L15 12M15 12L12.5 14.5M15 12L12.5 9.5'
					stroke='#1C274C'
					strokeWidth='1.5'
					strokeLinecap='round'
					strokeLinejoin='round'
				></path>{" "}
			</g>
		</svg>
	);
};
