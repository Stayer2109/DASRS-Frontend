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
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import useAuth from "@/hooks/useAuth";

export const PlayerTeams = () => {
  const { auth } = useAuth();
  const { teams, isLoading, createTeam } = useTeamManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", tag: "" });
  const navigate = useNavigate();
  const role = auth?.role?.toString().toLowerCase();

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
    navigate(`${role}/teams/${teamId}`);
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

      <div className="mx-auto p-4 container">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-bold text-2xl">List Of Teams</h1>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 h-10"
          >
            <Plus className="mr-2 w-5 h-5" /> Create Team
          </Button>
        </div>

        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Tag:</span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium text-sm">
                      {team.tag}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Members:</span>
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
          <Modal.Header content="Create New Team" className="pb-4 border-b" />
          <Modal.Body className="py-6">
            <form id="createTeamForm" onSubmit={handleCreateTeam}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="font-semibold text-gray-700 text-sm">
                    Team Name
                  </label>
                  <input
                    type="text"
                    className="shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
                  <label className="font-semibold text-gray-700 text-sm">
                    Team Tag
                  </label>
                  <input
                    type="text"
                    className="shadow-sm px-3 py-2 border border-gray-300 focus:border-blue-500 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
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
                  <p className="mt-1 text-gray-500 text-sm">
                    A short identifier for your team (e.g., "TSM", "C9")
                  </p>
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer className="space-x-3 px-4 py-4 border-t">
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
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
