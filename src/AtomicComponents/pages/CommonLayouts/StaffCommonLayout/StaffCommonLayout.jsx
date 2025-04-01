/** @format */

import { useEffect, useRef, useState } from "react";
import "./StaffCommonLayout.scss";
import { motion, useAnimation } from "framer-motion";
import { useMediaQuery } from "react-responsive";
import {
  AddPlayerIcon,
  HomeIcon,
  ListIcon,
  SidebarIcon,
  UserIcon,
} from "@/assets/icon-svg";
import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import DasrsSidebar from "@/AtomicComponents/organisms/Sidebar/DasrsSidebar";

const StaffCommonLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navBarIconColor = "#FAF9F6";
  const iconWidth = 24;
  const subIconWidth = 20;

  const sidebarData = [
    {
      item: "Home",
      icon: <HomeIcon color={navBarIconColor} width={iconWidth} />,
      link: "/",
    },
    {
      item: "Profile",
      icon: <UserIcon color={navBarIconColor} width={iconWidth} />,
      link: "/my-profile",
    },
    {
      item: "Player Management",
      icon: <UserIcon color={navBarIconColor} width={iconWidth} />,
      subMenu: [
        {
          item: "Add Player",
          icon: <AddPlayerIcon color={navBarIconColor} width={subIconWidth} />,
          link: "/player-management/add-player",
        },
        {
          item: "Player List",
          icon: <ListIcon color={navBarIconColor} width={subIconWidth} />,
          link: "/player-management/player-list",
        },
      ],
    },
    {
      item: "Leaderboard",
      icon: <UserIcon color={navBarIconColor} width={iconWidth} />,
      link: "/leaderboard",
    },
  ];

  useEffect(() => {
    // Collapse sidebar on mobile only on first load
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    // Collapse sidebar on mobile only on first load
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      setIsSidebarOpen(true); // <- this line ensures desktop default is open
    }
  }, [isMobile]);

  useEffect(() => {
    document.body.classList.add("has-player-layout");
    return () => {
      document.body.classList.remove("has-player-layout");
    };
  }, []);

  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMobile, isSidebarOpen]);

  return (
    <div className="flex relative">
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {isMobile && !isSidebarOpen && (
        <DraggableSidebarToggle onClick={() => setIsSidebarOpen(true)} />
      )}

      {typeof isMobile !== "undefined" && (
        <DasrsSidebar
          data={sidebarData}
          isOpened={isSidebarOpen}
          isMobile={isMobile}
          onToggle={() => setIsSidebarOpen((prev) => !prev)}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 z-0 p-10 max-h-screen flex flex-col ${
          isMobile ? "" : ""
        } p-10`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default StaffCommonLayout;

const DraggableSidebarToggle = ({ onClick }) => {
  const controls = useAnimation();
  const iconRef = useRef(null);
  const wrapperRef = useRef(null);
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Update screen size on resize
  useEffect(() => {
    const handleResize = () =>
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDragEnd = async (event, info) => {
    const offsetX = info.point.x;

    const isRight = offsetX > screenSize.width / 2;
    const snapX = isRight ? screenSize.width - 50 : 0;

    await controls.start({
      x: snapX,
      transition: { type: "spring", stiffness: 300, damping: 25 },
    });
  };

  return (
    <div ref={wrapperRef} className="fixed inset-0 z-50 pointer-events-none">
      <motion.div
        ref={iconRef}
        drag
        dragMomentum={false}
        dragElastic={{ top: 0.15, bottom: 0.15, left: 0.3, right: 0.3 }}
        dragConstraints={{
          top: -16,
          bottom: screenSize.height - 65,
        }}
        dragTransition={{
          bounceStiffness: 800, // ⏫ faster snap-back
          bounceDamping: 20, // ⏬ less bouncy
        }}
        onClick={onClick}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="absolute top-4 left-0 bg-navbar-color p-3 rounded-full shadow-md cursor-pointer touch-none pointer-events-auto"
        style={{ width: "fit-content" }}
      >
        <SidebarIcon color="white" height={25} width={25} />
      </motion.div>
    </div>
  );
};

DraggableSidebarToggle.propTypes = {
  onClick: PropTypes.func.isRequired,
};
