import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/AtomicComponents/atoms/shadcn/tabs";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import { apiClient } from "@/config/axios/axios";
import { useEffect, useState } from "react";

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

  //#endregion

  // #region FETCHING DATA
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

  const fetchCompletedRounds = async () => {};
  //#endregion

  // #region PAGINATION HANDLERS
  const handlePagination = (_pageSize, newPageIndex) => {
    setTournamentPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setTournamentPageSize(newSize);
    setTournamentPageIndex(1);
  };
  //#endregion

  // #region USEEFFECTS
  useEffect(() => {
    fetchCompletedTournaments();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentPageSize, tournamentPageIndex]);

  useEffect(() => {
    console.log("Active Tab:", activeTab);
    
  }, [activeTab]);
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
              <TabsTrigger value="teams">Teams</TabsTrigger>
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
                    className="bg-muted shadow-sm p-2 border rounded"
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

            <TabsContent value="rounds">
              <h2 className="mb-2 font-semibold text-lg">Completed Rounds</h2>
              <div>Round list here...</div>
            </TabsContent>

            <TabsContent value="teams">
              <h2 className="mb-2 font-semibold text-lg">Team List</h2>
              <div>Team list here...</div>
            </TabsContent>
          </Tabs>
        </div>

        <div className=""></div>
      </div>
    </>
  );
};

export default Leaderboard;
