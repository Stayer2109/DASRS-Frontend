import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  ChevronRight,
  Trophy,
  CircuitBoard,
  Factory,
  Swords,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Separator } from "@/AtomicComponents/atoms/shadcn/separator";
import useLogout from "@/hooks/useLogout";
import { Car } from "lucide-react";
import PropTypes from "prop-types";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const logOut = useLogout();

  // HANDLE LOGOUT
  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={`bg-gray-900 p-4 flex flex-col h-full text-white transition-all duration-300 ${
        isExpanded ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <h1
          className={`font-bold transition-opacity ${
            isExpanded ? "text-2xl" : "text-lg opacity-0 w-0"
          }`}
        >
          Admin Panel
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          className="hover:bg-gray-800"
        >
          {isExpanded ? <Menu size={20} /> : <ChevronRight size={20} />}
        </Button>
      </div>

      <nav className="space-y-2">
        <Button
          variant={activeTab === "overview" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("overview")}
        >
          <LayoutDashboard size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Dashboard</span>
        </Button>

        <Button
          variant={activeTab === "users" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("users")}
        >
          <Users size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Users</span>
        </Button>

        <Button
          variant={activeTab === "scenes" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("scenes")}
        >
          <CircuitBoard size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Scene</span>
        </Button>

        <Button
          variant={activeTab === "match-types" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("match-types")}
        >
          <Swords size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Match Types</span>
        </Button>

        <Button
          variant={activeTab === "tournament" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("tournament")}
        >
          <Trophy size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Tournament</span>
        </Button>

        <Button
          variant={activeTab === "environments" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("environments")}
        >
          <Factory size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>
            Environments
          </span>
        </Button>

        <Button
          variant={activeTab === "cars" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("cars")}
        >
          <Car size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Cars</span>
        </Button>

        <Button
          variant={activeTab === "settings" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("settings")}
        >
          <SettingsIcon size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Settings</span>
        </Button>
      </nav>

      <div className="mt-auto space-y-4">
        <Separator className="my-4 bg-gray-800" />
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Logout</span>
        </Button>
        <p
          className={`text-gray-500 text-sm text-center transition-opacity ${
            !isExpanded && "opacity-0"
          }`}
        >
          © {new Date().getFullYear()} DASRS
        </p>
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};
