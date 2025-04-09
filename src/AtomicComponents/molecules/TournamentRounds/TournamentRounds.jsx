import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Plus, Calendar, Map, Users, Flag } from "lucide-react";
import { apiAuth } from "@/config/axios/axios";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { toast } from "sonner";
import { RoundModal } from "@/AtomicComponents/organisms/RoundModal/RoundModal";
import { RoundStatusBadge } from "../RoundCard/RoundCard";
import { formatDateString } from "@/utils/dateUtils";
import { EnvironmentDetails } from "../CollapsibleDetails/EnvironmentDetails";
import { MapDetails } from "../CollapsibleDetails/MapDetails";
import { ScoreMethodDetails } from "../CollapsibleDetails/ScoreMethodDetails";
import useAuth from "@/hooks/useAuth";

export const TournamentRounds = () => {
  const { auth } = useAuth();
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [resources, setResources] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [matchTypes, setMatchTypes] = useState([]);
  const [formData, setFormData] = useState({
    tournament_id: tournamentId,
    round_name: "",
    description: "",
    start_date: "",
    end_date: "",
    environment_id: "",
    map_id: "",
    match_type_id: "",
    scored_method_id: "",
    team_limit: "",
    is_last: false,
    scoreMethod: {
      lap: 0,
      assistUsageCount: 0,
      collision: 0,
      total_race_time: 0,
      off_track: 0,
      average_speed: 0,
      total_distance: 0,
      match_finish_type: "LAP",
    },
  });
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const [tournamentRes, roundsRes] = await Promise.all([
          apiAuth.get(`tournaments/${tournamentId}`),
          apiAuth.get(`rounds/tournament/${tournamentId}`),
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

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoadingResources(true);
      try {
        const [resourcesRes, environmentsRes, matchTypesRes] =
          await Promise.all([
            apiAuth.get("resources/map?pageSize=100"),
            apiAuth.get("environments"),
            apiAuth.get("match-types"),
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

  const breadcrumbItems = [
    { label: "Tournaments", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: "/tournaments",
    },
    { label: "Rounds" },
  ];

  const handleCreateRound = () => {
    if (isLoadingResources) {
      toast.error("Please wait while resources are loading...");
      return;
    }
    setFormData((prev) => ({ ...prev, tournament_id: tournamentId }));
    setIsModalOpen(true);
  };

  const handleBackToTournament = () => {
    navigate("/tournaments", { replace: true });
  };

  const handleViewMatches = (roundId) => {
    navigate(`/tournaments/${tournamentId}/rounds/${roundId}/matches`);
  };

  const handleViewLeaderboard = (roundId) => {
    navigate(`${roundId}/matches`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      [field]: date ? date.toISOString().split("T")[0] : "",
    }));
  };

  const handleNumberChange = (e, section = null) => {
    const { name, value } = e.target;

    if (section === "scoreMethod") {
      setFormData((prev) => ({
        ...prev,
        scoreMethod: {
          ...prev.scoreMethod,
          [name]: Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: Number(value),
      }));
    }
  };

  const handleSelectChange = (field, value, section = null) => {
    if (section === "scoreMethod") {
      setFormData((prev) => ({
        ...prev,
        scoreMethod: {
          ...prev.scoreMethod,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "edit") {
        // Update round
        await apiAuth.put("rounds", {
          round_id: formData.round_id,
          description: formData.description,
          round_name: formData.round_name,
          team_limit: formData.team_limit,
          is_last: formData.is_last,
          start_date: formData.start_date,
          end_date: formData.end_date,
          scored_method_id: formData.scored_method_id,
          environment_id: formData.environment_id,
          match_type_id: formData.match_type_id,
          resource_id: formData.resource_id,
        });

        // Update score method
        await apiAuth.put(
          `scored-methods?scoredMethodId=${formData.scored_method_id}`,
          {
            lap: formData.scoreMethod.lap,
            assistUsageCount: formData.scoreMethod.assistUsageCount,
            collision: formData.scoreMethod.collision,
            total_race_time: formData.scoreMethod.total_race_time,
            off_track: formData.scoreMethod.off_track,
            average_speed: formData.scoreMethod.average_speed,
            total_distance: formData.scoreMethod.total_distance,
            match_finish_type: formData.scoreMethod.match_finish_type,
          }
        );

        toast.success("Round updated successfully");
      } else {
        // Create new round (existing logic)
        await apiAuth.post("rounds", formData);
        toast.success("Round created successfully");
      }

      setIsModalOpen(false);
      // Refresh rounds list
      const roundsRes = await apiAuth.get(`rounds/tournament/${tournamentId}`);
      setRounds(roundsRes.data.data || []);
    } catch (err) {
      console.error("Error saving round:", err);
      toast.error(
        formMode === "edit"
          ? "Failed to update round!\n Error:" + err.message
          : "Failed to create round!\n Error:" + err.message
      );
    }
  };

  const handleEditRound = async (round) => {
    try {
      // Format dates to match the expected format
      const startDate = new Date(round.start_date).toISOString().split("T")[0];
      const endDate = new Date(round.end_date).toISOString().split("T")[0];

      // Fetch score method data
      const scoreMethodData = await apiAuth.get(
        "scored-methods/" + round.scored_method_id
      );

      setFormData({
        round_id: round.round_id,
        tournament_id: round.tournament_id,
        round_name: round.round_name,
        description: round.description,
        start_date: startDate,
        end_date: endDate,
        environment_id: round.environment_id,
        resource_id: round.map_id, // Note: using resource_id instead of map_id
        match_type_id: round.match_type_id,
        scored_method_id: round.scored_method_id,
        team_limit: round.team_limit,
        is_last: round.is_last,
        scoreMethod: {
          lap: scoreMethodData.data.data.lap,
          assistUsageCount: scoreMethodData.data.data.assist_usage,
          collision: scoreMethodData.data.data.collision,
          total_race_time: scoreMethodData.data.data.total_race_time,
          off_track: scoreMethodData.data.data.off_track,
          average_speed: scoreMethodData.data.data.average_speed,
          total_distance: scoreMethodData.data.data.total_distance,
          match_finish_type:
            scoreMethodData.data.data.match_finish_type || "LAP",
        },
      });

      setFormMode("edit");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching score method:", error);
      toast.error("Failed to load round data!\n Error:" + error.message);
    }
  };

  const handleModalClose = (open) => {
    if (!open) {
      setFormMode("create");
      setFormData({
        tournament_id: tournamentId,
        round_name: "",
        description: "",
        start_date: "",
        end_date: "",
        environment_id: "",
        resource_id: "",
        match_type_id: "",
        scored_method_id: "",
        team_limit: "",
        is_last: false,
        scoreMethod: {
          lap: 0,
          assistUsageCount: 0,
          collision: 0,
          total_race_time: 0,
          off_track: 0,
          average_speed: 0,
          total_distance: 0,
          match_finish_type: "LAP",
        },
      });
    }
    setIsModalOpen(open);
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center gap-5">
        <h2 className="text-2xl font-bold">
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
            <Button onClick={handleCreateRound} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-2" /> Create Round
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
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
                  onClick={handleCreateRound}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" /> Create First Round
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          rounds.map((round) => (
            <Card
              key={round.round_id}
              className="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b h-[120px] flex flex-col justify-between shrink-0">
                <div className="flex justify-between items-start w-full">
                  <CardTitle className="text-lg font-bold group relative">
                    <span className="truncate block max-w-[200px] group-hover:text-clip">
                      {round.round_name || `Round ${round.round_no}`}
                    </span>
                    <span className="invisible group-hover:visible absolute -top-8 left-0 bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50">
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
                  onClick={() => handleEditRound(round)}
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
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {round.description}
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(round.start_date)}
                    </span>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(round.end_date)}
                    </span>

                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Match Type:</span>
                    </div>
                    <span className="text-right font-medium truncate">
                      {round.match_type_name}
                    </span>

                    <div className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">
                        Finish Type:
                      </span>
                    </div>
                    <span className="text-right font-medium truncate">
                      {round.finish_type}
                    </span>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
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
      {isModalOpen && !isLoadingResources && (
        <RoundModal
          isOpen={isModalOpen}
          onOpenChange={handleModalClose}
          formData={formData}
          formMode={formMode}
          isSubmitting={false}
          onInputChange={handleInputChange}
          onDateChange={handleDateChange}
          onNumberChange={handleNumberChange}
          onSelectChange={handleSelectChange}
          onSubmit={handleFormSubmit}
          resources={resources}
          environments={environments}
          matchTypes={matchTypes}
        />
      )}
    </div>
  );
};
