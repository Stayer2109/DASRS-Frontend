import { Overview } from "../Overview/Overview";
import { UserManagement } from "../UserManagement/UserManagement";
import { Settings } from "../Settings/Settings";
import { Tournament } from "../Tournament/Tournament";

export const MainContent = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "tournament":
        return <Tournament />;
      case "rounds":
        return <div>Rounds Content</div>;
      case "matches":
        return <div>Matches Content</div>;
      case "settings":
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return <main className="p-8">{renderContent()}</main>;
};
