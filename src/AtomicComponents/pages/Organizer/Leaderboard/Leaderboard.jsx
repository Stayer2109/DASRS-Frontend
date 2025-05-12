import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/AtomicComponents/atoms/shadcn/tabs";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import TournamentLeaderboardCard from "@/AtomicComponents/molecules/LeaderboardCard/TournamentLeaderboardCard/TournamentLeaderboardCard";
import { apiClient } from "@/config/axios/axios";
import { useEffect, useState } from "react";
import RoundLeaderboardCard from "@/AtomicComponents/molecules/LeaderboardCard/RoundLeaderboardCard/RoundLeaderboardCard";
import PropTypes from "prop-types";

const Leaderboard = ({ forLandingPage = false }) => {
  const [completedTournaments, setCompletedTournaments] = useState([]);
  const [completedRounds, setCompletedRounds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tournaments");
  const [tournamentPageSize, setTournamentPageSize] = useState(6);
  const [tournamentPageIndex, setTournamentPageIndex] = useState(1);
  const [tournamentTotalPages, setTournamentTotalPages] = useState(1);
  const [roundPageSize, setRoundPageSize] = useState(6);
  const [roundPageIndex, setRoundPageIndex] = useState(1);
  const [roundTotalPages, setRoundTotalPages] = useState(1);
  const [selectedTournamentLeaderboard, setSelectedTournamentLeaderboard] =
    useState(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedRoundLeaderboard, setSelectedRoundLeaderboard] =
    useState(null);
  const [selectedRoundId, setSelectedRoundId] = useState(null);

  const handleLeaderboardItemClick = (itemId) => {
    if (activeTab === "tournaments") {
      fetchTournamentLeaderboard(itemId);
      setSelectedTournamentId(itemId);
    } else if (activeTab === "rounds") {
      fetchRoundLeaderboard(itemId);
      setSelectedRoundId(itemId);
    }
  };

  const fetchCompletedTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("tournaments", {
        params: {
          pageNo: tournamentPageIndex - 1,
          pageSize: tournamentPageSize,
          status: "COMPLETED",
          sortBy: "SORT_BY_ID_ASC",
        },
      });
      if (response.data.http_status === 200) {
        const data = response.data.data;
        setCompletedTournaments(data.content || []);
        setTournamentTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCompletedRounds = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`rounds`, {
        params: {
          pageNo: roundPageIndex - 1,
          pageSize: roundPageSize,
          sortBy: "SORT_BY_ID_ASC",
          status: "COMPLETED",
        },
      });
      if (response.data.http_status === 200) {
        const data = response.data.data;
        setCompletedRounds(data.content || []);
        setRoundTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTournamentLeaderboard = async (tournamentId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `leaderboards/tournament/${tournamentId}`,
        {
          params: {
            pageNo: 0,
            pageSize: 100,
            sortBy: "id",
            sortDirection: "asc",
          },
        }
      );
      if (response.data.http_status === 200) {
        setSelectedTournamentLeaderboard(response.data.data);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRoundLeaderboard = async (roundId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`leaderboards/round/v3/${roundId}`, {
        params: {
          pageNo: 0,
          pageSize: 100,
          sortBy: "id",
          sortDirection: "asc",
        },
      });
      if (response.data.http_status === 200) {
        setSelectedRoundLeaderboard(response.data.data);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePagination = (_pageSize, newPageIndex) => {
    if (activeTab === "tournaments") {
      setTournamentPageIndex(newPageIndex);
    } else if (activeTab === "rounds") {
      setRoundPageIndex(newPageIndex);
    }
  };

  const handleChangePageSize = (newSize) => {
    if (activeTab === "tournaments") {
      setTournamentPageSize(newSize);
      setTournamentPageIndex(1);
    } else if (activeTab === "rounds") {
      setRoundPageSize(newSize);
      setRoundPageIndex(1);
    }
  };

  useEffect(() => {
    fetchCompletedTournaments();
  }, [tournamentPageSize, tournamentPageIndex]);

  useEffect(() => {
    fetchCompletedRounds();
  }, [roundPageSize, roundPageIndex]);

  return (
    <>
      {isLoading && <Spinner />}

      <div className={`my-10 px-4 sm:px-10 transition-all duration-300`}>
        <div
          className={`gap-x-4 grid p-6 sm:p-10 rounded-2xl transition-all duration-300 shadow-xl
            ${
              forLandingPage
                ? "bg-gradient-to-br from-blue-50 to-blue-100 backdrop-blur-md grid-cols-1 sm:grid-cols-2"
                : "bg-white border border-gray-200 grid-cols-[40%_60%]"
            }`}
        >
          <div>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
                <TabsTrigger value="rounds">Rounds</TabsTrigger>
              </TabsList>

              <TabsContent value="tournaments">
                <h2 className="mb-2 font-semibold text-lg">
                  Completed Tournaments
                </h2>
                <ul className="space-y-2">
                  {completedTournaments.map((tournament) => (
                    <li
                      key={tournament.id}
                      className={`$${
                        selectedTournamentId === tournament.tournament_id
                          ? "bg-gray-300"
                          : "bg-muted hover:bg-gray-200"
                      } shadow-sm p-2 border rounded cursor-pointer`}
                      onClick={() =>
                        handleLeaderboardItemClick(tournament?.tournament_id)
                      }
                    >
                      {tournament.tournament_name}
                    </li>
                  ))}
                </ul>
                <DasrsPagination
                  pageSize={tournamentPageSize}
                  pageIndex={tournamentPageIndex}
                  count={tournamentTotalPages}
                  handlePagination={handlePagination}
                  handleChangePageSize={handleChangePageSize}
                  displayedValues={[6, 8, 10, 12]}
                />
              </TabsContent>

              <TabsContent value="rounds">
                <h2 className="mb-2 font-semibold text-lg">Completed Rounds</h2>
                <ul className="space-y-2">
                  {completedRounds.map((round) => (
                    <li
                      key={round.id}
                      className={`$${
                        selectedRoundId === round?.round_id
                          ? "bg-gray-300"
                          : "bg-muted hover:bg-gray-200"
                      } shadow-sm p-2 border rounded cursor-pointer`}
                      onClick={() =>
                        handleLeaderboardItemClick(round?.round_id)
                      }
                    >
                      {round.round_name}
                    </li>
                  ))}
                </ul>
                <DasrsPagination
                  pageSize={roundPageSize}
                  pageIndex={roundPageIndex}
                  count={roundTotalPages}
                  handlePagination={handlePagination}
                  handleChangePageSize={handleChangePageSize}
                  displayedValues={[6, 8, 10, 12]}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div>
            {activeTab === "tournaments" ? (
              selectedTournamentLeaderboard ? (
                <TournamentLeaderboardCard
                  type="tournament"
                  tournamentData={selectedTournamentLeaderboard}
                />
              ) : completedTournaments.length > 0 ? (
                <p className="font-semibold text-muted-foreground italic">
                  Please choose an item to view.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No leaderboard data available.
                </p>
              )
            ) : activeTab === "rounds" ? (
              selectedRoundLeaderboard ? (
                <RoundLeaderboardCard
                  type="round"
                  roundData={selectedRoundLeaderboard}
                />
              ) : completedRounds.length > 0 ? (
                <p className="font-semibold text-muted-foreground italic">
                  Please choose an item to view.
                </p>
              ) : (
                <p className="text-muted-foreground">
                  No leaderboard data available.
                </p>
              )
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;

Leaderboard.propTypes = {
  forLandingPage: PropTypes.bool,
};
