import { Calendar, Flag, Map, Plus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { FormatDateInput, FormatToISODate } from "@/utils/DateConvert";
import { Modal, ModalBody, ModalHeader } from "@/AtomicComponents/organisms/Modal/Modal";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Checkbox } from "@/AtomicComponents/atoms/shadcn/checkbox";
import { EnvironmentDetails } from "../CollapsibleDetails/EnvironmentDetails";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { MapDetails } from "../CollapsibleDetails/MapDetails";
import { RoundStatusBadge } from "../RoundCard/RoundCard";
import { ScoreMethodDetails } from "../CollapsibleDetails/ScoreMethodDetails";
import Select from "@/AtomicComponents/atoms/Select/Select";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { apiClient } from "@/config/axios/axios";
import { formatDateString } from "@/utils/dateUtils";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { Button as ButtonIcon } from './../../atoms/Button/Button';

const initialFormData = {
  description: "",
  round_name: "",
  round_duration: 0,
  lap_number: 0,
  finish_type: "",
  team_limit: 0,
  is_last: false,
  start_date: "",
  end_date: "",
  tournament_id: 0,
  environment_id: 0,
  match_type_id: 0,
  resource_id: 0,
  lap: 250,
  collision: -50,
  total_race_time: -10,
  off_track: -10,
  assist_usage: -350,
  average_speed: 30,
  total_distance: 100,
};

const MatchFinishTypeOptions = [
  { value: "LAP", label: "LAP" },
  { value: "TIME", label: "TIME" },
]

export const TournamentRounds = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const { tournamentId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resources, setResources] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [matchTypes, setMatchTypes] = useState([]);
  const [_isLoadingResources, setIsLoadingResources] = useState(true);
  const [selectedRound, setSelectedRound] = useState(null);
  const [isSubmitting, _setIsSubmitting] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [roundsManagementModalShow, setRoundManagementModalShow] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'

  // BREADCRUMB ITEMS
  const breadcrumbItems = [
    { label: "Tournaments", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: "/tournaments",
    },
    { label: "Rounds" },
  ];

  // HANDLE NAVIGATE BACK TO TOUNRNAMENTS
  const handleBackToTournament = () => {
    navigate("/tournaments", { replace: true });
  };

  // HANDLE VIEW MATCHES OF ROUND
  const handleViewMatches = (roundId) => {
    navigate(`/tournaments/${tournamentId}/rounds/${roundId}/matches`);
  };

  // HANDLE VIEW LEADERBOARD OF ROUND
  const handleViewLeaderboard = (roundId) => {
    navigate(`${roundId}/matches`);
  };

  // HANDLE ROUND MANAGEMENT FORM SUBMIT
  const handleRoundManagementFormSubmit = async (e) => {
    e.preventDefault();
  }

  // HANDLE SELECT CHANGE
  const onResourceSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //#region MODAL CONTROL
  // DATA MANIPULATION FOR ROUND MANAGEMENT MODAL WHEN OPENED
  /**
   * Opens the round modal in create or edit mode.
   * @param {object|null} round - The round to edit. If null, creates a new one. Default value is NULL.
   */
  const handleOpenTournamentManagementModal = (round = null) => {
    setRoundManagementModalShow(true);
    setSelectedRound(round);
    setFormMode(round ? "edit" : "create");

    setFormData({
      description: round?.description || "",
      round_name: round?.round_name || "",
      round_duration: round?.round_duration || 0,
      lap_number: round?.lap_number || 0,
      finish_type: round?.finish_type || "",
      team_limit: round?.team_limit || 0,
      is_last: round?.is_last || false,
      start_date:
        FormatDateInput(round?.start_date) || FormatToISODate(new Date().getTime() + 1 * 86400000),
      end_date:
        FormatDateInput(round?.end_date) || "",
      tournament_id: tournamentId,
      environment_id: round?.environment_id || 0,
      match_type_id: round?.match_type_id || 0,
      resource_id: round?.resource_id || 0,
      lap: round?.lap || 250,
      collision: round?.collision || -50,
      total_race_time: round?.total_race_time || -10,
      off_track: round?.off_track || -10,
      assist_usage: round?.assist_usage || -350,
      average_speed: round?.average_speed || 30,
      total_distance: round?.total_distance || 100,
    });
  };

  const handleCloseRoundManagementModal = () => {
    setRoundManagementModalShow(false);
    setSelectedRound(null);
    setFormData(initialFormData);
    setFormMode("create");
  };
  //#endregion

  //#region USEEFFECT SCOPES
  // FETCH ROUND and ITS ROUNDS
  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [tournamentRes, roundsRes] = await Promise.all([
          apiClient.get(`tournaments/${tournamentId}`), // Tournament details
          apiClient.get(`rounds/tournament/${tournamentId}`), // Rounds of a tournament
        ]);

        setTournament(tournamentRes.data.data);
        setRounds(roundsRes.data.data || []);
      } catch (err) {
        console.error("Error fetching tournament rounds:", err);
        setError("Failed to load rounds. Please try again.");
        toast.error("Failed to load rounds");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  // FETCH RECOURCES SUCH AS MAPS, ENVIRONMENTS AND MATCH TYPES
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);

      try {
        const [resourcesRes, environmentsRes, matchTypesRes] =
          await Promise.all([
            apiClient.get("resources/map?pageSize=100"),
            apiClient.get("environments"),
            apiClient.get("match-types"),
          ]);

        setResources(resourcesRes.data.data.content || []);
        setEnvironments(environmentsRes.data.data.content || []);
        setMatchTypes(matchTypesRes.data.data.content || []);
      } catch (err) {
        console.error("Error fetching resources:", err);
        toast.error("Failed to load resources");
      } finally {
        setIsLoadingResources(false);
      }
    };

    fetchResources();
  }, []); // Empty dependency array as we only need to fetch once

  // SET END DATE FOR CREATE ROUND
  useEffect(() => {
    const nextDay = new Date(
      new Date(formData?.start_date).getTime() + 1 * 86400000
    );

    if (formMode === "create" && formData?.start_date) {
      setFormData((prev) => ({ ...prev, end_date: FormatToISODate(nextDay) }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.start_date]);

  // SET START DATE AND END DATE FOR EDIT ROUND
  useEffect(() => {
    if (
      formMode === "edit" &&
      selectedRound?.start_date &&
      selectedRound?.end_date
    ) {
      // Get current date, start date and end date of selected tournament
      const now = new Date();
      const originalStart = new Date(selectedRound.start_date);
      const originalEnd = new Date(selectedRound.end_date);

      // Check if both dates are before now
      const isPastStart = originalStart <= now;
      const isPastEnd = originalEnd <= now;

      // For start date
      if (isPastStart) {
        const newStart = new Date(now.getTime() + 1 * 86400000); // tomorrow

        setFormData((prev) => ({
          ...prev,
          start_date: FormatToISODate(newStart),
        }));
      } else {
        // Keep original dates (just normalize them)
        setFormData((prev) => ({
          ...prev,
          start_date: FormatToISODate(selectedRound.start_date),
        }));
      }

      // For end date
      if (isPastEnd) {
        const newEnd = new Date(originalStart.getTime() + 1 * 86400000); // day after start date

        setFormData((prev) => ({
          ...prev,
          end_date: FormatToISODate(newEnd),
        }));
      } else {
        // Keep original end date (just normalize it)
        setFormData((prev) => ({
          ...prev,
          end_date: FormatToISODate(selectedRound.end_date),
        }));
      }
    }
  }, [formMode, selectedRound]);
  //#endregion

  // RENDER SPINNER IF LOADING
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      {/* Title Of Page */}
      <div className="flex justify-between items-center gap-5">
        <h2 className="font-bold text-2xl">
          {tournament?.tournament_name} - Rounds
        </h2>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleBackToTournament}
            className="cursor-pointer"
          >
            Back to Tournaments
          </Button>
          {auth?.role === "ORGANIZER" && (
            <Button
              className="cursor-pointer"
              onClick={() => handleOpenTournamentManagementModal(null)}
            >
              <Plus className="mr-2 w-4 h-4" /> Create Round
            </Button>
          )}
        </div>
      </div>

      {/* Display Errors If Any Found */}
      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Round Card Render */}
      <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
        {rounds.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col justify-center items-center p-6">
              <p
                className={`text-muted-foreground ${auth?.role === "ORGANIZER" ? "mb-4" : ""
                  }`}
              >
                No rounds found for this tournament.
              </p>
              {auth?.role === "ORGANIZER" && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenTournamentManagementModal(null)}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 w-4 h-4" /> Create First Round
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          rounds.map((round) => (
            <Card
              key={round.round_id}
              className="flex flex-col hover:shadow-md h-full overflow-hidden transition-shadow"
            >
              <CardHeader className="flex flex-col justify-between bg-gray-50 p-4 pb-3 border-b h-[120px] shrink-0">
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
                <Button
                  variant="outline"
                  size="sm"
                  // onClick={() => handleEditRound(round)}
                  className="cursor-pointer"
                >
                  Edit
                </Button>
                <div className="flex space-x-2 mt-auto">
                  <RoundStatusBadge status={round.status} />
                  {round.is_last && (
                    <Badge className="bg-red-500 text-white">Final Round</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 h-[400px] overflow-y-auto">
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
                      <span className="text-muted-foreground">Match Type:</span>
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
                    <EnvironmentDetails environmentId={round.environment_id} />
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
                    onClick={() => handleViewMatches(round.round_id)}
                  >
                    View Matches
                  </Button>
                </CardFooter>
                <CardFooter className="p-4 pt-0">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => handleViewLeaderboard(round.round_id)}
                  >
                    View Leaderboard
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Round Management Modal */}
      <Modal size="md"
        onHide={handleCloseRoundManagementModal}
        show={roundsManagementModalShow}>
        <ModalHeader content={formMode === "create" ? "Create Round" : "Edit Round"} />
        <ModalBody>
          <form onSubmit={handleRoundManagementFormSubmit} className="flex flex-col h-full">
            <div className="flex-1 -mr-4 py-2 pr-4 overflow-y-auto">
              <div className="gap-4 grid grid-cols-2 px-1">
                <div className="space-y-2">
                  {/* Round Name */}
                  <Label htmlFor="round_name">Round Name</Label>
                  <Input
                    id="round_name"
                    name="round_name"
                    value={formData?.round_name || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, round_name: e.target.value }));
                    }}
                    required
                  />
                </div>

                {/* Qualification Spot */}
                <div className="space-y-2">
                  <Label htmlFor="team_limit">Qualification Spots</Label>
                  <Input
                    id="team_limit"
                    name="team_limit"
                    type="number"
                    value={formData?.team_limit || 0}
                    min={0}
                    max={50}
                    onChange={(e) => {
                      setFormData((prev) => ({ ...prev, team_limit: e.target.value }));
                    }}
                    required
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="relative calendar-dropdown">
                    <Input
                      type="date"
                      placeholder="Choose start date"
                      value={FormatDateInput(formData.start_date) || ""}
                      min={FormatDateInput(new Date(Date.now() + 86400000))}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          start_date: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="relative calendar-dropdown">
                    <Input
                      type="date"
                      value={FormatDateInput(formData?.end_date) || ""}
                      min={FormatDateInput(new Date(formData.start_date).getTime() + 1 * 86400000)}
                      placeholder="Choose end date"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          end_date: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>

                {/* Score Method Section */}
                <div className="col-span-2">
                  <h3 className="mb-3 font-semibold text-lg">Scoring Method</h3>
                  <div className="gap-4 grid grid-cols-2 px-1">
                    {/* Lap Points */}
                    <div className="space-y-2">
                      <Label htmlFor="lap">Lap Points</Label>
                      <Input
                        id="lap"
                        name="lap"
                        type="number"
                        value={formData?.lap}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, lap: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Assist Usage Points */}
                    <div className="space-y-2">
                      <Label htmlFor="assistUsageCount">Assist Usage Points</Label>
                      <Input
                        id="assistUsageCount"
                        name="assistUsageCount"
                        type="number"
                        value={formData?.assist_usage}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, assist_usage: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Collision Points */}
                    <div className="space-y-2">
                      <Label htmlFor="collision">Collision Points</Label>
                      <Input
                        id="collision"
                        name="collision"
                        type="number"
                        value={formData?.collision}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, collision: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Race Time Points */}
                    <div className="space-y-2">
                      <Label htmlFor="total_race_time">Race Time Points</Label>
                      <Input
                        id="total_race_time"
                        name="total_race_time"
                        type="number"
                        value={formData?.total_race_time}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, total_race_time: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Off Track Points */}
                    <div className="space-y-2">
                      <Label htmlFor="off_track">Off Track Points</Label>
                      <Input
                        id="off_track"
                        name="off_track"
                        type="number"
                        value={formData?.off_track}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, off_track: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Average Speed Points */}
                    <div className="space-y-2">
                      <Label htmlFor="average_speed">Average Speed Points</Label>
                      <Input
                        id="average_speed"
                        name="average_speed"
                        type="number"
                        value={formData?.average_speed}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, average_speed: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Distance Points */}
                    <div className="space-y-2">
                      <Label htmlFor="total_distance">Distance Points</Label>
                      <Input
                        id="total_distance"
                        name="total_distance"
                        type="number"
                        value={formData?.total_distance}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, total_distance: e.target.value }));
                        }}
                        required
                      />
                    </div>

                    {/* Match Finish Type */}
                    <div className="space-y-2">
                      <Label>Match Finish Type</Label>
                      <Select
                        options={MatchFinishTypeOptions}
                        placeHolder={"Select Finish Type"}
                        value={formData?.finish_type}
                        onChange={(e) => {
                          setFormData((prev) => ({ ...prev, finish_type: e.target.value }));
                        }}
                      />
                    </div>

                  </div>
                </div>

                {/* Selection Cards */}
                <div className="space-y-4 col-span-2">
                  <Label>Resource</Label>
                  <div className="gap-4 grid grid-cols-3">
                    {resources?.map((resource) => (
                      <div
                        key={resource.resource_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.resource_id === resource.resource_id
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                          }`}
                        onClick={() =>
                          onResourceSelectChange("resource_id", resource.resource_id)
                        }
                      >
                        <h4 className="font-medium">{resource.resource_name}</h4>
                        <p className="text-muted-foreground text-sm">
                          {resource.resource_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 col-span-2">
                  <Label>Environment</Label>
                  <div className="gap-4 grid grid-cols-3">
                    {environments?.map((env) => (
                      <div
                        key={env.environment_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.environment_id === env.environment_id
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                          }`}
                        onClick={() =>
                          onResourceSelectChange("environment_id", env.environment_id)
                        }
                      >
                        <h4 className="font-medium">{env.environment_name}</h4>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 col-span-2">
                  <Label>Match Type</Label>
                  <div className="gap-4 grid grid-cols-3">
                    {matchTypes?.map((type) => (
                      <div
                        key={type.match_type_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${formData.match_type_id === type.match_type_id
                          ? "border-primary bg-primary/10"
                          : "hover:border-primary/50"
                          }`}
                        onClick={() =>
                          onResourceSelectChange("match_type_id", type.match_type_id)
                        }
                      >
                        <h4 className="font-medium">{type.match_type_name}</h4>
                        <p className="text-muted-foreground text-sm">
                          Duration: {type.match_duration}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Type: {type.finish_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    value={formData?.description}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="is_last"
                    checked={formData?.is_last}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, is_last: checked }))
                    }
                  />
                  <Label htmlFor="is_last">Is Final Round</Label>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
              <ButtonIcon
                type="button"
                onClick={handleCloseRoundManagementModal}
                content="Cancel"
              />
              <ButtonIcon
                type="submit"
                bgColor="#FFF"
                disabled={isSubmitting}
                content={
                  isSubmitting ? (
                    <>
                      <LoadingIndicator size="small" className="mr-2" />
                    </>
                  ) : formMode === "create" ? (
                    "Create Tournament"
                  ) : (
                    "Save Changes"
                  )
                } />
            </div>
          </form>
        </ModalBody>
      </Modal>
    </div>
  );
};
