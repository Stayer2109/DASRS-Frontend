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
			links: [{ text: "Overview", path: "/overview" }],
		},
		{
			title: "Results",
			links: [
				{ text: "Race Results", path: "/race-results" },
				{ text: "Standing", path: "/standing" },
				{ text: "Jeddah Race Report S2", path: "/jeddah-s2" },
				{ text: "Doha Race Report S2", path: "/doha-s2" },
				{ text: "Season 1 Results", path: "/season-1-results" },
			],
		},
		{
			title: "News & Media",
			links: [
				{ text: "Latest News & Media", path: "/latest-news" },
				{ text: "All News", path: "/all-news" },
				{ text: "All Media", path: "/all-media" },
				{ text: "Inside E1 Docuseries", path: "/inside-e1-docuseries" },
			],
		},
		{
			title: "Team & Pilots",
			links: [{ text: "Team & Pilots", path: "/team-pilots" }],
		},
	];

	const footerLinks = [
		"Contact",
		"FAQs",
		"How to watch",
		"Media",
		"Partners",
		"Store",
	];

	const navHoverStyle = "hover:text-lime-300";

	return (
		<footer className='h-auto w-full py-6 px-standard-x bg-gray-main text-white'>
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
						<div className='sm:row-start-1 grid grid-cols-2 gap-x-50 gap-y-10'>
							{infoLinks.map(({ title, links }) => (
								<ul key={title}>
									<h1 className='text-3xl text-lime-300 mb-3'>{title}</h1>
									{links.map(({ text, path }) => (
										<li
											key={text}
											className={navHoverStyle}
										>
											<Link
												to={path}
												className='text-h4'
											>
												{text}
											</Link>
										</li>
									))}
								</ul>
							))}
						</div>
						<div className='row-start-2 mt-8 h-auto'>
							<ul className='flex gap-5'>
								{footerLinks.map((item, index) => (
									<li key={index}>
										<Link className={`${navHoverStyle} text-h4`}>{item}</Link>
									</li>
								))}
							</ul>
						</div>
					</div>

					{/* Divine Line*/}
					<div className='divine-line self-stretch mt-6 sm:mt-0 h-1 sm:h-[0.5px] bg-[#464646]' />

					{/* Image */}
					<div className='images-show flex flex-col items-start'>
						<img
							src={RacingThunder}
							className='h-80 w-auto rounded-[12px]'
							alt='Logo'
						/>
						<h2 className='text-h2 w-[500px]'>
							<strong>Dive into exclusive insights </strong>
							and unparalleled experiences
						</h2>
					</div>
				</nav>
			</div>

			{/* Divider */}
			<div className='w-full h-[0.5px] bg-[#464646]' />

			{/* Logo and Socials*/}
			<div className='flex justify-between pt-6'>
				<div className=''>
					<img
						src={Logo}
						className='w-32 bg-blue-500 rounded-full p-2'
					/>
					<p className='text-[12px] mt-8'>
						Copyright © 2025 DASRS, All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
