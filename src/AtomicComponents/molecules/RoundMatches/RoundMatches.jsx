import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Clock, ArrowLeft, ChevronDown, Info } from "lucide-react";
import apiClient from "@/config/axios/axios";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import useAuth from "@/hooks/useAuth";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

export const RoundMatches = () => {
  const { auth } = useAuth();
  const { tournamentId, roundId } = useParams();
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scoreDetails, setScoreDetails] = useState({});
  const [loadingScores, setLoadingScores] = useState({});
  const role = auth?.role.toString().toLowerCase();

  // Add pagination states
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Add state for rematch modal
  const [rematchModalShow, setRematchModalShow] = useState(false);
  const [rematchInfo, setRematchInfo] = useState(null);
  const [loadingRematchInfo, setLoadingRematchInfo] = useState(false);

  // Add this state for expanded team details
  const [expandedTeamDetails, setExpandedTeamDetails] = useState(null);

  // Add state for match filter
  const [matchFilter, setMatchFilter] = useState("ALL");

  const navigate = useNavigate();

  // Display values for pagination
  const displayedValues = [6, 12, 18, 24];

  // Add the filteredMatches computed value here, at the top with other hooks
  const filteredMatches = useMemo(() => {
    if (matchFilter === "ALL") return matches;
    return matches.filter(match => match.match_form === matchFilter);
  }, [matches, matchFilter]);

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
        const tournamentResponse = await apiClient.get(
          `tournaments/${tournamentId}`
        );
        setTournament(tournamentResponse.data.data);

        // Fetch round information
        const roundResponse = await apiClient.get(`rounds/${roundId}`);
        setRound(roundResponse.data.data);

        // Update matches fetch to include pagination
        const matchesResponse = await apiClient.get(
          `matches/round/${roundId}`,
          {
            params: {
              pageNo: pageIndex - 1, // Adjust for 0-based indexing if your API uses it
              pageSize: pageSize,
              sortBy: "SORT_BY_ID_ASC",
            },
          }
        );

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
    { label: "Tournaments", href: `/${role}/tournaments` },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/${role}/tournaments`,
    },
    {
      label: "Rounds",
      href: `/${role}/tournaments/${tournamentId}/rounds`,
    },
    {
      label: round?.round_name || `Round ${round?.round_no}` || "Round Matches",
    },
  ];

  const handleBackToRounds = () => {
    navigate(`/tournaments/${tournamentId}/rounds`);
  };

  // Format date strings
  // const formatDateString = (dateString) => {
  //   if (!dateString) return "";
  //   try {
  //     // Parse the MM/DD/YYYY format
  //     const [date, time] = dateString.split(" ");
  //     const [month, day, year] = date.split("/");
  //     return `${day}/${month}/${year}`;
  //   } catch (err) {
  //     console.error("Date parsing error:", err);
  //     return dateString;
  //   }
  // };

  // Format time strings
  const formatTimeString = (timeString) => {
    if (!timeString) return "";
    return timeString;
  };

  // Add this helper function to format float numbers
  const formatFloat = (value) => {
    if (value === undefined || value === null) return "N/A";
    return typeof value === 'number' ? value.toFixed(3) : value;
  };

  const fetchScoreDetails = async (matchId, teamId) => {
    setLoadingScores((prev) => ({ ...prev, [`${matchId}-${teamId}`]: true }));
    try {
      const response = await apiClient.get(
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

  // Function to fetch rematch information
  const fetchRematchInfo = async (matchId) => {
    setLoadingRematchInfo(true);
    try {
      const response = await apiClient.get(`/matches/rematch/${matchId}`);
      if (response.data.http_status === 200) {
        setRematchInfo(response.data.data);
        console.log(response.data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rematch information",
        variant: "destructive",
      });
    } finally {
      setLoadingRematchInfo(false);
    }
  };

  // Handle opening rematch modal
  const handleOpenRematchModal = (match) => {
    fetchRematchInfo(match.match_id);
    setRematchModalShow(true);
  };

  // Handle closing rematch modal
  const handleCloseRematchModal = () => {
    setRematchModalShow(false);
    setTimeout(() => {
      setRematchInfo(null);
    }, 300);
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

      <div className="flex flex-col space-y-4">
        {/* Match type filter tabs */}
        <div className="flex space-x-2 mb-2">
          <Button 
            variant={matchFilter === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setMatchFilter("ALL")}
            className="text-sm"
          >
            All Matches
          </Button>
          <Button 
            variant={matchFilter === "OFFICIAL" ? "default" : "outline"}
            size="sm"
            onClick={() => setMatchFilter("OFFICIAL")}
            className="text-sm"
          >
            Official Matches
          </Button>
          <Button 
            variant={matchFilter === "REMATCH" ? "default" : "outline"}
            size="sm"
            onClick={() => setMatchFilter("REMATCH")}
            className="text-sm"
          >
            Rematch Matches
          </Button>
        </div>

        {/* Match count summary */}
        <div className="text-sm text-gray-500 mb-2">
          Showing {filteredMatches.length} {matchFilter !== "ALL" ? matchFilter.toLowerCase() : ""} matches
        </div>

        {/* Match grid */}
        <div className="gap-6 grid md:grid-cols-2">
          {filteredMatches.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex flex-col justify-center items-center p-6">
                <p className="mb-4 text-muted-foreground">
                  No {matchFilter !== "ALL" ? matchFilter.toLowerCase() : ""} matches found for this round.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredMatches.map((match) => (
              <Card
                key={match?.match_id}
                className={`hover:shadow-md overflow-hidden transition-shadow ${
                  match.match_form === "REMATCH" 
                    ? "border-l-4 border-l-amber-400" 
                    : "border-l-4 border-l-blue-400"
                }`}
              >
                <CardHeader className={`p-4 pb-3 border-b ${
                  match.match_form === "REMATCH" 
                    ? "bg-amber-50" 
                    : "bg-gray-50"
                }`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-bold text-lg">
                        Match {match?.match_name}
                      </CardTitle>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-center gap-2">
                          <div className="text-gray-500 text-sm">
                            Code: {match?.match_code}
                          </div>
                          {match.match_form && (
                            <Badge
                              variant="outline"
                              className={
                                match.match_form === "REMATCH"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-blue-100 text-blue-800 border-blue-200"
                              }
                            >
                              {match.match_form}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Add rematch information button in the header */}
                        {match.match_form === "REMATCH" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenRematchModal(match)}
                            className="text-amber-700 hover:text-amber-900 hover:bg-amber-100 p-1 h-auto"
                          >
                            <Info className="h-4 w-4 mr-1" />
                            <span className="text-xs">View Original Match</span>
                          </Button>
                        )}
                      </div>
                    </div>
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
                            {uniqueTeams.length === 2 && (
                              <>
                                <div className="font-bold text-lg">VS</div>
                                <div className="font-medium">
                                  {uniqueTeams[1]?.team_name || "Team Not Available"}
                                  <span className="ml-1 text-gray-500 text-xs">
                                    ({uniqueTeams[1]?.team_tag || "N/A"})
                                  </span>
                                </div>
                              </>
                            )}
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
                        <div className="col-span-2 mt-2">
                          <Collapsible>
                            <CollapsibleTrigger className="flex justify-between items-center p-2 w-full text-gray-600 hover:text-gray-800 text-sm border rounded-md">
                              <span>View Team Score Details</span>
                              <ChevronDown className="w-4 h-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="mt-2">
                              {(() => {
                                const uniqueTeams = Array.from(
                                  new Map(
                                    match?.teams?.map((team) => [team.team_id, team])
                                  ).values()
                                );
                                
                                return (
                                  <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="bg-gray-100">
                                            <th className="p-2 text-left">Team</th>
                                            <th className="p-2 text-right">Score</th>
                                            <th className="p-2 text-right">Actions</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {uniqueTeams.map((team) => (
                                            <tr key={team.team_id} className="border-b">
                                              <td className="p-2">
                                                <div className="font-medium">{team.team_name}</div>
                                                <div className="text-xs text-gray-500">{team.team_tag || "N/A"}</div>
                                              </td>
                                              <td className="p-2 text-right">
                                                {loadingScores[`${match.match_id}-${team.team_id}`] ? (
                                                  <div className="flex justify-end">
                                                    <LoadingIndicator size="small" />
                                                  </div>
                                                ) : scoreDetails[`${match.match_id}-${team.team_id}`] ? (
                                                  <span className="font-medium">
                                                    {formatFloat(scoreDetails[`${match.match_id}-${team.team_id}`][0]?.team_score || 0)}
                                                  </span>
                                                ) : (
                                                  "Not loaded"
                                                )}
                                              </td>
                                              <td className="p-2 text-right">
                                                {!scoreDetails[`${match.match_id}-${team.team_id}`] ? (
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => fetchScoreDetails(match.match_id, team.team_id)}
                                                    disabled={loadingScores[`${match.match_id}-${team.team_id}`]}
                                                  >
                                                    Load Details
                                                  </Button>
                                                ) : (
                                                  <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                      // Toggle detailed view for this team
                                                      setExpandedTeamDetails(prev => 
                                                        prev === `${match.match_id}-${team.team_id}` 
                                                          ? null 
                                                          : `${match.match_id}-${team.team_id}`
                                                      );
                                                    }}
                                                  >
                                                    View Players
                                                  </Button>
                                                )}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                    
                                    {/* Expanded player details */}
                                    {uniqueTeams.map(team => (
                                      expandedTeamDetails === `${match.match_id}-${team.team_id}` && 
                                      scoreDetails[`${match.match_id}-${team.team_id}`] && (
                                        <div key={`details-${team.team_id}`} className="bg-gray-50 p-3 border rounded-lg mt-2">
                                          <h4 className="font-medium mb-2">{team.team_name} Player Details</h4>
                                          <div className="space-y-3">
                                            {scoreDetails[`${match.match_id}-${team.team_id}`].map(player => (
                                              <div key={player.player_id} className="bg-white p-3 border rounded-lg">
                                                <div className="flex justify-between items-center mb-2">
                                                  <div className="font-medium">{player.player_name}</div>
                                                  <Badge variant="secondary">Score: {formatFloat(player.team_score)}</Badge>
                                                </div>
                                                
                                                <div className="gap-x-4 gap-y-1 grid grid-cols-2 text-sm">
                                                  <div className="text-gray-600">Lap:</div>
                                                  <div className="text-right">{player.lap}</div>
                                                  
                                                  <div className="text-gray-600">Fastest Lap:</div>
                                                  <div className="text-right">{formatFloat(player.fastest_lap_time)}s</div>
                                                  
                                                  <div className="text-gray-600">Collision:</div>
                                                  <div className="text-right">{player.collision}</div>
                                                  
                                                  <div className="text-gray-600">Off Track:</div>
                                                  <div className="text-right">{player.off_track}</div>
                                                  
                                                  <div className="text-gray-600">Assist Usage:</div>
                                                  <div className="text-right">{player.assist_usage}</div>
                                                  
                                                  <div className="text-gray-600">Top Speed:</div>
                                                  <div className="text-right">{formatFloat(player.top_speed)} km/h</div>
                                                  
                                                  <div className="text-gray-600">Avg Speed:</div>
                                                  <div className="text-right">{formatFloat(player.average_speed)} km/h</div>
                                                  
                                                  <div className="text-gray-600">Distance:</div>
                                                  <div className="text-right">{formatFloat(player.total_distance)} m</div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )
                                    ))}
                                  </div>
                                );
                              })()}
                            </CollapsibleContent>
                          </Collapsible>
                        </div>
                      )}
                    </div>

                    {match.location && (
                      <div className="mt-2 text-sm">
                        <span className="text-muted-foreground">Location: </span>
                        {match.location}
                      </div>
                    )}

                    {/* Remove the button from here since we moved it to the header */}
                    {/* Remove this section:
                    {match.match_form === "REMATCH" && (
                      <div className="mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => handleOpenRematchModal(match)}
                        >
                          <Info className="mr-2 h-4 w-4" />
                          View Original Match
                        </Button>
                      </div>
                    )}
                    */}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
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

      {/* Add Rematch Modal */}
      <Modal size="md" show={rematchModalShow} onHide={handleCloseRematchModal}>
        <Modal.Header content="Rematch Information" />
        <Modal.Body>
          {loadingRematchInfo ? (
            <div className="flex justify-center py-4">
              <LoadingIndicator size="medium" />
            </div>
          ) : rematchInfo ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Original Match Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Match Name:</span>
                  <span>{rematchInfo?.match_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Match Code:</span>
                  <span>{rematchInfo?.match_code}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Start:</span>
                  <span>{formatTimeString(rematchInfo?.time_start)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">End:</span>
                  <span>{formatTimeString(rematchInfo?.time_end)}</span>
                </div>
              </div>

              {/* Team Information */}
              {rematchInfo?.teams && rematchInfo.teams.length > 0 && (
                <>
                  <h3 className="font-semibold text-lg mt-4">Team Information</h3>
                  <div className="space-y-2">
                    {Array.from(
                      new Map(
                        rematchInfo.teams.map((team) => [team.team_id, team])
                      ).values()
                    ).map((team) => (
                      <div 
                        key={team.team_id} 
                        className="bg-gray-50 p-3 border rounded-lg"
                      >
                        <div className="font-medium">{team.team_name}</div>
                        <div className="text-sm text-gray-500">
                          Tag: {team.team_tag || "N/A"}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h3 className="font-semibold text-lg mt-4">
                Complaint Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Complaint Title:</span>
                  <span>{rematchInfo?.complaint_title}</span>
                </div>
                <div className="mt-2">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-sm border p-2 rounded bg-gray-50">
                    {rematchInfo?.complaint_description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No rematch information available.
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};
