import { useState, useEffect } from "react";
import { apiClient } from "@/config/axios/axios";
import { toast } from "sonner";

export const useTournament = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [editStatus, setEditStatus] = useState({
    tournamentId: null,
    status: "",
    isSubmitting: false,
  });

  // State for the modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    tournament_id: null,
    tournament_name: "",
    tournament_context: "",
    team_number: 2,
    start_date: null,
    end_date: null,
  });
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // Fetch tournaments from API
  const fetchTournaments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(
        `tournaments?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=SORT_BY_ID_ASC&status=ALL`
      );

      // Extract tournament data from response
      const tournamentsData = response.data.data?.content || [];
      setTournaments(tournamentsData);

      // Update pagination info
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data?.total_pages || 0,
        totalElements: response.data.data?.total_elements || 0,
      }));
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setError("Failed to load tournaments. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or pagination changes
  useEffect(() => {
    fetchTournaments();
  }, [pagination.pageNo, pagination.pageSize]);

  const handleStatusChange = (tournamentId, status) => {
    setEditStatus({
      tournamentId,
      status,
      isSubmitting: false,
    });
  };

  const updateTournamentStatus = async () => {
    const { tournamentId, status } = editStatus;

    if (!tournamentId || !status) {
      toast("Error", {
        description: "Tournament ID and status are required.",
      });
      return;
    }

    try {
      setEditStatus((prev) => ({ ...prev, isSubmitting: true }));

      // Special handling for ACTIVE status which uses a different endpoint
      if (status === "ACTIVE") {
        // Call the active endpoint instead of the status endpoint
        await apiClient.put(`tournaments/active/${tournamentId}`);
      } else {
        // Use the regular status endpoint for other statuses
        await apiClient.put(
          `tournaments/status/${tournamentId}?status=${status}`
        );
      }

      // Update the local state to reflect the change
      setTournaments((prevTournaments) =>
        prevTournaments.map((tournament) =>
          tournament.tournament_id === tournamentId
            ? { ...tournament, status }
            : tournament
        )
      );

      // Show success message
      toast("Status updated", {
        description: "Tournament status has been successfully updated.",
      });

      // Reset edit status
      setEditStatus({
        tournamentId: null,
        status: "",
        isSubmitting: false,
      });
    } catch (err) {
      console.error("Error updating tournament status:", err);

      // Handle the error properly by displaying the message from the API
      let errorMessage =
        "Failed to update tournament status. Please try again.";
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setEditStatus((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Handle edit tournament
  const handleEdit = (tournamentId) => {
    const tournamentToEdit = tournaments.find(
      (tournament) => tournament.tournament_id === tournamentId
    );

    if (tournamentToEdit) {
      setFormMode("edit");
      setFormData({
        tournament_id: tournamentToEdit.tournament_id,
        tournament_name: tournamentToEdit.tournament_name || "",
        tournament_context: tournamentToEdit.tournament_context || "",
        team_number: tournamentToEdit.team_number || 2,
        start_date: tournamentToEdit.start_date
          ? new Date(tournamentToEdit.start_date)
          : null,
        end_date: tournamentToEdit.end_date
          ? new Date(tournamentToEdit.end_date)
          : null,
      });
      setIsModalOpen(true);
    }
  };

  // Handle delete tournament
  const handleDelete = async (tournamentId) => {
    if (!window.confirm("Are you sure you want to delete this tournament?")) {
      return;
    }

    try {
      // Call delete API
      await apiClient.delete(`tournaments/${tournamentId}`);

      // Update local state
      setTournaments((prev) =>
        prev.filter((t) => t.tournament_id !== tournamentId)
      );

      toast("Tournament deleted", {
        description: "The tournament has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting tournament:", err);
      toast("Error", {
        description: "Failed to delete tournament. Please try again.",
      });
    }
  };

  // Handle change status from dropdown
  const handleChangeStatusFromDropdown = (tournamentId, status) => {
    const updateStatus = async () => {
      try {
        setIsLoading(true);

        // Special handling for ACTIVE status
        if (status === "ACTIVE") {
          // Call the active endpoint instead
          await apiClient.put(`tournaments/active/${tournamentId}`);
        } else {
          // Use the regular status endpoint for other statuses
          await apiClient.put(
            `tournaments/status/${tournamentId}?status=${status}`
          );
        }

        setTournaments((prevTournaments) =>
          prevTournaments.map((tournament) =>
            tournament.tournament_id === tournamentId
              ? { ...tournament, status }
              : tournament
          )
        );

        toast("Status updated", {
          description: "Tournament status has been successfully updated.",
        });
      } catch (err) {
        console.error("Error updating status:", err);

        let errorMessage =
          "Failed to update tournament status. Please try again.";
        if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }

        toast("Error", {
          description: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    };

    updateStatus();
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({
      ...prev,
      pageNo: newPage,
    }));
  };

  // Format date to display in a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (err) {
      return dateString;
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle number input changes
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseInt(value, 10),
    }));
  };

  // Handle date changes
  const handleDateChange = (fieldName, date) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: date,
    }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsFormSubmitting(true);

    try {
      // Format the dates for API
      const payload = {
        tournament_name: formData.tournament_name,
        tournament_context: formData.tournament_context || "",
        team_number: formData.team_number || 2,
        start_date: formData.start_date
          ? formData.start_date.toISOString()
          : null,
        end_date: formData.end_date ? formData.end_date.toISOString() : null,
      };

      if (formMode === "edit") {
        // Edit existing tournament
        await apiClient.put(
          `tournaments/context/${formData.tournament_id}`,
          payload
        );

        toast("Tournament updated", {
          description: "Tournament details have been successfully updated.",
        });
      } else {
        // Create new tournament (implement this as needed)
        await apiClient.post("tournaments", payload);

        toast("Tournament created", {
          description: "New tournament has been successfully created.",
        });
      }

      // Refresh the tournament list
      await fetchTournaments();

      // Close the modal and reset form
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving tournament:", err);

      let errorMessage = `Failed to ${
        formMode === "create" ? "create" : "update"
      } tournament. Please try again.`;
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }

      toast("Error", {
        description: errorMessage,
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      tournament_id: null,
      tournament_name: "",
      tournament_context: "",
      team_number: 2,
      start_date: null,
      end_date: null,
    });
  };

  // Handle new tournament button click
  const handleNewTournament = () => {
    setFormMode("create");
    resetForm();
    setIsModalOpen(true);
  };

  return {
    tournaments,
    isLoading,
    error,
    pagination,
    editStatus,
    handleStatusChange,
    updateTournamentStatus,
    handleEdit,
    handleDelete,
    handleChangeStatusFromDropdown,
    handlePageChange,
    formatDate,
    // New items for the edit functionality
    isModalOpen,
    setIsModalOpen,
    formMode,
    formData,
    isFormSubmitting,
    handleInputChange,
    handleDateChange,
    handleNumberChange,
    handleFormSubmit,
    handleNewTournament,
  };
};
