import { useEffect, useState } from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Map, Users, Flag } from "lucide-react";
import { formatDateString } from "@/utils/dateUtils";
import { RoundStatusBadge } from "@/AtomicComponents/atoms/RoundStatusBadge/RoundStatusBadge";
import { EnvironmentDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/EnvironmentDetails";
import { MapDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/MapDetails";
import { ScoreMethodDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/ScoreMethodDetails";
import useAuth from "@/hooks/useAuth";
import { apiClient } from "@/config/axios/axios";
import { useDebounce } from "@/hooks/useDebounce";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { useNavigate } from "react-router-dom";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";

const sortKeyMap = {
  round_id: "SORT_BY_ID",
  created_date: "SORT_BY_CREATED",
  start_date: "SORT_BY_START",
  end_date: "SORT_BY_END",
};

const PlayerRounds = () => {
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [roundList, setRoundList] = useState([]);
  const [selectedRoundName, setSelectedRoundName] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByKey, setSortByKey] = useState("round_id"); // default sort key
  const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const navigate = useNavigate();
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // GET SORT PARAMS
  const getSortByParam = () => {
    if (!sortByKey || !sortDirection) return null;
    const baseKey = sortKeyMap[sortByKey];
    return baseKey ? `${baseKey}_${sortDirection}` : null;
  };

  // HANDLE SORT
  const handleSort = (columnKey) => {
    const isSameColumn = sortByKey === columnKey;
    let newDirection = "ASC";

    // Check if the same column is clicked and change sort direction
    if (isSameColumn && sortDirection === "ASC") {
      newDirection = "DESC";
    }

    setSortByKey(columnKey);
    setSortDirection(newDirection);
    setPageIndex(1);
  };

  // HANDLE VIEW MATCHES BUTTON
  const handleViewMatches = (roundId, roundName) => {
    navigate(`${roundId}/matches`, {
      state: { roundName }, // pass round name as state
    });
  };

  // DISPLAY VALUE FOR PAGINATION
  const displayedValues = [3, 6, 9, 12];

  const breadcrumbItems = [
    { label: "Rounds", href: "/rounds" },
    ...(selectedRoundName ? [{ label: selectedRoundName }] : []),
  ];

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  useEffect(() => {
    if (!auth.id) return; // wait for auth to be available

    const fetchData = async () => {
      const sortByParam = getSortByParam();
      try {
        setIsLoading(true);
        const response = await apiClient.get(`rounds/player/rounds`, {
          params: {
            accountId: auth.id,
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByParam,
            keyword: debouncedSearchTerm || undefined,
          },
        });

        if (response.data.http_status === 200) {
          const data = response.data.data.rounds;
          setRoundList(data);
          setTotalPages(response.data.data.total_pages || 1);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    auth.id,
    pageIndex,
    pageSize,
    sortByKey,
    sortDirection,
    debouncedSearchTerm,
  ]);

  useEffect(() => {
    setPageIndex(1);
  }, [sortByKey, sortDirection, debouncedSearchTerm]);

  return (
    <>
      {isLoading && <Spinner />}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap justify-between gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search rounds by round name or tournament name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(1); // Reset to page 1 on search
              }}
              className="px-4 py-2 border border-gray-300 rounded w-full sm:max-w-xl"
            />
          </div>
        </div>

        <div className="top-0 right-0 flex justify-end items-center gap-4 mb-4">
          <select
            value={sortByKey}
            onChange={(e) => handleSort(e.target.value)}
            className="px-2 py-1 border rounded"
          >
            <option value="round_id">Sort by ID</option>
            <option value="created_date">Sort by Created Date</option>
            <option value="start_date">Sort by Start Date</option>
            <option value="end_date">Sort by End Date</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e) => {
              setSortDirection(e.target.value);
              setPageIndex(1);
            }}
            className="px-2 py-1 border rounded"
          >
            <option value="ASC">Asc</option>
            <option value="DESC">Desc</option>
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {roundList.length == 0 ? (
          <div className="flex justify-center items-center h-full text-gray-500">
            No rounds available.
          </div>
        ) : (
          <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
            {roundList.map((round) => (
              <Card
                key={round.round_id}
                className="flex flex-col hover:shadow-md h-full overflow-hidden transition-shadow"
              >
                <CardHeader className="flex flex-col justify-between bg-gray-50 p-4 pb-3 border-b h-[120px] shrink-0">
                  <h1 className="">{round.tournament_name}</h1>
                  <div className="flex justify-between items-start w-full">
                    <CardTitle className="group relative font-bold text-lg">
                      <span className="block max-w-[200px] truncate group-hover:text-clip">
                        {round.round_name || `Round ${round.round_no}`}
                      </span>
                      <span className="invisible group-hover:visible -top-8 left-0 z-50 absolute bg-black/75 px-2 py-1 rounded text-white text-sm whitespace-nowrap">
                        {round.round_name || `Round ${round.round_no}`}
                      </span>
                    </CardTitle>
                    {round.is_last && (
                      <Badge className="bg-blue-100 text-blue-800 shrink-0">
                        Final Round
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-2 mt-auto">
                    <RoundStatusBadge status={round.status} />
                    {round.is_last && (
                      <Badge className="bg-red-500 text-white">
                        Final Round
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="p-4 h-max-[400px] overflow-y-auto">
                  <div className="space-y-3">
                    {round.description && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {round.description}
                      </p>
                    )}

                    <div className="gap-2 grid grid-cols-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                        <span className="text-muted-foreground">Start:</span>
                      </div>
                      <span className="text-right">
                        {formatDateString(round.start_date)}
                      </span>

                      <div className="flex items-center">
                        <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                        <span className="text-muted-foreground">End:</span>
                      </div>
                      <span className="text-right">
                        {formatDateString(round.end_date)}
                      </span>

                      <div className="flex items-center">
                        <Map className="mr-2 w-4 h-4 text-gray-500" />
                        <span className="text-muted-foreground">
                          Match Type:
                        </span>
                      </div>
                      <span className="font-medium text-right truncate">
                        {round.match_type_name}
                      </span>

                      <div className="flex items-center">
                        <Flag className="mr-2 w-4 h-4 text-gray-500" />
                        <span className="text-muted-foreground">
                          Finish Type:
                        </span>
                      </div>
                      <span className="font-medium text-right truncate">
                        {round.finish_type}
                      </span>

                      <div className="flex items-center">
                        <Users className="mr-2 w-4 h-4 text-gray-500" />
                        <span className="text-muted-foreground">
                          Qualification Spots:
                        </span>
                      </div>
                      <span className="text-right">{round.team_limit}</span>
                    </div>

                    <div className="space-y-2 pt-2 border-t">
                      <EnvironmentDetails
                        environmentId={round.environment_id}
                      />
                    </div>
                    <div className="space-y-2 pt-2 border-t">
                      <MapDetails resourceId={round.map_id} />
                    </div>
                    <div className="pt-2 border-t">
                      <ScoreMethodDetails
                        scoredMethodId={round.scored_method_id}
                      />
                    </div>
                  </div>
                </CardContent>

                <div className="mt-auto border-t shrink-0">
                  <CardFooter className="p-4">
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      onClick={() => {
                        handleViewMatches(round.round_id, round.round_name),
                          setSelectedRoundName(round.round_name);
                      }}
                    >
                      View Matches
                    </Button>
                  </CardFooter>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      className="w-full cursor-pointer"
                      // onClick={() => handleViewLeaderboard(round.round_id)}
                    >
                      View Leaderboard
                    </Button>
                  </CardFooter>
                </div>
              </Card>
            ))}
          </div>
        )}

        <DasrsPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          handlePagination={handlePagination}
          handleChangePageSize={handleChangePageSize}
          page={pageIndex}
          count={totalPages}
          displayedValues={displayedValues}
        />
      </div>
    </>
  );
};

export default PlayerRounds;
