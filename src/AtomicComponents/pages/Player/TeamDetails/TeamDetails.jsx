import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Crown, UserPlus } from "lucide-react";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";

export const TeamDetails = () => {
  const { teamId } = useParams();
  const { auth, setAuth } = useAuth();
  const refresh = useRefreshToken();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const navigate = useNavigate();
  const role = auth?.role?.toString().toLowerCase();

  const fetchTeamData = async () => {
    try {
      setIsLoading(true);
      const [teamResponse, membersResponse] = await Promise.all([
        apiClient.get(`teams/${teamId}`),
        apiClient.get(`teams/members/${teamId}`)
      ]);

      setTeam(teamResponse.data.data);
      setMembers(membersResponse.data.data || []);
    } catch (error) {
      console.error("Error fetching team data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinTeamClick = () => {
    setShowJoinConfirm(true);
  };

  const handleJoinTeam = async () => {
    try {
      setIsJoining(true);
      
      // Call join team API with the correct endpoint format
      await apiClient.post(`teams/${teamId}/join?playerId=${auth.id}`, '');

      // Refresh token to get updated user data
      await refresh();

      toast.success("Successfully joined the team");
      
      // Refresh team data
      await fetchTeamData();

      // Update auth context
      setAuth(prev => ({
        ...prev,
        teamId: teamId,
        isLeader: false
      }));

      // Close the confirmation dialog
      setShowJoinConfirm(false);

      // Navigate to my team page
      navigate(`/${role}/my-team`, { replace: true });
    } catch (error) {
      console.error("Error joining team:", error);
      toast.error(error.response?.data?.message || "Failed to join team");
    } finally {
      setIsJoining(false);
    }
  };

  const canJoinTeam = () => {
    return (
      !auth?.teamId && // User is not in a team
      team?.member_count < 5 && // Team is not full
      team?.status === "ACTIVE" && // Team is active
      !team?.disqualified // Team is not disqualified
    );
  };

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  const renderTeamStatusBadge = (memberCount) => {
    const isFull = memberCount === 5;
    return (
      <Badge 
        variant="outline" 
        className={isFull ? 
          "bg-red-100 text-red-800" : 
          "bg-green-100 text-green-800"
        }
      >
        {isFull ? 'Full' : 'Open'}
      </Badge>
    );
  };

  if (isLoading) return <Spinner />;
  if (!team) return <div>Team not found</div>;

  return (
    <>
      <div className="mx-auto p-4 container">
        <Button
          variant="outline"
          onClick={() => navigate(`/${role}/teams`)}
          className="mb-4"
        >
          Back to Teams
        </Button>

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <span className="text-gray-500">Tag: {team.tag}</span>
              </div>
              <div className="flex items-center gap-2">
                {renderTeamStatusBadge(team.member_count)}
                {team.status && (
                  <Badge variant={team.status === "ACTIVE" ? "success" : "destructive"}>
                    {team.status}
                  </Badge>
                )}
                {team.disqualified && (
                  <Badge variant="destructive">Disqualified</Badge>
                )}
                {canJoinTeam() && (
                  <Button 
                    onClick={handleJoinTeamClick}
                    disabled={isJoining}
                    className="ml-2"
                  >
                    <UserPlus className="mr-2 w-4 h-4" />
                    {isJoining ? "Joining..." : "Join Team"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold text-lg">Team Members ({team.member_count}/5)</h3>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        member.is_leader 
                          ? 'bg-yellow-50 hover:bg-yellow-100 border border-yellow-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {member.is_leader && (
                          <Crown className="w-5 h-5 text-yellow-500" />
                        )}
                        <span className={`font-medium ${member.is_leader ? 'text-yellow-700' : ''}`}>
                          {member.full_name}
                        </span>
                      </div>
                      {member.is_leader && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                          Team Leader
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Join Team Confirmation Dialog */}
      <Dialog open={showJoinConfirm} onOpenChange={setShowJoinConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Team</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to join team{" "}
              <span className="font-semibold">{team?.name}</span>?
            </p>
            <p className="mt-2 text-gray-500 text-sm">
              You can only be a member of one team at a time.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowJoinConfirm(false)}
              disabled={isJoining}
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinTeam}
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};





