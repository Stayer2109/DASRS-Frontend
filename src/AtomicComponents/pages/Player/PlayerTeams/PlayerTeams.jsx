import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useTeamManagement } from "../../../../hooks/useTeamManagement";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/AtomicComponents/organisms/Modal/Modal";

export const PlayerTeams = () => {
  const { teams, isLoading, createTeam } = useTeamManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", tag: "" });
  const navigate = useNavigate();

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    const newTeamId = await createTeam(formData.name, formData.tag);
    if (newTeamId) {
      // Navigate to my-team page with replace to prevent back navigation
      navigate("/my-team", { replace: true });
    }
    setIsModalOpen(false);
    setFormData({ name: "", tag: "" });
  };

  const handleViewTeam = (teamId) => {
    navigate(`/teams/${teamId}`);
  };

  const renderTeamStatusBadge = (memberCount) => {
    const isFull = memberCount === 5;
    return (
      <Badge
        variant="outline"
        className={
          isFull ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
        }
      >
        {isFull ? "Full" : "Open"}
      </Badge>
    );
  };

  return (
    <>
      {isLoading && <Spinner />}

      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Teams</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 h-10"
          >
            <Plus className="mr-2 h-5 w-5" /> Create Team
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleViewTeam(team.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{team.name}</CardTitle>
                  {renderTeamStatusBadge(team.member_count || 0)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Tag:</span>
                    <span className="font-medium bg-gray-100 px-2 py-1 rounded text-sm">
                      {team.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Members:</span>
                    <span className="font-medium">
                      {team.member_count || 0}/5
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Modal UI */}
        <Modal
          show={isModalOpen}
          onHide={() => setIsModalOpen(false)}
          size="sm"
        >
          <ModalHeader content="Create New Team" className="border-b pb-4" />
          <ModalBody className="py-6">
            <form id="createTeamForm" onSubmit={handleCreateTeam}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter team name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Team Tag
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter team tag"
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        tag: e.target.value,
                      }))
                    }
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    A short identifier for your team (e.g., "TSM", "C9")
                  </p>
                </div>
              </div>
            </form>
          </ModalBody>
          <ModalFooter className="border-t py-4 px-4 space-x-3">
            <Button
              type="submit"
              form="createTeamForm"
              className="px-4 py-2 h-10"
            >
              Create Team
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 h-10"
            >
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </>
  );
};
