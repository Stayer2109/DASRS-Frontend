import Logo from "../../../assets/icon/dasrs-logo.png";
import { SidebarIcon } from "../../../assets/icon-svg";
import { Link } from "react-router-dom";
import Connector from "../../../assets/icon/connector.jpg";

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
      <div className="flex items-center group">
        {/* First Item */}
        <div className="item-container hidden group-hover:flex group-hover:gap-2">
          <ul>
            <li
              className={`relative bg-gray-main text-white px-standard-x py-standard-y rounded-3xl z-1 after:content-[''] right-[8px]
              after:absolute after:w-14 after:h-8 after:top-1/2 after:-translate-y-1/2 after:z-[-1]
              after:right-[-32px]
              after:bg-[url(/src/assets/icon/connector.png)] after:bg-cover after:bg-center 
              after:bg-no-repeat after:bg-transparent`}
            >
              <Link>Kamehameha</Link>
            </li>
          </ul>

          {/* Second Item */}
          <ul>
            <li
              className={`relative bg-gray-main text-white px-standard-x py-standard-y rounded-3xl z-1 after:content-[''] right-[8px]
              after:absolute after:w-16 after:h-8 after:top-1/2 after:-translate-y-1/2 after:z-[-1]
              after:right-[-36px]
              after:bg-[url(/src/assets/icon/connector.png)] after:bg-cover after:bg-center 
              after:bg-no-repeat after:bg-transparent`}
            >
              <Link>Rasengan</Link>
            </li>
          </ul>

          {/* Third Item */}
          <ul>
            <li
              className={`relative bg-gray-main text-white px-standard-x py-standard-y rounded-3xl z-1 after:content-[''] right-[8px]
              after:absolute after:w-16 after:h-8 after:top-1/2 after:-translate-y-1/2 after:z-[-1]
              after:right-[-36px]
              after:bg-[url(/src/assets/icon/connector.png)] after:bg-cover after:bg-center 
              after:bg-no-repeat after:bg-transparent`}
            >
              <Link>Boom</Link>
            </li>
          </ul>
        </div>

        {/* Circle button with the icon. Offset to overlap the last pill */}
        <button
          type="button"
          className="bg-gray-main w-14 h-14 rounded-full flex items-center justify-center z-1"
        >
          <SidebarIcon className="w-6 h-6" color={"white"} />
        </button>
      </div>
    </div>
  );
}
