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
import { formatDateString } from "@/utils/dateUtils";
import { Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
// import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/AtomicComponents/atoms/Button/Button";
import { GetDateFromDate, GetTimeFromDate } from "@/utils/DateConvert";
import Select from "@/AtomicComponents/atoms/Select/Select";
import { number } from "prop-types";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { ChevronDown } from "lucide-react";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { Button as ButtonShadcn } from "@/AtomicComponents/atoms/shadcn/button";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { NormalizeServerErrors } from "@/utils/NormalizeError";

const PlayerMatches = () => {
  const { roundId } = useParams();
  const { auth } = useAuth();
  const [matchesList, setMatchesList] = useState([]);
  const [assignedModeToggle, setAssignedModeToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const [_teamMember, setTeamMember] = useState([]);
  const [playerOptions, setPlayerOptions] = useState([]);
  const [assignData, setAssignData] = useState({
    matchTeamid: 0,
    assigner: "",
    assignee: "",
  });
  const playerId = auth?.id;
  const location = useLocation();
  const roundNameFromState = location.state?.roundName;
  const [scoreDetails, setScoreDetails] = useState({});
  const [loadingScores, setLoadingScores] = useState({});
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [complaintData, setComplaintData] = useState({
    matchTeamId: "",
    title: "",
    description: "",
  });

  // BREADCRUM ITEMS
  const breadcrumbItems = [
    { label: `${roundNameFromState}`, href: "/rounds" },
    { label: "Matches", href: `/rounds/${roundId}/matches` },
  ];

  // HANDLE SELECT MATCH
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);

    // Set default values for the first available slot and first player
    const firstAvailableSlot = match.match_team?.[0]?.match_team_id || "";
    const firstPlayer = playerOptions?.[0]?.value || "";

    setAssignData({
      matchTeamid: firstAvailableSlot,
      assigner: playerId,
      assignee: firstPlayer,
    });
  };

  //#region MODAL CONTROL
  const handleAssignmModalShow = () => {
    setAssignModalShow(true);
  };

  const handleAssignModalClose = () => {
    setAssignModalShow(false);

    // Remove selected match after modal close
    setTimeout(() => {
      setSelectedMatch(null);
    }, 100);
  };
  //#endregion

  // HANDLE SUBMIT ASSIGN PLAYER TO MATCH
  const handleSubmitAssignPlayer = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await apiClient.put(
        `matches/assign/${assignData.matchTeamid}?assigner=${assignData.assigner}&assignee=${assignData.assignee}`
      );
      if (response.data.http_status === 200) {
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });
        setAssignModalShow(false);

        // Refetch matches data
        if (roundId && playerId) {
          const fetchMatches = async () => {
            try {
              const response = assignedModeToggle
                ? await apiClient.get(
                    `matches/by-round-and-player?roundId=${roundId}&accountId=${auth.id}`
                  )
                : await apiClient.get(`matches/team/${auth?.teamId}`);

              if (response.data.http_status === 200) {
                const data = response.data.data;
                const formattedData = data;
                setMatchesList(
                  Array.isArray(formattedData) ? formattedData : []
                );
              }
            } catch (error) {
              console.error("Error fetching matches:", error);
              Toast({
                title: "Error",
                message: "Failed to refresh matches data",
                type: "error",
              });
            }
          };

          await fetchMatches();
        }
      }
    } catch (error) {
      console.log("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // GET MATCHES BY ROUND ID AND PLAYER ID
  useEffect(() => {
    if (!roundId || !playerId) return;

    const fetchMatches = async () => {
      try {
        setIsLoading(true);

        const response = assignedModeToggle
          ? /*await apiClient.get(
              `matches/by-round-and-player?roundId=${roundId}&accountId=${auth.id}`
            )*/ await apiClient.get(
              `matches/by-round-and-player?roundId=${roundId}&accountId=${auth.id}`
            )
          : await apiClient.get(`matches/team/${auth?.teamId}`);

        if (response.data.http_status === 200) {
          const data = response.data.data;

          // Handle data format for each API
          const formattedData = data;
          setMatchesList(Array.isArray(formattedData) ? formattedData : []);
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignedModeToggle, roundId, playerId]);

  // GET TEAM MEMBER BY MATCH ID
  useEffect(() => {
    if (!auth?.teamId) return;

    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get(`teams/members/${auth?.teamId}`);

        if (response.status === 200) {
          setTeamMember(response.data.data);
          setPlayerOptions(
            response.data.data.map((member) => ({
              value: member.id,
              label: member.full_name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching team members:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchScoreDetails = async (matchId, teamId) => {
    console.log("Fetching score details for:", matchId, teamId); // Add this for debugging
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
    } finally {
      setLoadingScores((prev) => ({
        ...prev,
        [`${matchId}-${teamId}`]: false,
      }));
    }
  };

  const handleComplaintModalShow = (match) => {
    setComplaintData({
      matchTeamId: "",
      title: "",
      description: "",
    });
    setSelectedMatch(match);
    setComplaintModalShow(true);
  };

  const handleComplaintModalClose = () => {
    setComplaintModalShow(false);
    setComplaintData({
      matchTeamId: "",
      title: "",
      description: "",
    });
    setSelectedMatch(null);
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const response = await apiClient.post(
        `complaints/create?matchTeamId=${complaintData.matchTeamId}`,
        {
          title: complaintData.title,
          description: complaintData.description,
        }
      );

      if (response.data.http_status === 201) {
        Toast({
          title: "Success",
          message: "Complaint submitted successfully",
          type: "success",
        });
        handleComplaintModalClose();
      }
    } catch (error) {
      Toast({
        title: "Error",
        message: error.response?.data?.error || "Failed to submit complaint",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <Breadcrumb items={breadcrumbItems} />

      {/* Switch button for different render mode */}
      <div className="mb-5 w-full">
        <div className="inline-flex items-center gap-4 p-4 border border-gray-600 rounded-md">
          <Switch
            id="assigned-toggle"
            checked={assignedModeToggle}
            onCheckedChange={setAssignedModeToggle}
          />
          <Label
            htmlFor="assigned-toggle"
            className="text-muted-foreground text-sm"
          >
            Assigned Mode
          </Label>
        </div>
      </div>

      {/* Match card render */}
      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3 mb-4">
        {matchesList.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col justify-center items-center p-6">
              <p className="mb-4 text-muted-foreground">No matches found.</p>
            </CardContent>
          </Card>
        ) : (
          matchesList.map((match) => (
            <Card
              key={match.match_id}
              className="self-start hover:shadow-xl min-h-[300px] overflow-hidden transition-shadow"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start gap-3">
                  <CardTitle className="font-bold text-lg">
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
                <div className="text-gray-500 text-sm">
                  Code: {match.match_code}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="gap-2 grid grid-cols-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(match.time_start)}
                    </span>

                    <div className="flex items-center">
                      <Clock className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(match.time_end)}
                    </span>

                    {match.status === "FINISHED" && (
                      <div className="col-span-2">
                        <Collapsible>
                          <CollapsibleTrigger className="flex justify-between items-center p-2 w-full text-gray-600 hover:text-gray-800 text-sm">
                            <span>Score Details</span>
                            <ChevronDown className="w-4 h-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            {loadingScores[
                              `${match.match_id}-${match.team_id}`
                            ] ? (
                              <div className="flex justify-center py-2">
                                <LoadingIndicator size="small" />
                              </div>
                            ) : scoreDetails[
                                `${match.match_id}-${match.team_id}`
                              ] ? (
                              <div className="space-y-4 p-2">
                                {scoreDetails[
                                  `${match.match_id}-${match.team_id}`
                                ].map((player) => (
                                  <div
                                    key={player.player_id}
                                    className="bg-gray-50 p-3 border rounded-lg"
                                  >
                                    <div className="flex justify-between items-center mb-2">
                                      <div className="font-medium">
                                        {player.player_name}
                                      </div>
                                      <Badge variant="secondary">
                                        Score: {player.team_score}
                                      </Badge>
                                    </div>

                                    <div className="gap-x-4 gap-y-1 grid grid-cols-2 text-sm">
                                      <div className="text-gray-600">Lap:</div>
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
                              <ButtonShadcn
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                onClick={() => {
                                  console.log("Button clicked"); // Add this for debugging
                                  fetchScoreDetails(
                                    match.match_id,
                                    match.team_id
                                  );
                                }}
                              >
                                Load Score Details
                              </ButtonShadcn>
                            )}
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

                  <div className="text-center">
                    {match?.status.toString().toLowerCase() === "pending" ? (
                      <Button
                        className="font-semibold"
                        content="Assign player"
                        onClick={() => {
                          handleSelectMatch(match);
                          handleAssignmModalShow();
                        }}
                      />
                    ) : (
                      <Button
                        className="font-semibold"
                        content="Assign player"
                        disabled
                        tooltipData="Cannot assign player for this match"
                      />
                    )}

                    {/* Add Complaint Button */}
                    {match.match_team?.some((m) => m.player_id === auth.id) && (
                      <Button
                        className="font-semibold"
                        content="Submit Complaint"
                        onClick={() => handleComplaintModalShow(match)}
                      />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assign Modal */}
      <Modal size="md" show={assignModalShow} onHide={handleAssignModalClose}>
        <Modal.Header content={"Assign Player To A Match"} />
        <Modal.Body className="">
          <form
            onSubmit={handleSubmitAssignPlayer}
            className="flex flex-col gap-6"
          >
            <h2 className="font-bold text-h2">{selectedMatch?.match_name}</h2>
            <h5 className="text-h5 italic">{selectedMatch?.match_code}</h5>

            {/* Start Date */}
            <div className="flex gap-2">
              <Calendar className="mr-2 w-4 h-4" />
              <span>Start:</span>
              <span>
                {`${GetDateFromDate(
                  selectedMatch?.time_start
                )} - ${GetTimeFromDate(selectedMatch?.time_start)}`}
              </span>
            </div>

            {/* End Date */}
            <div className="flex gap-2">
              <Calendar className="mr-2 w-4 h-4" />
              <span>End:</span>
              <span>
                {`${GetDateFromDate(
                  selectedMatch?.time_end
                )} - ${GetTimeFromDate(selectedMatch?.time_end)}`}
              </span>
            </div>

            {/* Select slot */}
            <div className="">
              <label className="block mb-1">Select slot</label>
              {!selectedMatch?.match_team ||
              selectedMatch.match_team.length === 0 ? (
                <p className="text-md text-red-500">No slots available</p>
              ) : (
                <Select
                  options={selectedMatch.match_team.map((m, index) => ({
                    value: m.match_team_id,
                    label: `Slot ${index + 1}${
                      m.player_id
                        ? ` (Assigned to ${m.player_name || "Someone"})`
                        : ""
                    }`,
                  }))}
                  placeHolder="Select slot"
                  value={assignData.matchTeamid}
                  onChange={(e) =>
                    setAssignData((prev) => ({
                      ...prev,
                      matchTeamid: e.target.value,
                    }))
                  }
                />
              )}
            </div>

            {/* Select team member */}
            <div className="">
              <label className="block mb-1">Select team member</label>
              <Select
                options={playerOptions}
                placeHolder="Select player"
                value={assignData.assignee}
                onChange={(e) =>
                  setAssignData((prev) => ({
                    ...prev,
                    assignee: e.target.value,
                  }))
                }
              />
            </div>

            <div className="text-center">
              <Button
                content={
                  selectedMatch?.match_team?.find(
                    (m) => m.match_team_id === assignData.matchTeamid
                  )?.player_id
                    ? "Reassign Player"
                    : "Assign Player"
                }
                type="submit"
              />
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PlayerMatches;
