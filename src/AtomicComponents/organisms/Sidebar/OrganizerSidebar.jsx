import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  ChevronRight,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Separator } from "@/AtomicComponents/atoms/shadcn/separator";
import useLogout from "@/hooks/useLogout";

export const OrganizerSidebar = ({ activeTab, setActiveTab }) => {
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
          Organizer Panel
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
          variant={activeTab === "tournament" ? "secondary" : "ghost"}
          className="w-full justify-start"
          onClick={() => setActiveTab("tournament")}
        >
          <Trophy size={20} />
          <span className={`ml-3 ${!isExpanded && "hidden"}`}>Tournament</span>
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
