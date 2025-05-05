/**
 * TournamentRounds Component
 * ------------------------
 * Handles the listing, creation, editing, and extending of rounds.
 * Includes table display, pagination, filtering, and form modal management.
 *
 * Some date validations to consider:
 * start date and end date should not less than tournament start start date or greater than tournament end date.
 * start date and end date can be equal
 *
 */

import { Calendar, Flag, Plus, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import {
  ConvertDate,
  FormatDateInput,
  FormatToISODate,
} from "@/utils/DateConvert";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Button as ButtonIcon } from "./../../atoms/Button/Button";
import { Checkbox } from "@/AtomicComponents/atoms/shadcn/checkbox";
import { EnvironmentDetails } from "../CollapsibleDetails/EnvironmentDetails";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { MapDetails } from "../CollapsibleDetails/MapDetails";
import { Map as MapIcon } from "lucide-react";
import { NormalizeData } from "@/utils/InputProces";
import { NormalizeServerErrors } from "@/utils/NormalizeError";
import { ParticipatingTeams } from "../CollapsibleDetails/ParticipatingTeams";
import { RoundManagementValidation } from "@/utils/Validation";
import { RoundStatusBadge } from "../RoundCard/RoundCard";
import { ScoreMethodDetails } from "../CollapsibleDetails/ScoreMethodDetails";
import Select from "@/AtomicComponents/atoms/Select/Select";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Toast from "../Toaster/Toaster";
import { Tooltip } from "react-tooltip";
import { apiClient } from "@/config/axios/axios";
import { formatDateString } from "@/utils/dateUtils";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

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
];

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
  const [roundManagementErrors, setRoundManagementErrors] = useState({});
  const [roundExtendedEndDate, setRoundExtendedEndDate] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rounds, setRounds] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [roundsManagementModalShow, setRoundManagementModalShow] =
    useState(false);
  const [extendedRoundModalShow, setExtendedRoundModalShow] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [isLastRoundWarning, setIsLastRoundWarning] = useState("");
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

  // CHECK IF ROUND IS LATEST
  const isLatestRound = (roundId) => {
    if (!rounds || rounds.length === 0) return false;
    const latestRound = rounds.reduce((prev, curr) =>
      new Date(curr.end_date) > new Date(prev.end_date) ? curr : prev
    );
    return latestRound.round_id === roundId;
  };

  // CHECK IF TOURNAMENT HAS FINAL ROUND
  const hasFinalRound = rounds.some((round) => round.is_last);

  // HANDLE VIEW MATCHES OF ROUND
  const handleViewMatches = (roundId) => {
    navigate(`/tournaments/${tournamentId}/rounds/${roundId}/matches`);
  };

  // HANDLE VIEW LEADERBOARD OF ROUND
  const handleViewLeaderboard = (roundId) => {
    navigate(`${roundId}/matches`);
  };

  // HANDLE TOURNAMENT MANAGEMENT DATA VALIDATION
  const handleRoundManagementValidation = (data) => {
    const errors = RoundManagementValidation(data);
    setRoundManagementErrors(errors);
  };

  // HANDLE ROUND MANAGEMENT FORM SUBMIT
  const handleRoundManagementFormSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const normalizedData = NormalizeData({
      ...formData,
      team_limit: formData.is_last ? 0 : formData.team_limit,
      start_date: FormatToISODate(formData.start_date),
      end_date: FormatToISODate(formData.end_date),
    });

    if (Object.keys(roundManagementErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const apiCall =
        formMode === "edit"
          ? apiClient.put(`/rounds`, normalizedData)
          : apiClient.post("/rounds", normalizedData);

      const response = await apiCall;

      if (
        response.data.http_status === 201 ||
        response.data.http_status === 200
      ) {
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });

        fetchTournamentRounds();
        handleCloseRoundManagementModal();
      }
    } catch (error) {
      const serverErrors = NormalizeServerErrors(
        error.response?.data?.data || {}
      );
      setRoundManagementErrors((prev) => ({ ...prev, ...serverErrors }));
      Toast({
        title: "Error",
        type: "error",
        message: error.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // HANDLE EXTEND ROUND FORM SUBMIT
  const handleExtendedRoundFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setIsSubmitting(true);

      const response = await apiClient.put(
        `/rounds/extend/${selectedRound.round_id}`,
        {},
        {
          params: {
            endDate: FormatToISODate(roundExtendedEndDate),
          },
        }
      );

      if (response.data.http_status === 200) {
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });
        fetchTournamentRounds();
        handleCloseExtendedRoundEndDateModal();
      }
    } catch (error) {
      Toast({
        title: "Error",
        type: "error",
        message: error.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
      setRoundExtendedEndDate(null); // Reset the extended end date
    }
  };

  // HANDLE SELECT CHANGE
  const onResourceSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // FETCH TOURNAMENT AND ROUNDS
  const fetchTournamentRounds = async () => {
    if (!tournamentId) return;

    setIsLoading(true);
    setError(null);

    try {
      const [tournamentRes, roundsRes] = await Promise.all([
        apiClient.get(`tournaments/${tournamentId}`), // Tournament details
        apiClient.get(`rounds/tournament/${tournamentId}`), // Rounds of a tournament
      ]);

      setTournament(tournamentRes.data.data);

      // Sort rounds by start date
      roundsRes.data.data.sort((a, b) => {
        return new Date(a.start_date) - new Date(b.start_date);
      });

      setRounds(roundsRes.data.data || []);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        setError("Failed to load rounds. Please try again.");
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

  // CALCULATE MIN START DATE FOR ROUND CREATION
  const calculateMinStartDate = () => {
    const today = new Date();
    const tournamentStart = new Date(tournament?.start_date);

    const minStart = tournamentStart > today ? tournamentStart : today;

    return FormatToISODate(minStart);
  };

  // CALCULATE NEXT AVAILABLE START DATE FOR ROUND CREATION
  const getNextAvailableStartDate = () => {
    if (rounds.length === 0) return calculateMinStartDate(); // fallback

    const latestEnd = new Date(
      Math.max(...rounds.map((r) => new Date(r.end_date).getTime()))
    );
    const nextDay = new Date(latestEnd.getTime() + 86400000); // +1 day
    return FormatToISODate(nextDay);
  };

  // CALCULATE NEXT AVAILABLE START DATE FOR ROUND EDITING
  const getNextAvailableStartDateForEdit = () => {
    if (rounds.length === 0) return calculateMinStartDate(); // fallback

    // Filter out the currently edited round
    const roundsExcludingEdited = rounds.filter(
      (round) => round.round_id !== selectedRound?.round_id
    );

    // Find the latest round (the one with the maximum end date) from the remaining rounds
    const latestEnd = new Date(
      Math.max(
        ...roundsExcludingEdited.map((r) => new Date(r.end_date).getTime())
      )
    );

    // Add 1 day (86400000 milliseconds) to the latest round's end date
    const nextDay = new Date(latestEnd.getTime() + 86400000);

    return FormatToISODate(nextDay);
  };

  // CALCULATE DATE CONSTRAINTS FOR ROUND EXTENDING
  const getExtendedDateConstraints = (round, allRounds) => {
    if (!round || !Array.isArray(allRounds)) return {};

    const currentEnd = new Date(round.end_date);

    // Find the next round that starts after this one ends
    const nextRound = allRounds.find(
      (r) => new Date(r.start_date) > currentEnd
    );

    const nextStart = nextRound
      ? new Date(nextRound.start_date)
      : new Date(tournament?.end_date);

    const minStart = currentEnd;
    const maxStart = new Date(nextStart.getTime() - 86400000);
    const minEnd = new Date(minStart.getTime() + 86400000);
    const maxEnd = maxStart;

    return {
      minStart: FormatDateInput(minStart),
      maxStart: FormatDateInput(maxStart),
      minEnd: FormatDateInput(minEnd),
      maxEnd: FormatDateInput(maxEnd),
    };
  };
  const { minEnd, maxEnd } = getExtendedDateConstraints(selectedRound, rounds);

  // APPLY DEFAULT END DATE AND TEAM LIMIT IF NOT FINAL ROUND
  const applyDefaultEndDateIfNotFinal = () => {
    if (!formData?.is_last && tournament?.end_date) {
      const expectedEndDate = FormatToISODate(
        new Date(new Date(tournament?.end_date).getTime() - 86400000)
      );

      // Only update if current end_date is *not already different*
      if (FormatToISODate(formData.end_date) !== expectedEndDate) {
        setFormData((prev) => ({
          ...prev,
          end_date: expectedEndDate,
          team_limit: 2,
        }));
      }
    }
  };

  //#region MODAL CONTROL
  // DATA MANIPULATION FOR ROUND MANAGEMENT MODAL WHEN OPENED
  /**
   * Opens the round modal in create or edit mode.
   * @param {object|null} round - The round to edit. If null, creates a new one. Default value is NULL.
   */
  const handleOpenRoundManagementModal = (round = null) => {
    setRoundManagementModalShow(true);
    setSelectedRound(round);
    setFormMode(round ? "edit" : "create");

    // If Round Is Not Null Then Form Is Edit
    if (round) {
      setFormData((prev) => ({
        ...prev,
        round_id: round?.round_id || 0,
        description: round?.description || "",
        round_name: round?.round_name || "",
        round_duration: round?.round_duration || 300,
        lap_number: round?.lap_number || 1,
        finish_type: MatchFinishTypeOptions[0].value,
        team_limit: round?.team_limit || 0,
        is_last: round?.is_last,
        start_date:
          FormatDateInput(round?.start_date) ||
          FormatToISODate(new Date().getTime() + 1 * 86400000),
        end_date: FormatDateInput(round?.end_date) || "",
        environment_id: round?.environment_id || 0,
        match_type_id: round?.match_type_id || 0,
        resource_id: round?.map_id || 0,
        lap: round?.lap || 250,
        collision: round?.collision || -50,
        total_race_time: round?.total_race_time || -10,
        off_track: round?.off_track || -10,
        assist_usage: round?.assist_usage || -350,
        average_speed: round?.average_speed || 30,
        total_distance: round?.total_distance || 100,
      }));

      // Else Form Is Create
    } else {
      const nextStart = getNextAvailableStartDate();
      setFormData({
        description: "",
        round_name: "",
        round_duration: 300,
        lap_number: 1,
        finish_type: MatchFinishTypeOptions[0].value,
        team_limit: 2,
        is_last: false,
        start_date: nextStart,
        end_date: nextStart,
        tournament_id: tournamentId,
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
      });
    }
  };

  const handleCloseRoundManagementModal = () => {
    setRoundManagementModalShow(false);
    setSelectedRound(null);
    setFormData(initialFormData);
    setFormMode("create");
  };

  // EXTENDED ROUND MODAL
  const handleOpenExtendedRoundEndDateModal = (round = null) => {
    setExtendedRoundModalShow(true);
    setSelectedRound(round);

    if (round) {
      setRoundExtendedEndDate(
        FormatDateInput(
          new Date(new Date(round?.end_date).getTime() + 86400000)
        )
      );
    }
  };

  const handleCloseExtendedRoundEndDateModal = () => {
    setExtendedRoundModalShow(false);
    setSelectedRound(null);
  };
  //#endregion

  //#region USEEFFECT SCOPES
  // FETCH TOURNAMENT and ITS ROUNDS
  useEffect(() => {
    fetchTournamentRounds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        const newStart = new Date(now.getTime()); // tomorrow

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
        const newEnd = new Date(now.getTime()); // day after start date

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

  // SET END DATE FOR CREATE ROUND
  /*
  If form mode is "create", end date is not set or start date is greater 
  than end date then set end date == start date or do nothing.
  */
  useEffect(() => {
    if (formMode === "create" && formData.start_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (!formData.end_date || start > end) {
        setFormData((prev) => ({
          ...prev,
          end_date: FormatToISODate(formData.start_date),
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.start_date]);

  // SET START DATE IF END DATE IS LESS THEN START DATE
  useEffect(() => {
    if (formMode === "create" && formData.end_date) {
      const start = new Date(formData.start_date);
      const end = new Date(formData.end_date);

      if (end < start)
        setFormData((prev) => ({
          ...prev,
          start_date: FormatToISODate(formData.end_date),
        }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.end_date]);

  // SHOW WARNING IF END DATE OF ROUND EQUALS TO TOURNAMENT END DATE
  useEffect(() => {
    // Check if end date is equal to tournament end date then set warning message
    if (
      FormatDateInput(formData.end_date) ===
      FormatDateInput(new Date(tournament?.end_date))
    ) {
      setIsLastRoundWarning(
        "This round will be set to final round due to end date equals to tournament's end date."
      );
    } else {
      setIsLastRoundWarning("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.end_date]);

  // CHECK IF END DATE EQUALS TO TOURNAMENT END DATE THEN SET LAST ROUND TRUE
  useEffect(() => {
    // For create mode, if end date is equal to tournament end date then set last round true
    if (
      formMode === "create" &&
      FormatToISODate(formData.end_date) ===
        FormatToISODate(tournament?.end_date)
    ) {
      setFormData((prev) => ({
        ...prev,
        is_last:
          FormatDateInput(formData.end_date) ===
          FormatDateInput(new Date(tournament?.end_date)),
        team_limit: 0,
      }));
    } else {
      // Otherwise set last round false
      setFormData((prev) => ({
        ...prev,
        is_last: false,
        team_limit: 2,
      }));
    }

    // For edit mode, if end date is equal to tournament end date then set last round true
    if (
      formMode === "edit" &&
      FormatToISODate(formData.end_date) ===
        FormatToISODate(tournament?.end_date)
    ) {
      setFormData((prev) => ({
        ...prev,
        is_last:
          FormatDateInput(formData.end_date) ===
          FormatDateInput(new Date(tournament?.end_date)),
        team_limit: 0,
      }));
    } else {
      // Otherwise set last round false
      setFormData((prev) => ({
        ...prev,
        is_last: false,
        team_limit: 2,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.end_date]);

  // CHANGE END DATE TO THE DAY BEFORE THE TOURNAMENT END DATE
  useEffect(() => {
    applyDefaultEndDateIfNotFinal();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData?.is_last, tournament?.end_date]);
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
              disabled={hasFinalRound}
              toolTipPos="bottom"
              tooltipData="Cannot create new round after final round."
              onClick={() => handleOpenRoundManagementModal(null)}
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
        {/* If Rounds Is Empty */}
        {rounds.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col justify-center items-center p-6">
              <p
                className={`text-muted-foreground ${
                  auth?.role === "ORGANIZER" ? "mb-4" : ""
                }`}
              >
                No rounds found for this tournament.
              </p>
              {auth?.role === "ORGANIZER" && (
                <Button
                  variant="outline"
                  onClick={() => handleOpenRoundManagementModal(null)}
                  className="cursor-pointer"
                >
                  <Plus className="mr-2 w-4 h-4" /> Create First Round
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          /* If Round Is Not Empty */
          rounds.map((round) => (
            <Card
              key={round.round_id}
              className="flex flex-col hover:shadow-md h-full overflow-hidden transition-shadow"
            >
              <CardHeader className="flex flex-col justify-between bg-gray-50 p-4 pb-3 border-b h-[120px] shrink-0">
                <div className="flex justify-between items-start w-full">
                  <CardTitle className="group relative font-bold text-lg">
                    <span className="block truncate group-hover:text-clip">
                      {round.round_name || `Round ${round.round_no}`}
                    </span>
                    <span className="invisible group-hover:visible -top-8 left-0 z-50 absolute bg-black/75 px-2 py-1 rounded text-white text-sm whitespace-nowrap">
                      {round.round_name || `Round ${round.round_no}`}
                    </span>
                  </CardTitle>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Edit Button */}
                  {round.status.toString().toLowerCase() === "completed" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      tooltipData="Cannot edit completed round."
                      disabled
                      className="w-full cursor-not-allowed"
                    >
                      Edit
                    </Button>
                  ) : !isLatestRound(round.round_id) ? (
                    <Button
                      variant="outline"
                      size="sm"
                      tooltipData="Only the latest round can be edited."
                      disabled
                      className="w-full cursor-not-allowed"
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenRoundManagementModal(round)}
                      className="cursor-pointer"
                    >
                      Edit
                    </Button>
                  )}

                  {/* Extend Round Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenExtendedRoundEndDateModal(round)}
                    className="cursor-pointer"
                  >
                    Extend
                  </Button>
                </div>

                {/* Status and Is Final Round */}
                <div className="flex space-x-2 mt-auto">
                  <RoundStatusBadge status={round.status} />
                  {round.is_last && (
                    <Badge className="bg-red-500 text-white">Final Round</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4 h-[400px] overflow-y-auto">
                <div className="space-y-3">
                  {/* Round Description */}
                  {round.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {round.description}
                    </p>
                  )}

                  {/* Round Dates */}
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
                      <MapIcon className="mr-2 w-4 h-4 text-gray-500" />
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

                  {/* Environment */}
                  <div className="space-y-2 pt-2 border-t">
                    <EnvironmentDetails environmentId={round.environment_id} />
                  </div>

                  {/* Maps */}
                  <div className="space-y-2 pt-2 border-t">
                    <MapDetails resourceId={round.map_id} />
                  </div>

                  {/* Score Method */}
                  <div className="pt-2 border-t">
                    <ScoreMethodDetails
                      scoredMethodId={round.scored_method_id}
                    />
                  </div>

                  {/* Participating Teams */}
                  <div className="pt-2 border-t">
                    <ParticipatingTeams matchList={round.match_list} />
                  </div>
                </div>
              </CardContent>

              <div className="mt-auto border-t shrink-0">
                {/* View Matches */}
                <CardFooter className="p-4">
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    onClick={() => handleViewMatches(round.round_id)}
                  >
                    View Matches
                  </Button>
                </CardFooter>

                {/* View Leaderboards */}
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

        <Tooltip id="my-tooltip" style={{ borderRadius: "12px" }} />
      </div>

      {/* Round Management Modal */}
      <Modal
        size="md"
        onHide={handleCloseRoundManagementModal}
        show={roundsManagementModalShow}
      >
        <Modal.Header
          content={formMode === "create" ? "Create Round" : "Edit Round"}
        />
        <Modal.Body>
          <form
            id="roundManagementForm"
            onSubmit={handleRoundManagementFormSubmit}
            className="flex flex-col h-full"
          >
            <div className="flex-1 -mr-4 py-2 pr-4 overflow-y-auto">
              {/* Warning Message About Final Rounds If Selected Round Is Last Is False*/}
              {isLastRoundWarning && selectedRound?.is_last && (
                <div className="bg-yellow-50 mb-4 p-4 border-yellow-400 border-l-4 rounded-md text-yellow-700">
                  <p className="text-md">{isLastRoundWarning}</p>
                </div>
              )}
              <div className="gap-4 grid grid-cols-2 px-1">
                {/* Round Name */}
                <div className="space-y-2">
                  <Label htmlFor="round_name">Round Name</Label>
                  <Input
                    id="round_name"
                    name="round_name"
                    placeholder="Enter round name"
                    value={formData?.round_name || ""}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        round_name: e.target.value,
                      }));
                    }}
                    required
                  />
                  {roundManagementErrors?.round_name && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.round_name}
                    </p>
                  )}
                </div>

                {/* Qualification Spot */}
                <div
                  className="space-y-2"
                  data-tooltip-id="qualification-spot-tooltip"
                  data-tooltip-content={
                    "Cannot edit qualification spots of final round"
                  }
                  data-tooltip-place="bottom"
                >
                  <Label htmlFor="team_limit">Qualification Spots</Label>
                  <Input
                    id="team_limit"
                    name="team_limit"
                    disabled={formData?.is_last}
                    type="number"
                    value={formData?.team_limit}
                    min={0}
                    max={50}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        team_limit: e.target.value,
                      }));
                    }}
                    required
                  />
                  {roundManagementErrors?.team_limit && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.team_limit}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <div className="relative calendar-dropdown">
                    <Input
                      type="date"
                      placeholder="Choose start date"
                      value={FormatDateInput(formData.start_date) || ""}
                      min={
                        formMode === "create"
                          ? getNextAvailableStartDate()
                          : getNextAvailableStartDateForEdit()
                      }
                      max={FormatDateInput(new Date(tournament?.end_date))}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          start_date: e.target.value,
                        });
                      }}
                    />
                    {roundManagementErrors?.start_date && (
                      <p className="text-red-500 text-xs">
                        {roundManagementErrors.start_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <div className="relative calendar-dropdown">
                    <Input
                      type="date"
                      value={FormatDateInput(formData.end_date) || ""}
                      min={
                        formMode === "create"
                          ? getNextAvailableStartDate()
                          : FormatToISODate(formData.start_date)
                      }
                      max={FormatDateInput(new Date(tournament?.end_date))}
                      placeholder="Choose end date"
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          end_date: e.target.value,
                        });
                      }}
                    />
                    {roundManagementErrors?.end_date && (
                      <p className="text-red-500 text-xs">
                        {roundManagementErrors.end_date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Match Finish Type */}
                <div className="space-y-2">
                  <Label>Match Type</Label>
                  <Select
                    options={MatchFinishTypeOptions}
                    placeHolder={"Select finish type"}
                    value={formData?.finish_type}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        finish_type: e.target.value,
                      }));
                    }}
                  />
                  {roundManagementErrors?.finish_type && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.finish_type}
                    </p>
                  )}
                </div>

                {/* If Match Type Is Lap */}
                {formData?.finish_type === "TIME" ? (
                  // Round Duration
                  <div className="space-y-2">
                    <Label htmlFor="team_limit">Round Duration (seconds)</Label>
                    <Input
                      id="team_limit"
                      name="team_limit"
                      type="number"
                      value={formData?.round_duration || 0}
                      min={0}
                      max={300}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          round_duration: e.target.value,
                        }));
                      }}
                      required
                    />
                    {roundManagementErrors?.round_duration && (
                      <p className="text-red-500 text-xs">
                        {roundManagementErrors.round_duration}
                      </p>
                    )}
                  </div>
                ) : (
                  // Lap number
                  <div className="space-y-2">
                    <Label htmlFor="team_limit">Number of Laps</Label>
                    <Input
                      id="team_limit"
                      name="team_limit"
                      type="number"
                      value={formData?.lap_number || 0}
                      min={1}
                      max={3}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          lap_number: e.target.value,
                        }));
                      }}
                      required
                    />
                    {roundManagementErrors?.lap_number && (
                      <p className="text-red-500 text-xs">
                        {roundManagementErrors.lap_number}
                      </p>
                    )}
                  </div>
                )}

                {/* ------------------- Score Method Section ------------------- */}
                <div className="col-span-2">
                  <h3 className="mb-2 font-semibold text-lg">Scoring Method</h3>
                  {/* Bonus Point Container */}
                  <div className="mb-5 bonus-pointer-container">
                    <h4 className="mb-1 font-semibold text-md">Bonus Points</h4>
                    <div className="gap-4 grid grid-cols-2 px-1">
                      {/* Lap Points */}
                      <div className="space-y-2">
                        <Label htmlFor="lap">Lap Points</Label>
                        <Input
                          id="lap"
                          name="lap"
                          type="number"
                          min={0}
                          max={1000}
                          value={formData?.lap}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              lap: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>

                      {/* Average Speed Points */}
                      <div className="space-y-2">
                        <Label htmlFor="average_speed">
                          Average Speed Points
                        </Label>
                        <Input
                          id="average_speed"
                          name="average_speed"
                          type="number"
                          min={0}
                          max={1000}
                          value={formData?.average_speed}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              average_speed: e.target.value,
                            }));
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
                          min={0}
                          max={100}
                          value={formData?.total_distance}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              total_distance: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Penalty Point Container */}
                  <div className="mb-5 bonus-pointer-container">
                    <h4 className="mb-2 font-semibold text-md">
                      Penalty Points
                    </h4>
                    <div className="gap-4 grid grid-cols-2 px-1">
                      {/* Assist Usage Points */}
                      <div className="space-y-2">
                        <Label htmlFor="assistUsageCount">
                          Assist Usage Points
                        </Label>
                        <Input
                          id="assistUsageCount"
                          name="assistUsageCount"
                          type="number"
                          min={-1000}
                          max={0}
                          value={formData?.assist_usage}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              assist_usage: e.target.value,
                            }));
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
                          min={-1000}
                          max={0}
                          value={formData?.collision}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              collision: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>

                      {/* Race Time Points */}
                      <div className="space-y-2">
                        <Label htmlFor="total_race_time">
                          Race Time Points
                        </Label>
                        <Input
                          id="total_race_time"
                          name="total_race_time"
                          type="number"
                          min={-1000}
                          max={0}
                          value={formData?.total_race_time}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              total_race_time: e.target.value,
                            }));
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
                          min={-1000}
                          max={0}
                          value={formData?.off_track}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              off_track: e.target.value,
                            }));
                          }}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maps */}
                <div className="space-y-4 col-span-2">
                  <Label>Resource</Label>
                  {roundManagementErrors?.resource_id && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.resource_id}
                    </p>
                  )}
                  <div className="gap-4 grid grid-cols-3">
                    {resources?.map((resource) => (
                      <div
                        key={resource.resource_id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          formData.resource_id === resource.resource_id
                            ? "border-primary bg-primary/10"
                            : "hover:border-primary/50"
                        }`}
                        onClick={() =>
                          onResourceSelectChange(
                            "resource_id",
                            resource.resource_id
                          )
                        }
                      >
                        <h4 className="font-medium">
                          {resource.resource_name}
                        </h4>
                        <p className="text-muted-foreground text-sm">
                          {resource.resource_type}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Environments */}
                <div className="space-y-4 col-span-2">
                  <Label>Environment</Label>
                  {roundManagementErrors?.environment_id && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.environment_id}
                    </p>
                  )}
                  <div className="gap-4 grid grid-cols-3">
                    {environments?.map(
                      (env) =>
                        env.status.toString().toLowerCase() !== "inactive" && (
                          <div
                            key={env.environment_id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.environment_id === env.environment_id
                                ? "border-primary bg-primary/10"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() =>
                              onResourceSelectChange(
                                "environment_id",
                                env.environment_id
                              )
                            }
                          >
                            <h4 className="font-medium">
                              {env.environment_name}
                            </h4>
                          </div>
                        )
                    )}
                  </div>
                </div>

                {/* Match Types */}
                <div className="space-y-4 col-span-2">
                  <Label>Match Type</Label>
                  {roundManagementErrors?.match_type_id && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.match_type_id}
                    </p>
                  )}
                  <div className="gap-4 grid grid-cols-3">
                    {matchTypes?.map(
                      (type) =>
                        type.status.toString().toLowerCase() !== "inactive" && (
                          <div
                            key={type.match_type_id}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.match_type_id === type.match_type_id
                                ? "border-primary bg-primary/10"
                                : "hover:border-primary/50"
                            }`}
                            onClick={() =>
                              onResourceSelectChange(
                                "match_type_id",
                                type.match_type_id
                              )
                            }
                          >
                            <h4 className="font-medium">
                              {type.match_type_name}
                            </h4>
                            <p className="text-muted-foreground text-sm">
                              Duration: {type.match_duration}
                            </p>
                            <p className="text-muted-foreground text-sm">
                              Type: {type.finish_type}
                            </p>
                          </div>
                        )
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="Enter round description"
                    value={formData?.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                  {roundManagementErrors?.description && (
                    <p className="text-red-500 text-xs">
                      {roundManagementErrors.description}
                    </p>
                  )}
                </div>

                {/* Is Final Round */}
                <div className="flex items-center space-x-2 col-span-2">
                  <Checkbox
                    id="is_last"
                    checked={formData?.is_last}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        is_last: checked,
                        team_limit: checked ? 0 : prev.team_limit,
                        end_date: checked
                          ? FormatDateInput(new Date(tournament?.end_date))
                          : prev.end_date,
                      }))
                    }
                  />
                  <Label htmlFor="is_last">Final Round</Label>
                </div>
              </div>
            </div>
          </form>
        </Modal.Body>

        {/* Form Footer */}
        <Modal.Footer>
          <ButtonIcon
            type="button"
            onClick={handleCloseRoundManagementModal}
            content="Cancel"
          />
          <ButtonIcon
            type="submit"
            form="roundManagementForm"
            bgColor="#FFF"
            onClick={() => handleRoundManagementValidation(formData)}
            disabled={isSubmitting}
            content={
              isSubmitting ? (
                <>
                  <LoadingIndicator size="small" className="mr-2" />
                </>
              ) : formMode === "create" ? (
                "Create Round"
              ) : (
                "Save Changes"
              )
            }
          />
        </Modal.Footer>

        {/* Tooltip */}
        {formData?.is_last && (
          <Tooltip
            id="qualification-spot-tooltip"
            style={{ borderRadius: "12px" }}
          />
        )}
      </Modal>

      {/* Extend Round Modal */}
      <Modal
        size="md"
        onHide={handleCloseExtendedRoundEndDateModal}
        show={extendedRoundModalShow}
      >
        <Modal.Header content="Extend Round" />
        <Modal.Body>
          <form
            id="extendedRoundForm"
            onSubmit={handleExtendedRoundFormSubmit}
            className="space-y-4 pt-4"
          >
            {/* Tournament Name */}
            <h1 className="mb-5 text-3xl">{selectedRound?.round_name}</h1>

            <div>
              <p className="text-yellow-600 text-sm">
                Tournament occuring day will be from{" "}
                <strong>
                  {selectedRound?.start_date} -{" "}
                  {ConvertDate(roundExtendedEndDate)}
                </strong>
              </p>
            </div>

            <div className="gap-2 grid w-full">
              <Label htmlFor="end_date">Old End Date</Label>
              <Input
                type="date"
                disabled
                value={FormatDateInput(selectedRound?.end_date) || ""}
              />
            </div>

            {/* Extended End Date */}
            <div className="gap-2 grid w-full">
              <Label htmlFor="end_date">New End Date</Label>
              <Input
                type="date"
                value={FormatDateInput(roundExtendedEndDate) || ""}
                min={minEnd}
                max={maxEnd}
                onChange={(e) => {
                  setRoundExtendedEndDate(e.target.value);
                }}
              />
            </div>
          </form>
        </Modal.Body>

        {/* Form Footer */}
        <Modal.Footer>
          <ButtonIcon
            type="button"
            onClick={handleCloseExtendedRoundEndDateModal}
            content="Cancel"
          />
          <ButtonIcon
            type="submit"
            form="extendedRoundForm"
            bgColor="#FFF"
            disabled={isSubmitting}
            content={
              isSubmitting ? (
                <>
                  <LoadingIndicator size="small" className="mr-2" />
                </>
              ) : (
                "Save Changes"
              )
            }
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};
