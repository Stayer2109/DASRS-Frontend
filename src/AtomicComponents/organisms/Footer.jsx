/** @format */
import FPTSponsorLogo from "../../assets/img/fpt-logo.jpg";

const Footer = () => {
	return (
		<footer className='h-auto py-standard-y bg-gray-main text-white'>
			<div
				id='sponsor-container'
				className='flex justify-center py-standard-y'
			>
				<img
					src={FPTSponsorLogo}
					className='w-xl'
				/>
			</div>

			{/* Divider */}
			<div className='w-full h-[2px] bg-gray-400' />

			{/* Information about website such as calendar, results, news, ... */}
		</footer>
	);
};

export default Footer;
