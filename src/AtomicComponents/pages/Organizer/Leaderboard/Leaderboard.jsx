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

const Leaderboard = () => {
  // #region VARIABLES DECLARATION
  const [completedTournaments, setCompletedTournaments] = useState([]);
  const [completedRounds, setCompletedRounds] = useState([]);
  const [team, setTeam] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("tournaments");

  // Tournament Pagination
  const [tournamentPageSize, setTournamentPageSize] = useState(6);
  const [tournamentPageIndex, setTournamentPageIndex] = useState(1);
  const [tournamentTotalPages, setTournamentTotalPages] = useState(1);

  // Round Pagination
  const [roundPageSize, setRoundPageSize] = useState(6);
  const [roundPageIndex, setRoundPageIndex] = useState(1);
  const [roundTotalPages, setRoundTotalPages] = useState(1);

  // Selected Items
  const [selectedTournamentLeaderboard, setSelectedTournamentLeaderboard] =
    useState(null);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);

  const [selectedRoundLeaderboard, setSelectedRoundLeaderboard] =
    useState(null);
  const [selectedRoundId, setSelectedRoundId] = useState(null);
  //#endregion

  // HANDLE ONCLICK LEADERBOARD ITEM
  const handleLeaderboardItemClick = (itemId) => {
    if (activeTab === "tournaments") {
      fetchTournamentLeaderboard(itemId);
      setSelectedTournamentId(itemId); // Set the active tournament
    } else if (activeTab === "rounds") {
      fetchRoundLeaderboard(itemId);
      setSelectedRoundId(itemId); // Set the active round
    }
  };

  // #region FETCHING DATA
  // FETCHING COMPLETED TOURNAMENTS
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
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FETCHING COMPLETED ROUNDS
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
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FETCHING TOURNAMENT LEADERBOARD
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
        const data = response.data.data;
        setSelectedTournamentLeaderboard(data);
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // FETCHING ROUND LEADERBOARD
  const fetchRoundLeaderboard = async (roundId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`rounds/${roundId}`);

      if (response.data.http_status === 200) {
        const data = response.data.data;
        setSelectedRoundLeaderboard(data);
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  // #region PAGINATION HANDLERS
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
  //#endregion

  // #region USEEFFECTS
  useEffect(() => {
    fetchCompletedTournaments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentPageSize, tournamentPageIndex]);

  useEffect(() => {
    fetchCompletedRounds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundPageSize, roundPageIndex]);
  //#endregion

  return (
    <>
      {isLoading && <Spinner />}

      <div className="gap-x-4 grid grid-cols-[40%_60%] p-4">
        {/* Leaderboard Tab */}
        <div className="">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList>
              <TabsTrigger value="tournaments">Tournaments</TabsTrigger>
              <TabsTrigger value="rounds">Rounds</TabsTrigger>
            </TabsList>

            {/* Tournaments Tab Content */}
            <TabsContent value="tournaments">
              <h2 className="mb-2 font-semibold text-lg">
                Completed Tournaments
              </h2>
              <ul className="space-y-2">
                {completedTournaments.map((tournament) => (
                  <li
                    key={tournament.id}
                    className={`${
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

              {/* Pagination */}
              <DasrsPagination
                pageSize={tournamentPageSize}
                pageIndex={tournamentPageIndex}
                count={tournamentTotalPages}
                handlePagination={handlePagination}
                handleChangePageSize={handleChangePageSize}
                displayedValues={[6, 8, 10, 12]}
              />
            </TabsContent>

            {/* Rounds Tab Content */}
            <TabsContent value="rounds">
              <h2 className="mb-2 font-semibold text-lg">Completed Rounds</h2>
              <ul className="space-y-2">
                {completedRounds.map((round) => (
                  <li
                    key={round.id}
                    className={`${
                      selectedRoundId === round?.round_id
                        ? "bg-gray-300"
                        : "bg-muted hover:bg-gray-200"
                    } shadow-sm p-2 border rounded cursor-pointer`}
                    onClick={() => handleLeaderboardItemClick(round?.round_id)}
                  >
                    {round.round_name}
                  </li>
                ))}
              </ul>

              {/* Pagination */}
              <DasrsPagination
                pageSize={roundPageSize}
                pageIndex={roundPageIndex}
                count={roundTotalPages}
                handlePagination={handlePagination}
                handleChangePageSize={handleChangePageSize}
                displayedValues={[6, 8, 10, 12]}
              />
            </TabsContent>

            <TabsContent value="Teams">
              <h2 className="mb-2 font-semibold text-lg">Completed Rounds</h2>
              <div>Round list here...</div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Leaderboard Card */}
        <div className="">
          {activeTab === "tournaments" ? (
            <>
              {selectedTournamentLeaderboard ? (
                <TournamentLeaderboardCard
                  type="tournament"
                  tournamentData={selectedTournamentLeaderboard}
                />
              ) : (
                <p className="text-muted-foreground">
                  No leaderboard data available.
                </p>
              )}
            </>
          ) : activeTab === "rounds" ? (
            <>
              {selectedRoundLeaderboard ? (
                <RoundLeaderboardCard
                  type="round"
                  roundData={selectedRoundLeaderboard}
                />
              ) : (
                <p className="text-muted-foreground">
                  No leaderboard data available.
                </p>
              )}
            </>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default Leaderboard;
