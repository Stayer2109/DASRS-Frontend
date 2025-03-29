import { TournamentRounds } from "@/AtomicComponents/molecules/TournamentRounds/TournamentRounds";
import { Overview } from "../Overview/Overview";
import { Settings } from "../Settings/Settings";
import { Tournament } from "../Tournament/Tournament";
import { TournamentTeams } from "@/AtomicComponents/molecules/TournamentTeams/TournamentTeams";

export const OrganizerContent = ({ activeTab, routeParams = {} }) => {
  console.log("OrganizerContent rendering with:", { activeTab, routeParams });

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;

      case "tournament":
        // Check if we're on a tournament subpage
        if (routeParams.tournamentId && routeParams.section) {
          switch (routeParams.section) {
            case "rounds":
              return (
                <TournamentRounds tournamentId={routeParams.tournamentId} />
              );
            case "teams":
              return (
                <TournamentTeams tournamentId={routeParams.tournamentId} />
              );
            case "leaderboard":
              return (
                <div>
                  Tournament Leaderboard for ID: {routeParams.tournamentId}
                </div>
              );
            default:
              return <Tournament key="tournament-main" />;
          }
        }
        // Main tournament page
        return <Tournament key="tournament-main" />;

      case "settings":
        return <Settings />;

      default:
        return <Overview />;
    }
  };

  return <main className="p-8">{renderContent()}</main>;
};
