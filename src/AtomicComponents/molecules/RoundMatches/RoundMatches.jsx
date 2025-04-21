import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { apiAuth } from "@/config/axios/axios";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";

export const RoundMatches = () => {
  const { tournamentId, roundId } = useParams();
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreDetails, setScoreDetails] = useState({});
  const [loadingScores, setLoadingScores] = useState({});

  // Add pagination states
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  // Display values for pagination
  const displayedValues = [6, 12, 18, 24];

  // Fetch tournament, round, and matches data
  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId || !roundId) {
        console.error("No tournament ID or round ID provided");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        // Fetch tournament information
        const tournamentResponse = await apiAuth.get(
          `tournaments/${tournamentId}`
        );
        setTournament(tournamentResponse.data.data);

        // Fetch round information
        const roundResponse = await apiAuth.get(`rounds/${roundId}`);
        setRound(roundResponse.data.data);

        // Update matches fetch to include pagination
        const matchesResponse = await apiAuth.get(`matches/round/${roundId}`, {
          params: {
            pageNo: pageIndex - 1, // Adjust for 0-based indexing if your API uses it
            pageSize: pageSize,
            sortBy: "SORT_BY_ID_ASC",
          },
        });

        setMatches(matchesResponse.data.data.content || []);
        setTotalPages(matchesResponse.data.data.total_pages || 1);
      } catch (err) {
        console.error("Error fetching round matches:", err);
        setError("Failed to load matches. Please try again.");
        toast.error("Failed to load matches. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, roundId, pageIndex, pageSize]); // Add pagination dependencies

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Tournaments", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/tournaments`,
    },
    {
      label: "Rounds",
      href: `/tournaments/${tournamentId}/rounds`,
    },
    {
      label: round?.round_name || `Round ${round?.round_no}` || "Round Matches",
    },
  ];

  const handleBackToRounds = () => {
    navigate(`/tournaments/${tournamentId}/rounds`);
  };

  // Format date strings
  const formatDateString = (dateString) => {
    if (!dateString) return "";
    try {
      // Parse the MM/DD/YYYY format
      const [date, time] = dateString.split(" ");
      const [month, day, year] = date.split("/");
      return `${day}/${month}/${year}`;
    } catch (err) {
      console.error("Date parsing error:", err);
      return dateString;
    }
  };

  // Format time strings
  const formatTimeString = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  const fetchScoreDetails = async (matchId, teamId) => {
    setLoadingScores((prev) => ({ ...prev, [`${matchId}-${teamId}`]: true }));
    try {
      const response = await apiAuth.get(
        `matches/score-details/${matchId}/${teamId}`
      );
      setScoreDetails((prev) => ({
        ...prev,
        [`${matchId}-${teamId}`]: response.data.data,
      }));
    } catch (error) {
      console.error("Error fetching score details:", error);
      toast.error(error.response.data.message);
    } finally {
      setLoadingScores((prev) => ({
        ...prev,
        [`${matchId}-${teamId}`]: false,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator />
      </div>
    );
  }

  // Pagination handlers
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">
          {tournament?.tournament_name} -{" "}
          {round?.round_name || `Round ${round?.round_id}`} Matches
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleBackToRounds}
            className="cursor-pointer"
          >
            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Rounds
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="gap-6 grid md:grid-cols-2">
        {matches.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col justify-center items-center p-6">
              <p className="mb-4 text-muted-foreground">
                No matches found for this round.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card
              key={match?.match_id}
              className="hover:shadow-md overflow-hidden transition-shadow"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-bold text-lg">
                    Match {match?.match_name}
                  </CardTitle>
                  <Badge
                    className={
                      match?.status === "FINISHED"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {match?.status}
                  </Badge>
                </div>
                <div className="text-gray-500 text-sm">
                  Code: {match?.match_code}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    {(() => {
                      const teamList = Array.isArray(match?.teams)
                        ? match?.teams
                        : [];
                      if (teamList.length === 0) {
                        return (
                          <div className="text-gray-500 text-sm text-center italic">
                            No teams available.
                          </div>
                        );
                      }

                      const uniqueTeams = Array.from(
                        new Map(
                          teamList.map((team) => [team?.team_id, team])
                        ).values()
                      );

                      return uniqueTeams.length <= 2 ? (
                        <div className="flex justify-between items-center bg-gray-50 p-2 rounded-md">
                          <div className="font-medium">
                            {uniqueTeams[0]?.team_name || "No Team"}
                            <span className="ml-1 text-gray-500 text-xs">
                              ({uniqueTeams[0]?.team_tag || "N/A"})
                            </span>
                          </div>
                          <div className="font-bold text-lg">VS</div>
                          <div className="font-medium">
                            {uniqueTeams[1]?.team_name || "Team Not Available"}
                            <span className="ml-1 text-gray-500 text-xs">
                              ({uniqueTeams[1]?.team_tag || "N/A"})
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {uniqueTeams.map((team, index) => (
                            <div
                              key={team?.team_id}
                              className="flex justify-between items-center bg-gray-50 p-2 rounded-md"
                            >
                              <div className="font-medium">
                                {team?.team_name}
                                <span className="ml-1 text-gray-500 text-xs">
                                  ({team?.team_tag || "N/A"})
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Team {index + 1}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  <div className="gap-2 grid grid-cols-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatTimeString(match.time_start)}
                    </span>

                    <div className="flex items-center">
                      <Clock className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatTimeString(match.time_end)}
                    </span>

                    {match.status === "FINISHED" && (
                      <div className="col-span-2">
                        {/* Score Details Collapsible for unique teams */}
                        {(() => {
                          const uniqueTeams = Array.from(
                            new Map(
                              match?.teams?.map((team) => [team.team_id, team])
                            ).values()
                          );

                          return uniqueTeams.map((team) => (
                            <Collapsible
                              key={`${match?.match_id}-${team?.team_id}`}
                            >
                              <CollapsibleTrigger className="flex justify-between items-center p-2 w-full text-gray-600 hover:text-gray-800 text-sm">
                                <span>{team?.team_name} Score Details</span>
                                <ChevronDown className="w-4 h-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                {loadingScores[
                                  `${match?.match_id}-${team?.team_id}`
                                ] ? (
                                  <div className="flex justify-center py-2">
                                    <LoadingIndicator size="small" />
                                  </div>
                                ) : scoreDetails[
                                    `${match.match_id}-${team?.team_id}`
                                  ] ? (
                                  <div className="space-y-4 p-2">
                                    {scoreDetails[
                                      `${match?.match_id}-${team?.team_id}`
                                    ].map((player) => (
                                      <div
                                        key={player?.player_id}
                                        className="bg-gray-50 p-3 border rounded-lg"
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <div className="font-medium">
                                            {player?.player_name}
                                          </div>
                                          <Badge variant="secondary">
                                            Score: {player?.team_score}
                                          </Badge>
                                        </div>

                                        <div className="gap-x-4 gap-y-1 grid grid-cols-2 text-sm">
                                          <div className="text-gray-600">
                                            Lap:
                                          </div>
                                          <div className="text-right">
                                            {player?.lap}
                                          </div>

                                          <div className="text-gray-600">
                                            Fastest Lap:
                                          </div>
                                          <div className="text-right">
                                            {player?.fastest_lap_time}s
                                          </div>

                                          <div className="text-gray-600">
                                            Collision:
                                          </div>
                                          <div className="text-right">
                                            {player?.collision}
                                          </div>

                                          <div className="text-gray-600">
                                            Off Track:
                                          </div>
                                          <div className="text-right">
                                            {player?.off_track}
                                          </div>

                                          <div className="text-gray-600">
                                            Assist Usage:
                                          </div>
                                          <div className="text-right">
                                            {player?.assist_usage}
                                          </div>

                                          <div className="text-gray-600">
                                            Top Speed:
                                          </div>
                                          <div className="text-right">
                                            {player?.top_speed} km/h
                                          </div>

                                          <div className="text-gray-600">
                                            Avg Speed:
                                          </div>
                                          <div className="text-right">
                                            {player?.average_speed} km/h
                                          </div>

                                          <div className="text-gray-600">
                                            Distance:
                                          </div>
                                          <div className="text-right">
                                            {player?.total_distance} m
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full"
                                    onClick={() =>
                                      fetchScoreDetails(
                                        match.match_id,
                                        team.team_id
                                      )
                                    }
                                  >
                                    Load Score Details
                                  </Button>
                                )}
                              </CollapsibleContent>
                            </Collapsible>
                          ));
                        })()}
                      </div>
                    )}
                  </div>

                  {match.location && (
                    <div className="mt-2 text-sm">
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

      {/* Add pagination component */}
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
  );
};
