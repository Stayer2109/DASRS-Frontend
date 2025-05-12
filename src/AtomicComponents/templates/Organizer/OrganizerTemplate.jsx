import { useState, useEffect } from "react";
import { OrganizerSidebar } from "@/AtomicComponents/organisms/Sidebar/OrganizerSidebar";
import { OrganizerContent } from "@/AtomicComponents/organisms/OrganizerContent/OrganizerContent";
import { useLocation, useParams } from "react-router-dom";

const OrganizerTemplate = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [routeParams, setRouteParams] = useState({});
  const location = useLocation();
  const params = useParams();

  // Handle route changes
  useEffect(() => {
    const path = location.pathname;

    // Reset route params by default
    let newRouteParams = {};
    let newActiveTab = "overview";

    // Determine active tab and route params based on path
    if (path === "/tournaments") {
      // Main tournaments list page
      newActiveTab = "tournament";
    } else if (path.includes("/tournaments/") && params.tournamentId) {
      // Tournament subpages (rounds, teams, etc)
      newActiveTab = "tournament";

      const pathParts = path.split("/");

      // Check if we're on a matches view for a specific round
      if (
        pathParts.includes("rounds") &&
        params.roundId &&
        pathParts.includes("matches")
      ) {
        newRouteParams = {
          tournamentId: params.tournamentId,
          section: "rounds",
          roundId: params.roundId,
          view: "matches",
        };
      } else {
        // Regular tournament subpage
        newRouteParams = {
          tournamentId: params.tournamentId,
          section: pathParts.pop(), // 'rounds', 'teams', etc.
        };
      }
    } else if (path.includes("/settings")) {
      newActiveTab = "settings";
    }

    // Update state with new values
    setActiveTab(newActiveTab);
    setRouteParams(newRouteParams);
  }, [location.pathname, params]);

  // Force content to re-render when route changes
  const key = `${activeTab}-${routeParams.tournamentId || ""}-${
    routeParams.section || ""
  }`;

  return (
    <div className="flex bg-gray-50 h-screen">
      <OrganizerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content with key prop to force re-rendering */}
      <div className="flex-1 overflow-auto">
        <OrganizerContent
          key={key}
          activeTab={activeTab}
          routeParams={routeParams}
        />
      </div>
    </div>
  );
};

export default OrganizerTemplate;
