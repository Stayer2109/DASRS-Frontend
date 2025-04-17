import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import useAuth from "./useAuth";
import { apiClient } from "@/config/axios/axios";
import useRefreshToken from "./useRefreshToken";

export const useTeamManagement = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const refresh = useRefreshToken();

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("teams");
      setTeams(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch teams");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (teamName, teamTag) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post(
        `teams/create?playerId=${auth.id}&teamName=${teamName}&teamTag=${teamTag}`
      );

      // Refresh token to get updated user data with new team info
      await refresh();

      // Get the new team ID from the response
      const newTeamId = response.data?.data?.id;

      toast.success("Team created successfully");

      // Go to page my team use windows
      window.location.href = `/my-team`;

      // Return the new team ID
      return newTeamId;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create team");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamDetails = async (teamId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`teams/${teamId}`);
      return response.data.data;
    } catch (err) {
      toast.error("Failed to fetch team details");
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return {
    teams,
    isLoading,
    error,
    createTeam,
    getTeamDetails,
    refreshTeams: fetchTeams,
  };
};
