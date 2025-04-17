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
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "@/AtomicComponents/organisms/Modal/Modal";
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

  // BREADCRUM ITEMS
  const breadcrumbItems = [
    { label: `${roundNameFromState}`, href: "/rounds" },
    { label: "Matches", href: `/rounds/${roundId}/matches` },
  ];

  // HANDLE SELECT MATCH
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    setAssignData({
      matchTeamid: "", // user will select this later
      assigner: playerId,
      assignee: "",
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
      }
    } catch (error) {
      if (error.response?.status === 400 && error.response.data?.data) {
        const serverErrors = NormalizeServerErrors(error.response.data.data);

        // Merge existing and new errors
        setUpdateProfileErrors((prev) => ({
          ...prev,
          ...serverErrors,
        }));
      }
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

  return (
    <>
      {isLoading && <Spinner />}
      <Breadcrumb items={breadcrumbItems} />

      {/* Switch button for different render mode */}
      <div className="w-full mb-5">
        <div className="inline-flex items-center gap-4 border border-gray-600 p-4 rounded-md">
          <Switch
            id="assigned-toggle"
            checked={assignedModeToggle}
            onCheckedChange={setAssignedModeToggle}
          />
          <Label
            htmlFor="assigned-toggle"
            className="text-sm text-muted-foreground"
          >
            Assigned Mode
          </Label>
        </div>
      </div>

      {/* Match card render */}
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
              className="hover:shadow-xl transition-shadow overflow-hidden self-start min-h-[300px]"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start gap-3">
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
                      <div className="col-span-2">
                        <Collapsible>
                          <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800 p-2">
                            <span>Score Details</span>
                            <ChevronDown className="h-4 w-4" />
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
                              <div className="p-2 space-y-4">
                                {scoreDetails[
                                  `${match.match_id}-${match.team_id}`
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
                    <div className="text-sm mt-2">
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
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Assign Modal */}
      <Modal size="md" show={assignModalShow} onHide={handleAssignModalClose}>
        <ModalHeader content={"Assign Player To A Match"} />
        <ModalBody className="">
          <form
            onSubmit={handleSubmitAssignPlayer}
            className="flex flex-col gap-6"
          >
            <h2 className="text-h2 font-bold">{selectedMatch?.match_name}</h2>
            <h5 className="text-h5 italic">{selectedMatch?.match_code}</h5>

            {/* Start Date */}
            <div className="flex gap-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Start:</span>
              <span>
                {`${GetDateFromDate(
                  selectedMatch?.time_start
                )} - ${GetTimeFromDate(selectedMatch?.time_start)}`}
              </span>
            </div>

            {/* End Date */}
            <div className="flex gap-2">
              <Calendar className="h-4 w-4 mr-2" />
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
              {!selectedMatch?.match_team || selectedMatch.match_team.length === 0 ? (
                <p className="text-md text-red-500">No slots available</p>
              ) : (
                <Select
                  options={selectedMatch.match_team.map((m, index) => ({
                    value: m.match_team_id,
                    label: `Slot ${index + 1}${m.player_id ? ` (Assigned to ${m.player_name || 'Someone'})` : ''}`,
                  }))}
                  placeHolder="Select slot"
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
                disabled={!assignData.assignee || !assignData.matchTeamid}
                content={
                  selectedMatch?.match_team?.find(m => m.match_team_id === assignData.matchTeamid)?.player_id 
                  ? "Reassign Player" 
                  : "Assign Player"
                }
                type="submit"
              />
            </div>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PlayerMatches;
