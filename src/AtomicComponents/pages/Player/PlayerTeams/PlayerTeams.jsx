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
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create Team
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

        {/* Create Team Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-96">
              <h2 className="text-xl font-bold mb-4">Create New Team</h2>
              <form onSubmit={handleCreateTeam}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Team Name
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
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
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Team Tag
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded p-2"
                      value={formData.tag}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tag: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};


