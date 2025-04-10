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
      toast.error("Failed to load score details");
    } finally {
      setLoadingScores((prev) => ({
        ...prev,
        [`${matchId}-${teamId}`]: false,
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
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
        <h2 className="text-2xl font-bold">
          {tournament?.tournament_name} -{" "}
          {round?.round_name || `Round ${round?.round_id}`} Matches
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleBackToRounds}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Rounds
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {matches.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">
                No matches found for this round.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card
              key={match.match_id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">
                    Match {match.match_name}
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
                  <div className="space-y-2">
                    {/* Group teams by team_id to avoid duplicates */}
                    {(() => {
                      const uniqueTeams = Array.from(
                        new Map(
                          match.teams.map((team) => [team.team_id, team])
                        ).values()
                      );

                      return uniqueTeams.length <= 2 ? (
                        // If 2 or fewer teams, show the VS layout
                        <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                          <div className="font-medium">
                            {uniqueTeams[0]?.team_name || "No Team"}
                            <span className="text-xs text-gray-500 ml-1">
                              ({uniqueTeams[0]?.team_tag || "N/A"})
                            </span>
                          </div>
                          <div className="text-lg font-bold">VS</div>
                          <div className="font-medium">
                            {uniqueTeams[1]?.team_name || "Team Not Available"}
                            <span className="text-xs text-gray-500 ml-1">
                              ({uniqueTeams[1]?.team_tag || "N/A"})
                            </span>
                          </div>
                        </div>
                      ) : (
                        // If more than 2 teams, show them in a list
                        <div className="space-y-2">
                          {uniqueTeams.map((team, index) => (
                            <div
                              key={team.team_id}
                              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                            >
                              <div className="font-medium">
                                {team.team_name}
                                <span className="text-xs text-gray-500 ml-1">
                                  ({team.team_tag || "N/A"})
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

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatTimeString(match.time_start)}
                    </span>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
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
                              match.teams.map((team) => [team.team_id, team])
                            ).values()
                          );

                          return uniqueTeams.map((team) => (
                            <Collapsible
                              key={`${match.match_id}-${team.team_id}`}
                            >
                              <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800 p-2">
                                <span>{team.team_name} Score Details</span>
                                <ChevronDown className="h-4 w-4" />
                              </CollapsibleTrigger>
                              <CollapsibleContent>
                                {loadingScores[
                                  `${match.match_id}-${team.team_id}`
                                ] ? (
                                  <div className="flex justify-center py-2">
                                    <LoadingIndicator size="small" />
                                  </div>
                                ) : scoreDetails[
                                    `${match.match_id}-${team.team_id}`
                                  ] ? (
                                  <div className="p-2 space-y-4">
                                    {scoreDetails[
                                      `${match.match_id}-${team.team_id}`
                                    ].map((player) => (
                                      <div
                                        key={player.player_id}
                                        className="border rounded-lg p-3 bg-gray-50"
                                      >
                                        <div className="flex justify-between items-center mb-2">
                                          <div className="font-medium">
                                            {player.player_name}
                                          </div>
                                          <Badge variant="secondary">
                                            Score: {player.team_score}
                                          </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                          <div className="text-gray-600">
                                            Lap:
                                          </div>
                                          <div className="text-right">
                                            {player.lap}
                                          </div>

                                          <div className="text-gray-600">
                                            Fastest Lap:
                                          </div>
                                          <div className="text-right">
                                            {player.fastest_lap_time}s
                                          </div>

                                          <div className="text-gray-600">
                                            Collision:
                                          </div>
                                          <div className="text-right">
                                            {player.collision}
                                          </div>

                                          <div className="text-gray-600">
                                            Off Track:
                                          </div>
                                          <div className="text-right">
                                            {player.off_track}
                                          </div>

                                          <div className="text-gray-600">
                                            Assist Usage:
                                          </div>
                                          <div className="text-right">
                                            {player.assist_usage}
                                          </div>

                                          <div className="text-gray-600">
                                            Top Speed:
                                          </div>
                                          <div className="text-right">
                                            {player.top_speed} km/h
                                          </div>

                                          <div className="text-gray-600">
                                            Avg Speed:
                                          </div>
                                          <div className="text-right">
                                            {player.average_speed} km/h
                                          </div>

                                          <div className="text-gray-600">
                                            Distance:
                                          </div>
                                          <div className="text-right">
                                            {player.total_distance} m
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
