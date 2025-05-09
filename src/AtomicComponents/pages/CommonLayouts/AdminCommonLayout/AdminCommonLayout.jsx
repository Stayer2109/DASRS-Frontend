import "./AdminCommonLayout.scss";

import {
  HomeIcon,
  Settings,
  Users,
  BarChart3,
  SlidersHorizontal,
  Layers,
  Car,
  Trophy,
  SidebarIcon
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import DasrsSidebar from "@/AtomicComponents/organisms/Sidebar/DasrsSidebar";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import { useMediaQuery } from "react-responsive";

const AdminCommonLayout = () => {
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("admin-sidebar-opened");
    return saved === null ? true : saved === "true";
  });

  const navBarIconColor = "#FAF9F6";
  const iconWidth = 28;
  const subIconWidth = 20;

  const sidebarData = [
    {
      item: "Overview",
      icon: <HomeIcon color={navBarIconColor} width={iconWidth} />,
      link: "/",
    },
    {
      item: "User Management",
      icon: <Users color={navBarIconColor} width={iconWidth} />,
      link: "/users",
    },
    {
      item: "Tournaments",
      icon: <Trophy color={navBarIconColor} width={iconWidth} />,
      link: "/tournaments",
    },
    {
      item: "Match Types",
      icon: <BarChart3 color={navBarIconColor} width={iconWidth} />,
      link: "/match-types",
    },
    {
      item: "Scenes",
      icon: <Layers color={navBarIconColor} width={iconWidth} />,
      link: "/scenes",
    },
    {
      item: "Environments",
      icon: <SlidersHorizontal color={navBarIconColor} width={iconWidth} />,
      link: "/environments",
    },
    {
      item: "Cars",
      icon: <Car color={navBarIconColor} width={iconWidth} />,
      link: "/cars",
    },
    {
      item: "Settings",
      icon: <Settings color={navBarIconColor} width={iconWidth} />,
      link: "/settings",
    }
  ];

  const handleToggleSidebar = () => {
    const next = !isSidebarOpen;
    setIsSidebarOpen(next);
    localStorage.setItem("admin-sidebar-opened", next.toString());
  };

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false);
    } else {
      const saved = localStorage.getItem("admin-sidebar-opened");
      setIsSidebarOpen(saved === null ? true : saved === "true");
    }
  }, [isMobile]);

  useEffect(() => {
    document.body.classList.add("has-admin-layout");
    return () => {
      document.body.classList.remove("has-admin-layout");
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
    <div className="relative flex h-screen overflow-hidden">
      {isMobile && isSidebarOpen && (
        <div
          className="z-40 fixed inset-0 bg-black/50"
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
          onToggle={handleToggleSidebar}
        />
      )}

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 p-10 max-h-screen flex flex-col overflow-auto ${
          isMobile ? "z-0" : "z-50"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminCommonLayout;

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
    <div ref={wrapperRef} className="z-50 fixed inset-0 pointer-events-none">
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
          bounceStiffness: 800,
          bounceDamping: 20,
        }}
        onClick={onClick}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="top-4 left-0 absolute bg-navbar-color shadow-md p-3 rounded-full touch-none cursor-pointer pointer-events-auto"
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