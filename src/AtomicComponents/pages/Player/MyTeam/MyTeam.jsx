import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import useRefreshToken from "@/hooks/useRefreshToken";
import { Crown, Trash2, UserCog } from "lucide-react";
import { toast } from "react-hot-toast";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";

export const MyTeam = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  const refresh = useRefreshToken();
  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLeader, setIsLeader] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [leadershipDialogOpen, setLeadershipDialogOpen] = useState(false);
  const [newLeader, setNewLeader] = useState(null);
  const [leaveTeamDialogOpen, setLeaveTeamDialogOpen] = useState(false);
  const [deleteTeamDialogOpen, setDeleteTeamDialogOpen] = useState(false);

  const fetchTeamData = async () => {
    // Use either the auth teamId or the one from navigation state
    const teamIdToUse = location.state?.newTeamId || auth?.teamId;

    if (!teamIdToUse) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const [teamResponse, membersResponse] = await Promise.all([
        apiClient.get(`teams/${auth.teamId}`),
        apiClient.get(`teams/members/${auth.teamId}`),
      ]);

      setTeam(teamResponse.data.data);
      setMembers(membersResponse.data.data || []);

      // Check if current user is leader
      const currentUserMember = membersResponse.data.data?.find(
        (member) => member.id === auth.id
      );
      setIsLeader(currentUserMember?.is_leader || false);
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast.error("Failed to fetch team data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Always fetch team data when component mounts
    fetchTeamData();
  }, []); // Empty dependency array to run only on mount

  useEffect(() => {
    // Also fetch when teamId changes
    if (auth?.teamId) {
      fetchTeamData();
    }
  }, [auth?.teamId]);

  const handleRemoveMemberClick = (member) => {
    setMemberToRemove(member);
    setConfirmDialogOpen(true);
  };

  const handleRemoveMember = async () => {
    if (!isLeader || !memberToRemove) return;

    try {
      await apiClient.delete(`teams/remove-members`, {
        params: {
          teamId: auth.teamId,
          memberId: memberToRemove.id,
        },
      });

      toast.success("Member removed successfully");
      setConfirmDialogOpen(false);
      setMemberToRemove(null);
      fetchTeamData(); // Refresh the team data
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    }
  };

  const handleChangeLeaderClick = (member) => {
    setNewLeader(member);
    setLeadershipDialogOpen(true);
  };

  const handleChangeLeader = async () => {
    if (!isLeader || !newLeader) return;

    try {
      await apiClient.put(`teams/leadership/${auth.teamId}/${newLeader.id}`);

      toast.success("Team leadership transferred successfully");
      setLeadershipDialogOpen(false);
      setNewLeader(null);
      fetchTeamData(); // Refresh the team data
    } catch (error) {
      console.error("Error changing team leader:", error);
      toast.error("Failed to transfer team leadership");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      // First leave the team
      await apiClient.delete(`teams/${auth.teamId}/leave`, {
        params: {
          playerId: auth.id,
        },
      });

      // Then refresh the tokens to get updated user data
      await refresh();

      toast.success("Successfully left the team");
      setLeaveTeamDialogOpen(false);

      // Reset local team-related states
      setTeam(null);
      setMembers([]);
      setIsLeader(false);

      // Update auth context to remove teamId
      setAuth((prev) => ({
        ...prev,
        teamId: null,
        isLeader: false,
      }));

      // Navigate to teams page
      navigate("/teams", { replace: true });
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");

      if (error.response?.status === 401) {
        toast.error("Session expired. Please log in again.");
      }
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await apiClient.delete(`teams/delete-team/${auth.teamId}`, {
        params: {
          leaderId: auth.id,
        },
      });

      // Refresh token to get updated user data
      await refresh();

      toast.success("Team deleted successfully");

      // Reset local team-related states
      setTeam(null);
      setMembers([]);
      setIsLeader(false);

      // Update auth context to remove teamId
      setAuth((prev) => ({
        ...prev,
        teamId: null,
        isLeader: false,
      }));

      // Navigate to teams page
      navigate("/teams", { replace: true });
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    }
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

  if (isLoading) return <Spinner />;
  if (!auth?.teamId)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You are not part of any team</p>
      </div>
    );
  if (!team)
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">You are not part of any team</p>
      </div>
    );

  return (
    <>
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-2xl">{team.name}</CardTitle>
                <span className="text-gray-500">Tag: {team.tag}</span>
              </div>
              <div className="flex gap-2 items-center">
                {renderTeamStatusBadge(team.member_count)}
                {team.status && (
                  <Badge
                    variant={
                      team.status === "ACTIVE" ? "success" : "destructive"
                    }
                  >
                    {team.status}
                  </Badge>
                )}
                {!isLeader && ( // Only show leave button for non-leaders
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setLeaveTeamDialogOpen(true)}
                  >
                    Leave Team
                  </Button>
                )}
                {isLeader && team.member_count === 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setDeleteTeamDialogOpen(true)}
                  >
                    Delete Team
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Team Members ({team.member_count}/5)
                </h3>
                <div className="space-y-2">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                        member.is_leader
                          ? "bg-yellow-50 hover:bg-yellow-100 border border-yellow-200"
                          : "bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {member.is_leader && (
                          <Crown className="h-5 w-5 text-yellow-500" />
                        )}
                        <div>
                          <p className="font-medium">{member.full_name}</p>
                          <p className="text-sm text-gray-500">
                            {member.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {member.is_leader ? "Leader" : "Member"}
                        </Badge>
                        {isLeader && !member.is_leader && (
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                              onClick={() => handleChangeLeaderClick(member)}
                              title="Transfer Leadership"
                            >
                              <UserCog className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-100"
                              onClick={() => handleRemoveMemberClick(member)}
                              title="Remove Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove Member Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Team Member</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to remove{" "}
            <span className="font-medium">{memberToRemove?.full_name}</span>{" "}
            from the team?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRemoveMember}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Change Leader Dialog */}
      <Dialog
        open={leadershipDialogOpen}
        onOpenChange={setLeadershipDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Team Leadership</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to transfer team leadership to{" "}
            <span className="font-medium">{newLeader?.full_name}</span>?
          </p>
          <p className="text-sm text-gray-500">
            You will become a regular team member after this action.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLeadershipDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleChangeLeader}>
              Transfer Leadership
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Leave Team Dialog */}
      <Dialog open={leaveTeamDialogOpen} onOpenChange={setLeaveTeamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave Team</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to leave team{" "}
            <span className="font-medium">{team?.name}</span>?
          </p>
          <p className="text-sm text-red-500">
            This action cannot be undone. You will need to be invited back to
            rejoin the team.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLeaveTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleLeaveTeam}>
              Leave Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Team Dialog */}
      <Dialog
        open={deleteTeamDialogOpen}
        onOpenChange={setDeleteTeamDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Team</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete this team? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTeamDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTeam}>
              Delete Team
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyTeam;
