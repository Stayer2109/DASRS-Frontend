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
import Button from "@/AtomicComponents/atoms/Button/Button";
import { GetDateFromDate, GetTimeFromDate } from "@/utils/DateConvert";

const PlayerMatches = () => {
  const { roundId } = useParams();
  const { auth } = useAuth();
  const [matchesList, setMatchesList] = useState([]);
  const [assignedModeToggle, setAssignedModeToggle] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [assignModalShow, setAssignModalShow] = useState(false);
  const playerId = auth?.id;
  const location = useLocation();
  const roundNameFromState = location.state?.roundName;

  // BREADCRUM ITEMS
  const breadcrumbItems = [
    { label: `${roundNameFromState}`, href: "/rounds" },
    { label: "Matches", href: `/rounds/${roundId}/matches` },
  ];

  // HANDLE SELECT MATCH
  const handleSelectMatch = (match) => {
    setSelectedMatch(match);
    console.log("Selected Match:", match);
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

  // GET MATCHES BY ROUND ID AND PLAYER ID
  useEffect(() => {
    if (!roundId || !playerId) return;

    const fetchMatches = async () => {
      try {
        setIsLoading(true);

        const response = assignedModeToggle
          ? await apiClient.get(
              `matches/by-round-and-player?roundId=${roundId}&accountId=${auth.id}`
            )
          : await apiClient.get(`matches/round/${roundId}`, {
              params: {
                sortBy: "SORT_BY_ID_ASC",
              },
            });

        if (response.data.http_status === 200) {
          const data = response.data.data;

          // Handle data format for each API
          const formattedData = assignedModeToggle ? data : data?.content;
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

  // GET SELECTED MATCH
  useEffect(() => {
    if (!selectedMatch) return;

    try {
      setIsLoading(true);
    } catch (error) {
      console.log("Error fetching selected match:", error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedMatch]);

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
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="font-medium text-blue-600">
                      {match.teams[0].team_name || "No Team"}
                    </div>
                    <div className="text-lg font-bold text-gray-700">VS</div>
                    <div className="font-medium text-red-600">
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

                  <div className="text-center">
                    {match?.status.toString().toLowerCase() === "pending" ? (
                      <Button
                        content="Assign player"
                        onClick={() => {
                          handleSelectMatch(match);
                          handleAssignmModalShow();
                        }}
                      />
                    ) : (
                      <Button
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
          <div className="selected-match-container flex flex-col gap-2">
            <h2 className="selected-match-name text-h2 font-bold">
              {selectedMatch?.match_name}
            </h2>
            <h5 className="text-h5 italic">{selectedMatch?.match_code}</h5>
            {/* Start Date */}
            <div className="flex gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="">Start:</span>
              </div>
              <span className="text-right">
                {`${GetDateFromDate(
                  selectedMatch?.time_start
                )} - ${GetTimeFromDate(selectedMatch?.time_start)}`}
              </span>
            </div>

            {/* End Date */}
            <div className="flex gap-2">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                <span className="">End:</span>
              </div>
              <span className="text-right">
                {`${GetDateFromDate(
                  selectedMatch?.time_end
                )} - ${GetTimeFromDate(selectedMatch?.time_end)}`}
              </span>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default PlayerMatches;
