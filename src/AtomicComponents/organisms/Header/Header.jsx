/** @format */

import Logo from "../../../assets/icon/dasrs-logo.png";
import { SidebarIcon } from "../../../assets/icon-svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
	const [isTop, setIsTop] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			setIsTop(window.scrollY < 20); // Change threshold as needed
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// NAV ITEMS
	const navItems = [
		{
			navLink: "Kamehameha",
			url: "/kamehameha",
		},
		{
			navLink: "Spirit Bomb",
			url: "/spirit-bomb",
		},
		{
			navLink: "Instant Transmission",
			url: "/instant-transmission",
		},
	];

	// PILL CLASS
	const pillClass = `relative bg-gray-nav text-white rounded-3xl after:content-[''] right-[8px] px-[8px] py-1
    after:absolute after:w-14 after:h-8 after:top-1/2 after:-translate-y-1/2
    after:right-[-32px]
    after:bg-[url(/src/assets/icon/connector.png)] after:bg-cover after:bg-center 
    after:bg-no-repeat after:bg-transparent`;

	// LINK CLASS
	const linkClass = `relative px-standard-x block leading-8 before:absolute before:top-0 before:left-0 before:z-[-1] 
    before:h-full before:w-0 before:bg-gray-main-hover before:transition-all before:duration-500 
    hover:before:w-full before:opacity-0 hover:before:opacity-100 before:rounded-3xl 
    trasition ease-[cubic-bezier(0.4, 0, 1, 1)] duration-150 z-1`;

	return (
		<header
			className={`fixed left-0 right-0 top-0 z-50 flex justify-between items-center px-standard-x py-standard-y
        transition-all duration-500 ease-in-out
        ${isTop ? "bg-transparent backdrop-blur-none" : "bg-blue-500"}`}
			style={{
				transition: "background-color 0.5s ease, backdrop-filter 0.5s ease",
			}}
		>
			{/* Left Side: Logo + Title */}
			<div className='logo-container flex items-center gap-4'>
				{/* Alt text for accessibility */}
				<img
					src={Logo}
					alt='DASRS Logo'
					className='h-20 bg-lime-300 rounded-full p-2'
				/>
				<h3 className='text-h5 bg-lime-300 text-black px-standard-x py-standard-y rounded-lg'>
					Driving Assistant Support Racing System
				</h3>
			</div>

			{/* Right Side: Lumpy Nav + Circle Icon */}
			<nav className='flex items-center group'>
				{/* Sliding Nav Items */}
				<div
					className='item-container w-auto translate-y-[2px] scale-0 translate-x-50
             transition duration-400 ease-in-out group-hover:translate-x-0 group-hover:scale-100
             group-hover:opacity-100'
				>
					<ul className='flex gap-2'>
						{navItems.map((item, index) => (
							<li
								className={pillClass}
								key={index}
							>
								<Link
									to={item.url}
									className={linkClass}
								>
									{item.navLink}
								</Link>
							</li>
						))}
					</ul>
				</div>

				{/* Circle button with the icon (overlaps the last pill) */}
				<button
					type='button'
					className='bg-gray-nav w-18 h-18 rounded-full flex items-center justify-center z-1 group'
				>
					<SidebarIcon
						className='w-6 h-6 group-hover:rotate-360 group-hover:scale-150 
            transition ease-[cubic-bezier(0.68, 0.19, 0.45, 0.82)] duration-700'
						color='white'
					/>
				</button>
			</nav>
		</header>
	);
}
