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

  const renderContent = () => {
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
