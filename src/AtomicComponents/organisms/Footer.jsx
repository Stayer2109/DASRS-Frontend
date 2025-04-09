/** @format */
import { Link } from "react-router-dom";
import FPTSponsorLogo from "../../assets/img/fpt-logo.png";
import Logo from "../../assets/icon//dasrs-logo.png";
import RacingThunder from "../../assets/img/racing-thunder.jpg";

const Footer = () => {
	// Footer's links
	const infoLinks = [
		{
			title: "Race Calendar",
			links: [{ text: "Overview", path: "/" }],
		},
		{
			title: "Results",
			links: [
				{ text: "Race Results", path: "/" },
				{ text: "Standing", path: "/" },
				{ text: "Jeddah Race Report S2", path: "/" },
				{ text: "Doha Race Report S2", path: "/" },
				{ text: "Season 1 Results", path: "/" },
			],
		},
		{
			title: "News & Media",
			links: [
				{ text: "Latest News & Media", path: "/" },
				{ text: "All News", path: "/" },
				{ text: "All Media", path: "/" },
				{ text: "Inside E1 Docuseries", path: "/" },
			],
		},
		{
			title: "Team & Pilots",
			links: [{ text: "Team & Pilots", path: "/" }],
		},
	];

	const footerLinks = [
		"Contact",
		"FAQs",
		"Media",
		"Partners",
	];

	const navHoverStyle = "hover:text-lime-300";

	return (
		<footer className="w-full max-w-none bg-gray-main text-white px-0 py-6">

			{/* Sponsor Container */}
			<div
				id='sponsor-container'
				className='flex justify-center py-standard-y'
			>
				{/* Provide alt text for better accessibility */}
				<img
					src={FPTSponsorLogo}
					alt='FPT Sponsor Logo'
					className='w-[80%] sm:w-xl bg-gray-100 rounded-[8px]'
				/>
			</div>

			{/* Divider */}
			<div className='w-full mt-6 sm:mt-0 h-1 sm:h-[0.5px] bg-[#464646]' />

			{/* Information Section */}
			<div className='information-container p-4 sm:py-2'>

				{/* Using a semantic section or nav could help screen readers */}
				<nav className='flex items-center justify-between flex-col sm:flex-row'>
					{/* Information */}
					<div className='information grid grid-rows-[auto_auto]'>
						<div className='sm:row-start-1 grid gap-x-10 grid-cols-2 sm:gap-x-50 gap-y-10'>
							{infoLinks.map(({ title, links }) => (
								<ul key={title}>
									<h1 className='text-2xl sm:text-3xl text-lime-300 mb-3 font-bold'>{title}</h1>
									{links.map(({ text, path }) => (
										<li
											key={text}
											className={navHoverStyle}
										>
											<Link
												to={path}
												className='text-h3'
											>
												{text}
											</Link>
										</li>
									))}
								</ul>
							))}
						</div>

						<div className="row-start-2 mt-8 h-auto flex justify-center">
							<ul className="flex flex-wrap justify-center gap-4 sm:gap-8">
								{footerLinks.map((item, index) => (
									<li key={index}>
										<Link to="#" className={`${navHoverStyle} text-h4`}>{item}</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Divine Line*/}
					<div className='hidden sm:block divine-line self-stretch w-[0.5px] bg-[#464646]' />

					{/* Image */}
					<div className='images-show flex flex-col items-start'>
						<img
							src={RacingThunder}
							className='h-80 w-auto rounded-[12px]'
							alt='Logo'
						/>
						<h2 className='text-h2 sm:text-h3 sm:w-[500px] text-center'>
							<strong>Dive into exclusive insights </strong>
							and unparalleled experiences
						</h2>
					</div>
				</nav>
			</div>

			{/* Divider */}
			<div className='w-full mt-6 sm:mt-0 h-1 sm:h-[0.5px] bg-[#464646]' />

			{/* Logo and Socials*/}
			<div className='flex justify-between pt-6'>
				<div className='flex items-center flex-col sm:flex-row sm:gap-5 sm:m-0 m-auto'>
					<img
						src={Logo}
						className='w-32 bg-blue-500 rounded-full p-2'
					/>
					<p className='text-h5 sm:text-[12px] sm:mt-3 mt-4'>
						Copyright © 2025 DASRS, All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
