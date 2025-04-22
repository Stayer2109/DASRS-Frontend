import React from "react";
import { Overview } from "../Overview/Overview";
import { UserManagement } from "../UserManagement/UserManagement";
import { Tournament } from "../Tournament/Tournament";
import { MatchTypes } from "../MatchTypes/MatchTypes";
import { Settings } from "../Settings/Settings";
import { Scene } from "../Scene/Scene";
import { Environment } from "../Environment/Environment";
import { Car } from "../Car/Car";

export const AdminContent = ({ activeTab }) => {
  const todayData = {
    todayTournamentCount: 15,
    todayTeamCount: 85,
    todayPlayerCount: 150,
    todayRoundCount: 150,
    todayMatchCount: 320,
  };

  const weeklyData = {
    weeks: [
      {
        week: "week1",
        tournamentCount: 3,
        teamCount: 17,
        playerCount: 30,
        roundCount: 30,
        matchCount: 64,
      },
      {
        week: "week2",
        tournamentCount: 5,
        teamCount: 20,
        playerCount: 40,
        roundCount: 40,
        matchCount: 80,
      },
      {
        week: "week3",
        tournamentCount: 7,
        teamCount: 25,
        playerCount: 50,
        roundCount: 50,
        matchCount: 100,
      },
      {
        week: "week4",
        tournamentCount: 10,
        teamCount: 30,
        playerCount: 60,
        roundCount: 60,
        matchCount: 120,
      },
      {
        week: "week5",
        tournamentCount: 15,
        teamCount: 50,
        playerCount: 100,
        roundCount: 100,
        matchCount: 200,
      },
    ],
    totalTournamentCount: 15,
    totalTeamCount: 85,
    totalPlayerCount: 150,
    totalRoundCount: 150,
    totalMatchCount: 320,
  };

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview todayData={todayData} weeklyData={weeklyData} />;
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
