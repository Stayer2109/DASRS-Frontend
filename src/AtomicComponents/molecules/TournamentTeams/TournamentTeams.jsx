import React, { useEffect, useState } from "react";
import apiClient, { apiAuth } from "@/config/axios/axios";
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
import { Users, Shield, AlertTriangle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

export const TournamentTeams = () => {
  const { tournamentId } = useParams();
  const { auth } = useAuth();
  const [tournament, setTournament] = useState(null);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const navigate = useNavigate();
  const role = auth?.role?.toString().toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) {
        console.error("No tournament ID provided");
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

        const teamsResponse = await apiClient.get(
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
    { label: "Tournament", href: `/${role}/tournaments` },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/${role}/tournaments`,
    },
    { label: "Teams" },
  ];

  const handleBackToTournament = () => {
    navigate(`/${role}/tournaments`);
  };

  const handleViewPlayers = (team) => {
    setSelectedTeam(team);
    setShowMembersModal(true);
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
        className="bg-red-100 ml-2 font-medium text-red-800"
      >
        <AlertTriangle className="mr-1 w-3 h-3" /> Disqualified
      </Badge>
    );
  };

  const renderMembersList = () => {
    if (!selectedTeam) return null;

    return (
      <div className="space-y-3">
        {selectedTeam.team_members.map((member) => (
          <div
            key={member.account_id}
            className="space-y-1 bg-gray-50 p-3 rounded-lg"
          >
            <div className="font-medium">
              {member.first_name} {member.last_name}
            </div>
            <div className="flex flex-col gap-1 text-gray-500 text-sm">
              <div>Email: {member.email}</div>
              <div>Phone: {member.phone}</div>
              <div>Gender: {member.gender || "Not specified"}</div>
              <div>DOB: {new Date(member.dob).toLocaleDateString()}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center gap-5">
          <h2 className="font-bold text-2xl">
            {tournament?.tournament_name} - Teams
          </h2>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleBackToTournament}
              className="cursor-pointer"
            >
              Back to Tournaments
            </Button>
          </div>
        </div>

        {error ? (
          <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        ) : teams.length === 0 ? (
          <div className="bg-gray-50 py-8 rounded-md text-center">
            <p className="mb-4 text-muted-foreground">
              No teams have been added to this tournament yet.
            </p>
          </div>
        ) : (
          <div className="gap-6 grid md:grid-cols-2 lg:grid-cols-3">
            {teams.map((team) => (
              <Card
                key={team.id}
                className="hover:shadow-md overflow-hidden transition-shadow"
              >
                <CardHeader className="bg-gray-50 p-4 pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-bold text-lg">
                      {team.team_name}
                    </CardTitle>
                    <div>
                      {renderStatusBadge(team.status)}
                      {renderDisqualifiedBadge(team.disqualified)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-3">
                  <div className="flex flex-col space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Team Counts</span>
                      <span className="px-2 py-1 font-medium">
                        {team.team_members.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Team Tag</span>
                      <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                        {team.team_tag}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full cursor-pointer"
                        onClick={() => handleViewPlayers(team)}
                      >
                        <Users className="mr-2 w-4 h-4" /> View Players
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Members Modal */}
      <Modal
        show={showMembersModal}
        onHide={() => setShowMembersModal(false)}
        size="md"
      >
        <Modal.Header
          content={`${selectedTeam?.team_name || "Team"} Members (${
            selectedTeam?.team_members?.length || 0
          })`}
          className="pb-4 border-b"
        />
        <Modal.Body className="py-4">{renderMembersList()}</Modal.Body>
        <Modal.Footer className="pt-4 border-t">
          <Button variant="outline" onClick={() => setShowMembersModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
