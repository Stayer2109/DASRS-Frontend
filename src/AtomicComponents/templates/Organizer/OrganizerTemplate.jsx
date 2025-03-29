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
    console.log("Current path:", path);
    
    // Reset route params by default
    let newRouteParams = {};
    let newActiveTab = "overview";
    
    // Determine active tab and route params based on path
    if (path === "/tournaments") {
      // Main tournaments list page
      newActiveTab = "tournament";
    } else if (path.includes('/tournaments/') && params.tournamentId) {
      // Tournament subpages (rounds, teams, etc)
      newActiveTab = "tournament";
      newRouteParams = {
        tournamentId: params.tournamentId,
        section: path.split('/').pop() // 'rounds', 'teams', etc.
      };
    } else if (path.includes('/settings')) {
      newActiveTab = "settings";
    }
    
    // Update state with new values
    setActiveTab(newActiveTab);
    setRouteParams(newRouteParams);
    
    console.log("Setting activeTab:", newActiveTab);
    console.log("Setting routeParams:", newRouteParams);
  }, [location.pathname, params]);

  // Force content to re-render when route changes
  const key = `${activeTab}-${routeParams.tournamentId || ""}-${routeParams.section || ""}`;

  return (
    <div className="flex h-screen bg-gray-50">
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