/** @format */

import { LogoutIcon, SidebarIcon } from "@/assets/icon-svg";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useLogout from "@/hooks/useLogout";
import { ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation } from "react-router-dom";
import { TruncateText } from "@/utils/Trucatetext";
import useAuth from "@/hooks/useAuth";

const DasrsSidebar = ({ isOpened = false, onToggle = () => {}, data = [] }) => {
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { auth } = useAuth();
  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const logOut = useLogout();

  // Style icon when the navbar item is hovered (when opened)
  const openedIconHoveredClass = `navbar-icon transition-colors duration-300 ease-in-out ${
    isOpened ? "group-hover:stroke-black" : ""
  }`;

  // Style icon when the navbar item is selected (when opened)
  const openedIconSelectedClass = "navbar-icon stroke-black";

  // Style sub icon when the submenu item is selected (when collapsed)
  const closedSubIconSelectedClass = "navbar-icon stroke-[2.5]";

  // Style icon when the navbar item is hovered (when collapsed)
  const collapsedIconHoverClass = `hover:bg-white/20 transition-colors duration-180 ease-in-out`;

  // Style item when the navbar item is hovered (when opened)
  const openedItemHoverClass = `before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-0 before:bg-off-white before:transition-all before:duration-180 group-hover:before:w-full before:-z-10`;

  // Style text when the navbar item is selected (when opened)
  const openedItemTextHoverClass = `px-2 py-2 bg-off-white text-black`;

  // Style icon color when the navbar is opeend
  const navBarIconColor = "#FAF9F6";

  const iconWidth = 28;
  const [hasMounted, setHasMounted] = useState(false);

  const handleMenuItemClick = (item) => {
    if (item.onclick) item.onclick();
    if (selectedItem !== item.item) {
      setSelectedItem(item.item);
    }
    if (item.subMenu) {
      setActiveSubmenu(item.item); // Ensure submenu is always open when clicked
    } else {
      setActiveSubmenu(item.item);
    }
  };

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

  useEffect(() => {
    setHasMounted(true); // triggers after first render
  }, []);

  useEffect(() => {
    let activeItem = location.pathname.split("/")[1];
    if (activeItem === "profile") activeItem = "my-profile";

    if (selectedItem !== "/" + activeItem) {
      setSelectedItem("/" + activeItem);
    }

    // Auto-expand submenu if current route matches any submenu item
    const matchedParent = data.find((item) =>
      item.subMenu?.some((sub) => location.pathname.includes(sub.link))
    );

    if (matchedParent && activeSubmenu !== matchedParent.item) {
      setActiveSubmenu(matchedParent.item);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {isLoading && <Spinner />}
      <motion.nav
        initial={hasMounted ? { opacity: 0 } : false}
        animate={{
          width: isOpened ? (isMobile ? "70dvw" : 280) : isMobile ? 0 : 73,
          x: isOpened || !isMobile ? 0 : "-150px",
        }}
        transition={{ duration: isOpened ? 0.2 : 0.3, ease: "easeOut" }}
        className={`playersidebar-container bg-navbar-color text-off-white p-4 z-50 h-full ${
          isMobile ? "fixed top-0 left-0" : ""
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Headers */}
          <div className="relative h-17 mb-12">
            {/* Title */}
            <motion.span
              animate={{
                scaleX: isOpened ? 1 : 0.85,
                opacity: isOpened ? 1 : 0,
              }}
              transition={{ duration: isOpened ? 0.2 : 0.3, ease: "easeOut" }}
              className="origin-left"
            >
              <h1 className="text-h2 font-bold absolute w-[87%]">
                <TypingText
                  text={`${TruncateText("Welcome Back", 18)}`}
                  isVisible={isOpened}
                />
                {auth?.isLeader && <span className="text-yellow-500">Leader</span>}
              </h1>
            </motion.span>

            {/* SidebarIcon */}
            <div className="absolute right-0">
              <SidebarIcon
                onClick={onToggle}
                color="white"
                className={`transition-transform duration-300 ease-in-out cursor-pointer ${
                  isOpened ? "" : "sm:-translate-x-[5px] translate-x-[2px]"
                }`}
              />
            </div>
          </div>

          {/* Sidebar items */}
          <ul className="flex flex-col gap-6 flex-grow overflow-y-auto">
            {(data || []).map((item) => (
              <AnimatePresence key={item.item}>
                <Link to={item.link}>
                  {/* Main menu */}
                  <motion.li
                    key={item.item}
                    initial={hasMounted ? { opacity: 0, x: 0 } : false}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    onClick={() => handleMenuItemClick(item)}
                    transition={{ duration: 0.25 }}
                    className={`relative group leading-normal gap-3 justify-start overflow-hidden cursor-pointer transition-text duration-300 ease-in-out rounded-xl ${
                      item.item === activeSubmenu ? "" : ""
                    } ${
                      isOpened && item.item !== activeSubmenu
                        ? "hover:text-black"
                        : ""
                    }`}
                  >
                    <div
                      className={`relative flex items-center rounded-xl ${
                        selectedItem === item.link
                          ? openedItemTextHoverClass
                          : "px-2 py-2"
                      } ${
                        item.item === activeSubmenu
                          ? openedItemTextHoverClass
                          : "px-2 py-2"
                      } ${
                        isOpened && item.item !== activeSubmenu
                          ? openedItemHoverClass
                          : ""
                      } ${
                        !isOpened && selectedItem !== item.item
                          ? collapsedIconHoverClass
                          : ""
                      }`}
                    >
                      {/* Icon */}
                      <div className="relative -translate-x-[2px] sm:translate-x-0 w-[40px] flex items-center">
                        {item.item === activeSubmenu ||
                        item.link === selectedItem
                          ? React.cloneElement(item.icon, {
                              className: openedIconSelectedClass,
                            })
                          : React.cloneElement(item.icon, {
                              className: openedIconHoveredClass,
                            })}
                      </div>

                      {/* Text */}
                      <AnimatePresence>
                        {isOpened && (
                          <motion.span
                            key="text"
                            initial={
                              !hasMounted ? { opacity: 0, maxWidth: 0 } : false
                            }
                            animate={{ opacity: 1, maxWidth: 200 }}
                            exit={{ opacity: 0, maxWidth: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden whitespace-nowrap font-bold text-medium flex items-center justify-between w-full"
                          >
                            {item.item}
                            {item.subMenu && (
                              <motion.div
                                animate={{
                                  rotate: activeSubmenu === item.item ? 90 : 0,
                                }}
                                transition={{
                                  duration: 0.15,
                                  ease: "easeInOut",
                                }}
                              >
                                <ChevronRight size={18} />
                              </motion.div>
                            )}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submenu */}
                    <div className="cursor-auto">
                      <AnimatePresence>
                        {item.subMenu && activeSubmenu === item.item && (
                          <motion.ul
                            initial={
                              hasMounted
                                ? { opacity: 0, height: 0, y: -5 }
                                : false
                            }
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: -5 }}
                            transition={{
                              duration: 0.25,
                              ease: "easeInOut",
                            }}
                            className={`${
                              isOpened ? "ml-[52px]" : ""
                            } mt-1 flex flex-col gap-1 text-sm text-gray-300 overflow-hidden`}
                          >
                            {item.subMenu?.map((subItem, index) => {
                              const isSubActive =
                                location.pathname === subItem.link;

                              return (
                                <li key={index}>
                                  {isOpened ? (
                                    <Link
                                      to={subItem.link}
                                      className={`block py-1 px-2 rounded transition-colors duration-200 ${
                                        isSubActive
                                          ? "bg-white/20 text-white"
                                          : "hover:bg-white/10"
                                      }`}
                                    >
                                      <motion.div
                                        initial={{ opacity: 0, maxWidth: 0 }}
                                        animate={{
                                          opacity: isOpened ? 1 : 0,
                                          maxWidth: isOpened ? "200px" : 0,
                                        }}
                                        exit={{ opacity: 0, maxWidth: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="inline-flex items-center w-full"
                                      >
                                        <span className="flex items-center">
                                          {subItem.item}
                                        </span>
                                      </motion.div>
                                    </Link>
                                  ) : (
                                    <>
                                      <Link
                                        to={subItem.link}
                                        className={`block py-1 px-2 rounded transition-colors duration-200 ${
                                          isSubActive
                                            ? "bg-white/10 text-white"
                                            : "hover:bg-white/10"
                                        }`}
                                      >
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            maxWidth: 0,
                                            x: 99,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            maxWidth: "40px",
                                            x: 0,
                                          }}
                                          exit={{ opacity: 0, maxWidth: 0 }}
                                          transition={{ duration: 0.3 }}
                                          className="cursor-pointer flex justify-center"
                                        >
                                          {isSubActive
                                            ? React.cloneElement(subItem.icon, {
                                                className: `${closedSubIconSelectedClass}`,
                                              })
                                            : React.cloneElement(subItem.icon, {
                                                className:
                                                  openedIconHoveredClass,
                                              })}
                                        </motion.div>
                                      </Link>
                                    </>
                                  )}
                                </li>
                              );
                            })}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                </Link>
              </AnimatePresence>
            ))}

            {/* Fixed Logout Button */}
            <div className="mt-auto pt-4">
              <AnimatePresence>
                <motion.li
                  key="logout"
                  initial={hasMounted ? { opacity: 0, x: 0 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={handleLogout}
                  transition={{ duration: 0.25 }}
                  className={`relative group leading-normal gap-3 justify-start overflow-hidden cursor-pointer transition-text duration-300 ease-in-out rounded-xl ${
                    isOpened ? "hover:text-black" : ""
                  }`}
                >
                  <div
                    className={`px-2 py-2 relative flex items-center rounded-xl ${
                      isOpened ? openedItemHoverClass : ""
                    }`}
                  >
                    <div className="-translate-x-[2px] sm:translate-x-0 w-[40px] flex items-center">
                      <LogoutIcon
                        className={openedIconHoveredClass}
                        color={navBarIconColor}
                        width={iconWidth}
                      />
                    </div>
                    <AnimatePresence mode="wait">
                      {isOpened && (
                        <motion.span
                          key="logout-text"
                          initial={
                            !hasMounted ? { opacity: 0, maxWidth: 0 } : false
                          }
                          animate={{ opacity: 1, maxWidth: 200 }}
                          exit={{ opacity: 0, maxWidth: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden whitespace-nowrap inline-block font-bold text-medium"
                        >
                          Logout
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.li>
              </AnimatePresence>
            </div>
          </ul>
        </div>
      </motion.nav>
    </>
  );
};

DasrsSidebar.propTypes = {
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

// TypingText component
const TypingText = ({ text, isVisible }) => {
  const words = text.split(/(\s+)/); // includes spaces

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="typing"
          className="inline-block w-full break-words"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={{
                visible: { opacity: 1 },
                hidden: { opacity: 0 },
              }}
              transition={{ duration: 0.15 }}
              className="inline whitespace-pre-wrap"
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

TypingText.propTypes = {
  text: PropTypes.string,
  isVisible: PropTypes.bool,
};

export default DasrsSidebar;
