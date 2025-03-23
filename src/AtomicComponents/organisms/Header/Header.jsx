/** @format */

import Logo from "../../../assets/icon/dasrs-logo.png";
import { CancelIcon, SidebarIcon } from "../../../assets/icon-svg";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Header.scss";

export default function Header() {
  const [isTop, setIsTop] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  const [isClosedClicked, setIsClosedClicked] = useState(true); // Close button state

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 20); // Change threshold as needed
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {}, []);

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

  // NAV FULL ITEMS
  const navFullItems = [
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
    {
      navLink: "Kaioken",
      url: "/kaioken",
    },
    {
      navLink: "Solar Flare",
      url: "/solar-flare",
    },
    {
      navLink: "Destructo Disc",
      url: "/destructo-disc",
    },
    {
      navLink: "Chidori",
      url: "/chidori",
    },
    {
      navLink: "Rasengan",
      url: "/rasengan",
    },
    {
      navLink: "Adu ang Seng",
      url: "/adu-ang-seng",
    },
    {
      navLink: "Remind Ne",
      url: "/remind-ne",
    },
  ];

  // TOGGLE SIDEBAR
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    setIsClosedClicked(false);

    if (!isClosedClicked) {
      setTimeout(() => {
        setIsClosedClicked(true);
      }, 500);
    }
  };

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
      className={`header-container fixed left-0 right-0 top-0 z-50 flex justify-between sm:items-center px-5 py-3 sm:px-standard-x sm:py-standard-y
        transition-all duration-500 ease-in-out
        ${isTop ? "bg-transparent backdrop-blur-none" : "bg-blue-500"}`}
      style={{
        transition: "background-color 0.5s ease, backdrop-filter 0.5s ease",
      }}
    >
      {/* Left Side: Logo + Title */}
      <div className="logo-container sm:flex items-center gap-4">
        {/* Alt text for accessibility */}
        <img
          src={Logo}
          alt="DASRS Logo"
          className="h-13 sm:h-20 bg-lime-300 rounded-full p-2 sm:p-2"
        />
        <h3
          className="hidden sm:block text-h6 sm:text-h5 bg-lime-300 text-black 
          px-standard-x py-standard-y rounded-lg"
        >
          Driving Assistant Support Racing System
        </h3>
      </div>

      {/* Right Side: Lumpy Nav + Circle Icon */}
      <nav className="flex items-center group relative">
        {/* Sliding nav items */}
        <ul
          className={`${
            !isClosedClicked ? "hidden" : ""
          } flex gap-2 absolute item-container w-[480px] transition-all duration-450 ease-in-out 
          flex-nowrap opacity-0 group-hover:opacity-100 scale-0 group-hover:scale-100 right-0 transform translate-x-[400px] 
          group-hover:-translate-x-[60px]`}
        >
          {navItems.map((item, index) => (
            <li className={pillClass} key={index}>
              <Link to={item.url} className={linkClass}>
                {item.navLink}
              </Link>
            </li>
          ))}
        </ul>

        {/* Circle button with the icon (overlaps the last pill) */}
        <button
          type="button"
          className="bg-gray-nav w-13 h-13 sm:w-16 sm:h-16 rounded-full flex items-center justify-center z-1 group cursor-pointer"
          onClick={() => {
            toggleSidebar();
          }}
        >
          <SidebarIcon
            className="w-7 h-7 sm:w-6 sm:h-6 group-hover:rotate-360 group-hover:scale-150
            transition ease-[cubic-bezier(0.68, 0.19, 0.45, 0.82)] duration-700"
            color="white"
          />
        </button>

        {/* Dark Overlay (For Background Dim Effect) */}
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-500 
          ${
            isSidebarOpen
              ? "opacity-55 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } z-1`}
          onClick={toggleSidebar} // Clicking outside closes the sidebar
        />

        {/* Sidebar Menu (Slides in from the right) */}
        <div
          className={`fixed top-0 right-0 h-full w-full sm:h-full sm:w-[22%] bg-gray-900 text-white shadow-lg 
            transform transition-transform duration-500 overflow-y-auto z-2 ${
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-3 right-6 sm:top-4 sm:right-4 bg-gray-700 rounded-full hover:bg-gray-600 cursor-pointer z-3"
            onClick={() => toggleSidebar()}
          >
            <CancelIcon
              height={54}
              width={54}
              color={"white"}
              className="close-icon transitions duration-150 ease-linear hover:scale-120 p-3 sm:p-2"
            />
          </button>

          {/* Nav Items */}
          <ul className="flex flex-col gap-5 sm:gap-3 mt-8">
            {navFullItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.url}
                  className="sidebar-items block px-8 py-4 sm:px-standard-x sm:py-4 text-mobile-h6 sm:text-h3"
                >
                  {item.navLink}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
