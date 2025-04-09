import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { apiClient } from "@/config/axios/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { formatDateString } from "@/utils/dateUtils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import Input from "@/AtomicComponents/atoms/Input/Input";
// import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";

// const sortKeyMap = {
//   match_id: "SORT_BY_ID",
//   match_name: "SORT_BY_NAME",
//   time_created: "SORT_BY_CREATED",
//   time_start: "SORT_BY_START",
//   time_end: "SORT_BY_END",
// };

const PlayerMatches = () => {
  const { roundId } = useParams();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const [pageIndex, setPageIndex] = useState(1);
  // const [pageSize, setPageSize] = useState(3);
  // const [totalPages, setTotalPages] = useState(1);
  // const [sortByKey, setSortByKey] = useState("match_id"); // default sort key
  // const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [matchesList, setMatchesList] = useState([]);
  const roundNameFromState = location.state?.roundName;

  const breadcrumbItems = [
    { label: `${roundNameFromState}`, href: "/rounds" },
    { label: "Matches", href: `/rounds/${roundId}/matches` },
  ];

  // HANDLE SORT
  // const handleSort = (columnKey) => {
  //   const isSameColumn = sortByKey === columnKey;
  //   let newDirection = "ASC";

  //   // Check if the same column is clicked and change sort direction
  //   if (isSameColumn && sortDirection === "ASC") {
  //     newDirection = "DESC";
  //   }

  //   setSortByKey(columnKey);
  //   setSortDirection(newDirection);
  //   setPageIndex(1);
  // };

  // GET SORT PARAMS
  // const getSortByParam = () => {
  //   if (!sortByKey || !sortDirection) return null;
  //   const baseKey = sortKeyMap[sortByKey];
  //   return baseKey ? `${baseKey}_${sortDirection}` : null;
  // };

  // DISPLAY VALUE FOR PAGINATION
  // const displayedValues = [3, 6, 9, 12];

  //#region PAGINATION
  // const handlePagination = (_pageSize, newPageIndex) => {
  //   setPageIndex(newPageIndex);
  // };

  // const handleChangePageSize = (newSize) => {
  //   setPageSize(newSize);
  //   setPageIndex(1);
  // };
  //#endregion

  // GET MATCHES BY ROUND ID AND PLAYER ID
  useEffect(() => {
    if (!roundId) return;

    const fetchMatches = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(
          `matches/by-round-and-player?roundId=${roundId}&accountId=${auth.id}`
        );

        if (response.data.http_status === 200) {
          if (response.data.data.length === 0) return;

          const data = response.data.data;
          setMatchesList(data.content);
          // setTotalPages(data.total_pages);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    /*sortByKey, sortDirection,*/ debouncedSearchTerm,
    pageIndex /*pageSize*/,
  ]);

  useEffect(() => {
    setPageIndex(1);
  }, [/*sortByKey, sortDirection,*/ debouncedSearchTerm]);

  return (
    <>
      {isLoading && <Spinner />}
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between">
        <div className="flex-1">
          <div className="mb-4 flex justify-between flex-wrap gap-2">
            <Input
              type="text"
              placeholder="Search match by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageIndex(1); // Reset to page 1 on search
              }}
              className="border border-gray-300 rounded px-4 py-2 w-full sm:max-w-xl"
            />
          </div>
        </div>

        {/* <div className="flex items-center justify-end gap-4 mb-4 top-0 right-0">
          <select
            value={sortByKey}
            onChange={(e) => handleSort(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="match_id">Sort by ID</option>
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
            className="border px-2 py-1 rounded"
          >
            <option value="ASC">Asc</option>
            <option value="DESC">Desc</option>
          </select>
        </div> */}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-4">
        {matchesList.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">No matches found.</p>
            </CardContent>
          </Card>
        ) : (
          matchesList.map((match) => (
            <Card
              key={match.match_id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">
                    {match.match_name}
                  </CardTitle>
                  <Badge
                    className={
                      match.status === "FINISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {match.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Code: {match.match_code}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="font-medium">
                      {match.teams[0].team_name || "No Team"}
                    </div>
                    <div className="text-lg font-bold">VS</div>
                    <div className="font-medium">
                      {match?.teams[1]?.team_name || "Team Not Available"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(match.time_start)}
                    </span>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(match.time_end)}
                    </span>

                    {match.status === "FINISHED" && (
                      <>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-muted-foreground">Score:</span>
                        </div>
                        <span className="text-right font-medium">
                          {match.team1_score || 0} - {match.team2_score || 0}
                        </span>
                      </>
                    )}
                  </div>

                  {match.location && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Location: </span>
                      {match.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* <DasrsPagination
        pageSize={pageSize}
        pageIndex={pageIndex}
        handlePagination={handlePagination}
        handleChangePageSize={handleChangePageSize}
        page={pageIndex}
        count={totalPages}
        displayedValues={displayedValues}
      /> */}
    </>
  );
};

export default PlayerMatches;
