import Logo from "../../../assets/icon/dasrs-logo.png";
import { SidebarIcon } from "../../../assets/icon-svg";
import { Link } from "react-router-dom";
import Connector from "../../../assets/icon/dasrs-logo.png";

export default function Header() {
  return (
    <div className="flex justify-between items-center p-4">
      {/* Left Side: Logo + Title */}
      <div className="logo-container flex items-center gap-4">
        <img src={Logo} className="h-20 bg-blue-500 rounded-full p-2" />
        <h3 className="text-h5 bg-blue-500 text-white px-standard-x py-standard-y rounded-lg">
          Driving Assistant Support Racing System
        </h3>
      </div>

      {/* Right Side: Lumpy Nav + Circle Icon */}
      <div className="flex items-center group gap-10">
        {/* First Item */}
        <ul className="hidden group-hover:flex">
          <li
            className={`relative bg-gray-700 text-white px-standard-x py-standard-y rounded-3xl
        after:content-[''] after:absolute 
        after:w-16 after:h-8
        after:top-1/2 after:-translate-y-1/2
        after:z-2
        after:bg-[url("${Connector}")] 
        after:bg-cover after:bg-center after:bg-no-repeat after:bg-transparent`}
          >
            <Link>Kamehameha</Link>
          </li>
        </ul>

        <div className={`bg-[url(${Connector})] w-10 h-8`} />

        {/* Circle button with the icon. Offset to overlap the last pill */}
        <button
          type="button"
          className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center"
        >
          <SidebarIcon className="w-6 h-6" color={"white"} />
        </button>
      </div>
    </div>
  );
}
