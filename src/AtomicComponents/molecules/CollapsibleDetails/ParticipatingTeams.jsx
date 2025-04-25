import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import PropTypes from "prop-types";
import Toast from "../Toaster/Toaster";
import { apiClient } from "@/config/axios/axios";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { LoadingSpinner } from "@/AtomicComponents/atoms/LoadingSpinner/LoadingSpinner";

export const ParticipatingTeams = ({ matchList }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamMembers, setTeamMembers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembersModalShow, setTeamMembersModalShow] = useState(false);

  // Flatten and deduplicate teams
  const teams = [
    ...new Map(
      matchList
        ?.flatMap((match) => match.teams || [])
        .map((team) => [team.team_id, team])
    ).values(),
  ];

  // Fetch team info by ID
  const fetchTeamInformation = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        `teams/members/${selectedTeam.team_id}`
      );

      if (response.data.http_status === 200) {
        setTeamMembers(response.data.data);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message:
          err?.response?.data?.message ||
          "Failed to load team members. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenTeamInformationModal = (team) => {
    setSelectedTeam(team);
    setTeamMembersModalShow(true);
  };

  const handleCloseTeamInformationModal = () => {
    setSelectedTeam(null);
    setTeamMembersModalShow(false);
  };

  useEffect(() => {
    if (selectedTeam) fetchTeamInformation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTeam]);

  return (
    <>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm">
          <span>Participating Teams</span>
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </CollapsibleTrigger>

        <CollapsibleContent className="mt-2">
          <div className="flex flex-col gap-2 bg-white p-3 border border-gray-500 rounded-md">
            {teams.length > 0 ? (
              teams.map((team) => (
                <div
                  key={team.team_id}
                  onClick={() => handleOpenTeamInformationModal(team)}
                  className="text-gray-600 hover:text-blue-500 text-sm transition-all cursor-pointer"
                >
                  <strong>{team.team_name}</strong>{" "}
                  <span className="text-gray-400 text-xs">
                    ({team.team_tag})
                  </span>
                </div>
              ))
            ) : (
              <p className="py-2 text-gray-400 text-sm text-center">
                No teams found.
              </p>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Team Members Modal */}
      <Modal
        size="sm"
        show={teamMembersModalShow}
        onHide={handleCloseTeamInformationModal}
      >
        <Modal.Header
          content={
            selectedTeam?.team_name
              ? `Members of ${selectedTeam.team_name}`
              : "Team Members"
          }
        />
        <Modal.Body>
          <div className="flex flex-col gap-3">
            {isLoading ? (
              <p className="flex justify-center items-center text-gray-500 text-sm text-center">
                <LoadingSpinner />
              </p>
            ) : teamMembers?.length > 0 ? (
              teamMembers.map((member) => (
                <div
                  key={member?.id}
                  className="flex justify-between items-center bg-gray-50 p-2 border border-gray-100 rounded-md"
                >
                  <span
                    className={`text-sm ${
                      member?.is_leader ? "text-blue-600 font-semibold" : ""
                    }`}
                  >
                    {member?.full_name}
                  </span>
                  {member?.is_leader && (
                    <span className="font-semibold text-blue-600 text-xs">
                      Team Leader
                    </span>
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm text-center">
                No members found.
              </p>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

ParticipatingTeams.propTypes = {
  matchList: PropTypes.arrayOf(
    PropTypes.shape({
      teams: PropTypes.arrayOf(
        PropTypes.shape({
          team_id: PropTypes.number.isRequired,
          team_name: PropTypes.string.isRequired,
          team_tag: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
};
