import Logo from "../../../assets/icon/dasrs-logo.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/AtomicComponents/atoms/Button/Button";
import "./Header.scss";

export default function Header() {
  const [isTop, setIsTop] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsTop(window.scrollY < 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigate = () => {
    if (auth?.role.toString().toLowerCase() === "player") {
      navigate(`/${auth.role.toString().toLowerCase()}`);
    } else {
      navigate(`/${auth.role.toString().toLowerCase()}/dashboard`);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 sm:py-4 transition-all duration-500 ease-in-out 
        flex justify-between items-center 
        ${
          isTop
            ? "bg-blue-500/40 backdrop-blur-md border-b"
            : "bg-blue-500/90 shadow-md backdrop-blur-xl border-b border-blue-600"
        }`}
      style={{
        backdropFilter: "blur(12px)",
      }}
    >
      {/* Logo + Title */}
      <div className="flex items-center gap-4">
        <img
          src={Logo}
          alt="DASRS Logo"
          className="bg-white shadow-sm rounded-full w-12 sm:w-16 h-12 sm:h-16 object-contain hover:scale-105 transition-transform"
        />
        <h1 className="hidden sm:block font-bold text-white text-lg sm:text-2xl">
          Digital Automotive Simulation Racing System
        </h1>
      </div>

      {/* Dashboard Button */}
      {auth?.accessToken && (
        <div className="flex items-center">
          <Button
            content={`Go to ${auth.role} dashboard`}
            tooltipData="Go to your dashboard"
            onClick={handleNavigate}
            bgColor="#ffffff"
            tooltipId="goto-dashboard"
            className="px-4 py-2 rounded-md font-semibold text-blue-500 text-sm sm:text-base"
          />
        </div>
      )}
    </header>
  );
}
