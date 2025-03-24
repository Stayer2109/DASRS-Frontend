import { LogoutIcon, SidebarIcon } from "@/assets/icon-svg";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useLogout from "@/hooks/useLogout";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const StaffSidebar = ({ isOpened = false, onToggle = () => {}, data = [] }) => {
  const [expandedItem, setExpandedItem] = useState(null);
  const toggleExpand = (itemKey) => {
    setExpandedItem((prev) => (prev === itemKey ? null : itemKey));
  };

  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const logOut = useLogout();
  const navBarIconClass = `navbar-icon transition-colors duration-300 ease-in-out ${
    isOpened ? "group-hover:stroke-black" : ""
  }`;
  const navBarIconColor = "#FAF9F6";
  const iconWidth = 24;

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await logOut();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <motion.nav
        animate={{
          width: isOpened ? (isMobile ? "70dvw" : 260) : isMobile ? 0 : 82,
          x: isOpened || !isMobile ? 0 : "-150px",
        }}
        transition={{ duration: isOpened ? 0.2 : 0.3, ease: "easeOut" }}
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
            transition={{ duration: isOpened ? 0.2 : 0.3, ease: "easeOut" }}
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
        <ul className="flex flex-col gap-6 flex-grow">
          {(data || []).map((item) => (
            <AnimatePresence key={item.item}>
              <Link to={item.link}>
                <motion.li
                  key={item.item}
                  initial={{ opacity: 0, x: 0 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={item.onclick}
                  transition={{ duration: 0.25 }}
                  className={`relative group flex items-center leading-normal gap-3 justify-start overflow-hidden cursor-pointer hover:text-black ${
                    isOpened ? "px-4 py-2" : ""
                  } transition-text duration-300 ease-in-out`}
                >
                  <div className="-translate-x-[2px] sm:translate-x-0 w-[40px] flex items-center">
                    {item.icon}
                  </div>
                  <AnimatePresence>
                    {isOpened && (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, maxWidth: 0 }}
                        animate={{ opacity: 1, maxWidth: 200 }}
                        exit={{ opacity: 0, maxWidth: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden whitespace-nowrap inline-block font-bold text-medium"
                      >
                        {item.item}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isOpened && (
                    <span className="absolute left-0 top-0 h-full w-0 bg-off-white transition-all duration-300 group-hover:w-full -z-1" />
                  )}
                </motion.li>
              </Link>
            </AnimatePresence>
          ))}

          {/* 👇 Fixed Logout Button */}
          <AnimatePresence>
            <motion.li
              key="logout"
              initial={{ opacity: 0, x: 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={handleLogout}
              transition={{ duration: 0.25 }}
              className={`relative group flex items-center leading-normal gap-3 justify-start overflow-hidden cursor-pointer hover:text-black ${
                isOpened ? "px-4 py-2" : ""
              } transition-text duration-300 ease-in-out`}
            >
              <div className="-translate-x-[2px] sm:translate-x-0 w-[40px] flex items-center">
                <LogoutIcon
                  className={navBarIconClass}
                  color={navBarIconColor}
                  width={iconWidth}
                />
              </div>
              {isOpened && (
                <motion.span
                  key="logout-text"
                  initial={{ opacity: 0, maxWidth: 0 }}
                  animate={{ opacity: 1, maxWidth: 200 }}
                  exit={{ opacity: 0, maxWidth: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden whitespace-nowrap inline-block font-bold text-medium"
                >
                  Logout
                </motion.span>
              )}
              {isOpened && (
                <span className="absolute left-0 top-0 h-full w-0 bg-off-white transition-all duration-300 group-hover:w-full -z-1" />
              )}
            </motion.li>
          </AnimatePresence>
        </ul>
      </motion.nav>
    </>
  );
};

// Inside your component file (below the component)
StaffSidebar.propTypes = {
  isOpened: PropTypes.bool,
  onToggle: PropTypes.func,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      item: PropTypes.string,
      icon: PropTypes.element,
      link: PropTypes.string,
      onclick: PropTypes.func,
    })
  ),
};

export default StaffSidebar;

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
