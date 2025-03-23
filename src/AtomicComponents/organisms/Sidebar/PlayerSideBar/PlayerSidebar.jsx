import { HomeIcon, LogoutIcon, SidebarIcon, UserIcon } from "@/assets/icon-svg";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiAuth } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useNavigate } from "react-router-dom";

const PlayerSidebar = ({ isOpened = false, onToggle = () => {} }) => {
  const { setAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navBarIconClass =
    "navbar-icon group-hover:stroke-black transition-color duration-300 ease-in-out";
  const navBarIconColor = "#FAF9F6";
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const jwtToken = Cookies.get("accessToken");
  const navigate = useNavigate();

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await apiAuth.post(
        "auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );

      if (response.data.http_status === 200) {
        setAuth(null); // 👈 Clear the auth context
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const sideBarItems = [
    {
      item: "Home",
      icon: <HomeIcon className={navBarIconClass} color={navBarIconColor} />,
      link: "/",
    },
    {
      item: "Profile",
      icon: <UserIcon className={navBarIconClass} color={navBarIconColor} />,
      link: "/my-profile",
    },
    {
      item: "Logout",
      icon: <LogoutIcon className={navBarIconClass} color={navBarIconColor} />,
      onclick: () => {
        handleLogout();
      },
    },
  ];

  return (
    <>
      {isLoading && <Spinner />}
      <motion.nav
        animate={{
          width: isOpened ? (isMobile ? "70dvw" : 300) : isMobile ? 0 : 82,
          x: isOpened || !isMobile ? 0 : "-150px",
        }}
        transition={{ duration: 0.3 }}
        className={`playersidebar-container bg-navbar-color text-off-white h-dvh p-4 z-50 ${
          isMobile ? "fixed top-0 left-0" : ""
        }`}
      >
        {/* Headers */}
        <div className="relative flex items-center h-10 mb-12">
          {/* Title */}
          <motion.span
            animate={{
              scaleX: isOpened ? 1 : 0.85,
            }}
            transition={{ duration: 0.3 }}
            className="origin-left"
          >
            <h1 className="text-h1 font-bold">
              <TypingText text="Player" isVisible={isOpened} />
            </h1>
          </motion.span>

          {/* SidebarIcon stays in place */}
          <div className="absolute right-0">
            <SidebarIcon
              onClick={onToggle}
              color="white"
              className={`transition-transform duration-300 ease-in-out cursor-pointer ${
                isOpened ? "" : "sm:-translate-x-[9px] translate-x-[2px]"
              }`}
            />
          </div>
        </div>

        {/* Sidebar items */}
        <ul className="flex flex-col gap-6">
          {sideBarItems.map((item) => (
            <>
              <AnimatePresence>
                <Link to={item.link} key={item.item}>
                  <motion.li
                    key={item.item}
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={item.onclick}
                    transition={{ duration: 0.25 }}
                    className={`relative group flex items-end justify-start overflow-hidden cursor-pointer hover:text-black ${
                      isOpened ? "px-4 py-2" : ""
                    } transition-text duration-300 ease-in-out`}
                  >
                    {/* Icon wrapper with fixed width */}
                    <div className="-translate-x-[2px] sm:translate-x-0 w-[40px] flex justify-center">
                      {item.icon}
                    </div>
                    {/* Animate text in/out */}
                    <AnimatePresence>
                      {isOpened && (
                        <motion.span
                          key="text"
                          initial={{ opacity: 0, maxWidth: 0 }}
                          animate={{ opacity: 1, maxWidth: 200 }}
                          exit={{ opacity: 0, maxWidth: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden whitespace-nowrap inline-block font-bold"
                        >
                          {item.item}
                        </motion.span>
                      )}
                    </AnimatePresence>{" "}
                    <span className="absolute left-0 top-0 h-full w-0 bg-off-white transition-all duration-300 group-hover:w-full -z-1" />
                  </motion.li>
                </Link>
              </AnimatePresence>
            </>
          ))}
        </ul>
      </motion.nav>
    </>
  );
};

PlayerSidebar.propTypes = {
  isOpened: PropTypes.bool,
  onToggle: PropTypes.func,
};

export default PlayerSidebar;

const TypingText = ({ text, isVisible }) => {
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.span
          key="typing"
          className="inline-flex overflow-hidden"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
            hidden: {
              transition: { staggerChildren: 0.03, staggerDirection: -1 },
            },
          }}
        >
          {text.split("").map((char, index) => (
            <motion.span
              key={index}
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 0.15 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      )}
    </AnimatePresence>
  );
};

TypingText.propTypes = {
  text: PropTypes.string,
  isVisible: PropTypes.bool,
};
