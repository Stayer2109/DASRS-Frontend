import React, { useEffect, useState } from "react";
import { apiAuth } from "@/config/axios/axios";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Plus, Users, Shield, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const TournamentTeams = ({ tournamentId }) => {
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("TournamentTeams rendering with ID:", tournamentId);

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) {
        console.error("No tournament ID provided");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch tournament information
        const tournamentResponse = await apiAuth.get(
          `tournaments/${tournamentId}`
        );
        setTournament(tournamentResponse.data.data);

        const teamsResponse = await apiAuth.get(
          `tournaments/teams/${tournamentId}`
        );

        // Fetch teams list - this could be part of the tournament data
        setTeams(teamsResponse.data?.data || []);
      } catch (err) {
        console.error("Error fetching tournament teams:", err);
        setError("Failed to load teams. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Tournament", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/tournaments`,
    },
    { label: "Teams" },
  ];

  const handleAddTeam = () => {
    // Implement team creation/assignment functionality
    console.log("Add team to tournament:", tournamentId);
  };

  const handleBackToTournament = () => {
    navigate("/tournaments");
  };

  // Status badge renderer
  const renderStatusBadge = (status) => {
    const statusConfig = {
      ACTIVE: { color: "bg-green-100 text-green-800", label: "Active" },
      INACTIVE: { color: "bg-gray-100 text-gray-800", label: "Inactive" },
      PENDING: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      REJECTED: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status] || statusConfig.PENDING;

    return (
      <Badge variant="outline" className={("font-medium", config.color)}>
        {config.label}
      </Badge>
    );
  };

  // Disqualified badge
  const renderDisqualifiedBadge = (isDisqualified) => {
    if (!isDisqualified) return null;

    return (
      <Badge
        variant="outline"
        className="bg-red-100 text-red-800 ml-2 font-medium"
      >
        <AlertTriangle className="h-3 w-3 mr-1" /> Disqualified
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {tournament?.tournament_name} - Teams
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleBackToTournament}>
            Back to Tournaments
          </Button>
          <Button onClick={handleAddTeam}>
            <Plus className="h-4 w-4 mr-2" /> Add Team
          </Button>
        </div>
      </div>

      {error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      ) : teams.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-md">
          <p className="text-muted-foreground mb-4">
            No teams have been added to this tournament yet.
          </p>
          <Button variant="outline" onClick={handleAddTeam}>
            <Plus className="h-4 w-4 mr-2" /> Add First Team
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">
                    {team.name}
                  </CardTitle>
                  <div>
                    {renderStatusBadge(team.status)}
                    {renderDisqualifiedBadge(team.disqualified)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-3">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Team Tag</span>
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded">
                      {team.tag}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" className="w-full">
                      <Users className="h-4 w-4 mr-2" /> View Players
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-2">
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
