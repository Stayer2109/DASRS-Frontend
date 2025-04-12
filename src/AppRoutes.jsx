/** @format */

// import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import AdminPage from "./AtomicComponents/pages/Admin/AdminPage/AdminPage";
import HomePage from "./AtomicComponents/pages/Home/Homepage";
import useAuth from "./hooks/useAuth";
import PersistLogin from "./config/provider/PersistLogin";
import RequireAuth from "./config/provider/RequireAuth";
import ForgetPassword from "./AtomicComponents/pages/ForgetPassword/ForgetPassword";
import ScrollToTop from "./others/ScrollToTop";
import CommonLayout from "./AtomicComponents/pages/CommonLayouts/GuestCommonLayout/CommonLayout";
import StaffCommonLayout from "./AtomicComponents/pages/CommonLayouts/StaffCommonLayout/StaffCommonLayout";
import StaffHomePage from "./AtomicComponents/pages/Staff/HomePage/StaffHomePage";
import AddPlayerByImport from "./AtomicComponents/pages/Staff/AddPlayerByImport/AddPlayerByImport";
import "react-tooltip/dist/react-tooltip.css";
import OrganizerPage from "./AtomicComponents/pages/Organizer/OrganizerPage/OrganizerPage";
import { TournamentRounds } from "./AtomicComponents/molecules/TournamentRounds/TournamentRounds";
import { TournamentTeams } from "./AtomicComponents/molecules/TournamentTeams/TournamentTeams";
import { Tournament } from "./AtomicComponents/organisms/Tournament/Tournament";
import PlayerList from "./AtomicComponents/pages/Staff/PlayerList/PlayerList";
import { RoundMatches } from "./AtomicComponents/molecules/RoundMatches/RoundMatches";
import { TournamentList } from "./AtomicComponents/pages/Staff/TournamentList/TournamentList";
import PlayerCommonLayout from "./AtomicComponents/pages/CommonLayouts/PlayerCommonLayout/PlayerCommonLayout";
import PlayerRounds from "./AtomicComponents/pages/Player/PlayerRounds/PlayerRounds";
import PlayerMatches from "./AtomicComponents/pages/Player/PlayerMatches/PlayerMatches";
import AssignPlayer from "./AtomicComponents/pages/Player/AssignPlayer/AssignPlayer";
import PlayerProfile from "./AtomicComponents/pages/Player/PlayerProfile/PlayerProfile";
import OrganizerCommonLayout from "./AtomicComponents/pages/CommonLayouts/OrganizerCommonLayout/OrganizerCommonLayout";
import OrganizerTemplate from "./AtomicComponents/templates/Organizer/OrganizerTemplate";
import { Overview } from "./AtomicComponents/organisms/Overview/Overview";
import { Settings } from "./AtomicComponents/organisms/Settings/Settings";

const AppRoutes = () => {
  const { auth } = useAuth();
  const [toastPosition, setToastPosition] = useState("top-right");

  useEffect(() => {
    const checkScreen = () => {
      setToastPosition(window.innerWidth <= 480 ? "top-center" : "top-right");
    };

    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const renderRoutesByRole = () => {
    const role = auth?.role;

    switch (role) {
      case undefined:
        return (
          <Route path="/" element={<CommonLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        );

      case "ADMIN":
        return (
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["ADMIN"]} />}>
              <Route path="/" element={<AdminPage />}>
                <Route index element={<h1>close</h1>} />
              </Route>
            </Route>
          </Route>
        );

      case "STAFF":
        return (
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["STAFF"]} />}>
              <Route path="/" element={<StaffCommonLayout />}>
                <Route index element={<StaffHomePage />} />
                <Route path="my-profile" element={<h1>My Profile</h1>} />
                <Route path="player-management">
                  <Route path="player-list" element={<PlayerList />} />

                  <Route path="add-player" element={<AddPlayerByImport />} />
                </Route>
                {/* For Tournaments */}
                <Route path="tournaments" element={<TournamentList />} />
                <Route
                  path="tournaments/:tournamentId/rounds"
                  element={<TournamentRounds />}
                />
                <Route
                  path="tournaments/:tournamentId/teams"
                  element={<TournamentTeams />}
                />{" "}
                <Route
                  path="tournaments/:tournamentId/rounds/:roundId/matches"
                  element={<RoundMatches />}
                />
              </Route>
            </Route>
          </Route>
        );

      case "ORGANIZER":
        return (
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["ORGANIZER"]} />}>
              <Route path="/" element={<OrganizerCommonLayout />}>
                {/* <Route index element={<OrganizerTemplate />} /> */}
                <Route index element={<Overview />} />
                {/* <Route path="tournaments" element={<Tournament />} /> */}
                <Route path="tournaments" element={<TournamentList />} />
                <Route path="player-management">
                  <Route path="player-list" element={<PlayerList />} />

                  <Route path="add-player" element={<AddPlayerByImport />} />
                </Route>
                <Route path="my-profile" element={<h1>My Profile</h1>} />
                <Route
                  path="tournaments/:tournamentId/rounds"
                  element={<TournamentRounds />}
                />
                <Route
                  path="tournaments/:tournamentId/rounds/:roundId/matches"
                  element={<RoundMatches />}
                />
                <Route
                  path="tournaments/:tournamentId/teams"
                  element={<TournamentTeams />}
                />
                <Route path="leaderboard">
                  <Route path=":tournamentId" element={<h1>Leaderboard</h1>} />
                </Route>
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Route>
        );

      case "PLAYER":
        return (
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={["PLAYER"]} />}>
              <Route path="/" element={<PlayerCommonLayout />}>
                <Route path="my-profile" element={<PlayerProfile />} />
                <Route path="rounds" element={<PlayerRounds />} />
                <Route
                  path="rounds/:roundId/matches"
                  element={<PlayerMatches />}
                />
                {/* <Route
                  path="assign-player"
                  element={
                    auth?.isLeader ? <AssignPlayer /> : <Navigate to="/" />
                  }
                /> */}
              </Route>
            </Route>
          </Route>
        );

      default:
        return <Route path="/" element={<h1>Not yet</h1>} />;
    }
  };

  return (
    <ScrollToTop>
      <Toaster position={toastPosition} />
      <Routes>
        {renderRoutesByRole()}
        <Route path="reset-password/:token" element={<ForgetPassword />} />
        <Route
          path="*"
          element={<h1 className="text-h1 text-red-500">Adu Ang Seng</h1>}
        />
      </Routes>
    </ScrollToTop>
  );
};

export default AppRoutes;
