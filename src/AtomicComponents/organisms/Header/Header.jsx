/** @format */

import Logo from "../../../assets/icon/dasrs-logo.png";
import { SidebarIcon } from "../../../assets/icon-svg";
import { Link } from "react-router-dom";

export default function Header() {
  // Nav Items
  const navItems = ["Kamehameha", "Rasengan", "Boom"];

  // Pill Class
  const pillClass = `relative bg-gray-nav text-white rounded-3xl after:content-[''] right-[8px] px-[8px] py-1
    after:absolute after:w-14 after:h-8 after:top-1/2 after:-translate-y-1/2
    after:right-[-32px]
    after:bg-[url(/src/assets/icon/connector.png)] after:bg-cover after:bg-center 
    after:bg-no-repeat after:bg-transparent`;

  // Link Class
  const linkClass = `relative px-standard-x block leading-8 before:absolute before:top-0 before:left-0 before:z-[-1] 
    before:h-full before:w-0 before:bg-gray-main-hover before:transition-all before:duration-500 
    hover:before:w-full before:opacity-0 hover:before:opacity-100 before:rounded-3xl 
    trasition ease-[cubic-bezier(0.4, 0, 1, 1)] duration-150 z-1`;

  return (
    <header className="flex justify-between items-center p-4">
      {/* Left Side: Logo + Title */}
      <div className="logo-container flex items-center gap-4">
        {/* Alt text for accessibility */}
        <img
          src={Logo}
          alt="DASRS Logo"
          className="h-20 bg-blue-500 rounded-full p-2"
        />
        <h3 className="text-h5 bg-blue-500 text-white px-standard-x py-standard-y rounded-lg">
          Driving Assistant Support Racing System
        </h3>
      </div>

      {/* Right Side: Lumpy Nav + Circle Icon */}
      <nav className="flex items-center group">
        {/* Sliding Nav Items */}
        <div
          className="item-container w-auto translate-x-[100px] opacity-0 translate-y-[2px] 
             transition duration-300 ease-in-out group-hover:translate-x-0 
             group-hover:opacity-100"
        >
          <ul className="flex gap-2">
            {navItems.map((item) => (
              <li className={pillClass} key={item}>
                <Link to="#" className={linkClass}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Circle button with the icon (overlaps the last pill) */}
        <button
          type="button"
          className="bg-gray-nav w-18 h-18 rounded-full flex items-center justify-center z-1 group"
        >
          <SidebarIcon
            className="w-6 h-6 group-hover:rotate-360 group-hover:scale-150 
            transition ease-[cubic-bezier(0.68, 0.19, 0.45, 0.82)] duration-700"
            color="white"
          />
        </button>
      </nav>
    </header>
  );
}
