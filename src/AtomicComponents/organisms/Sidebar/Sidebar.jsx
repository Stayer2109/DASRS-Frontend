import {
  LayoutDashboard,
  Users,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  ChevronRight,
  Trophy,
  ChevronDown,
  CircleDot,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Separator } from "@/AtomicComponents/atoms/shadcn/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTournamentOpen, setIsTournamentOpen] = useState(false);

  const tournamentItems = [
    { id: "tournament", label: "Overview" },
    { id: "rounds", label: "Rounds" },
    { id: "matches", label: "Matches" },
  ];

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

        <Collapsible
          open={isTournamentOpen && isExpanded}
          onOpenChange={setIsTournamentOpen}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant={
                tournamentItems.some((item) => item.id === activeTab)
                  ? "secondary"
                  : "ghost"
              }
              className="w-full justify-between"
            >
              <div className="flex items-center">
                <Trophy size={20} />
                <span className={`ml-3 ${!isExpanded && "hidden"}`}>
                  Tournament
                </span>
              </div>
              {isExpanded && (
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${
                    isTournamentOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 mt-2 ml-2">
            {tournamentItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className="w-full justify-start pl-6"
                onClick={() => setActiveTab(item.id)}
              >
                <CircleDot size={16} />
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
          </CollapsibleContent>
        </Collapsible>

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
        <Button variant="ghost" className="w-full justify-start">
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
