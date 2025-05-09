import React from "react";
import { Overview } from "../Overview/Overview";
import { UserManagement } from "../UserManagement/UserManagement";
import { Tournament } from "../Tournament/Tournament";
import { MatchTypes } from "../MatchTypes/MatchTypes";
import { Settings } from "../Settings/Settings";
import { Scene } from "../Scene/Scene";
import { Environment } from "../Environment/Environment";
import { Car } from "../Car/Car";
import { TournamentRounds } from "@/AtomicComponents/molecules/TournamentRounds/TournamentRounds";
import { TournamentTeams } from "@/AtomicComponents/molecules/TournamentTeams/TournamentTeams";
import { useParams, useLocation } from "react-router-dom";

export const AdminContent = ({ activeTab }) => {
  const params = useParams();
  const location = useLocation();
  
  const renderContent = () => {
    // Check if we're on a tournament subpage
    if (location.pathname.includes('/tournaments/')) {
      const pathParts = location.pathname.split('/');
      if (pathParts.includes('rounds')) {
        return <TournamentRounds />;
      } else if (pathParts.includes('teams')) {
        return <TournamentTeams />;
      }
    }
    
    // Original switch case for main tabs
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "tournament":
        return <Tournament />;
      case "match-types":
        return <MatchTypes />;
      case "settings":
        return <Settings />;
      case "scenes":
        return <Scene />;
      case "environments":
        return <Environment />;
      case "cars":
        return <Car />;
      default:
        return <Overview />;
    }
  };

  return <main className="p-8">{renderContent()}</main>;
};
