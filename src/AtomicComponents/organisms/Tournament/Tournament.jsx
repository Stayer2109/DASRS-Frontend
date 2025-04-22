import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TournamentHeader } from "@/AtomicComponents/organisms/TournamentHeader/TournamentHeader";
import { TournamentTable } from "@/AtomicComponents/organisms/TournamentTable/TournamentTable";
import { Pagination } from "@/AtomicComponents/molecules/Pagination/Pagination";
import { TournamentModal } from "@/AtomicComponents/organisms/TournamentModal/TournamentModal";
import { TournamentNavCards } from "@/AtomicComponents/molecules/TournamentNavCards/TournamentNavCards";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { useTournament } from "@/hooks/useTournament";

export const Tournament = () => {
  const location = useLocation();

  const {
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
  } = useTournament();

  // Add state for selected tournament and navigation cards
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Handle tournament name click
  const handleTournamentNameClick = (tournament) => {
    setSelectedTournament(tournament);
  };

  // Close navigation cards
  const handleCloseNavCards = () => {
    setSelectedTournament(null);
  };

  // Breadcrumb items - using your existing pattern
  const breadcrumbItems = [
    { label: "Tournament", href: "/tournaments" },
    ...(selectedTournament
      ? [{ label: selectedTournament.tournament_name }]
      : []),
  ];

  // Force refresh when navigating directly to /tournaments
  useEffect(() => {
    if (location.pathname === "/tournaments") {
      console.log("Direct navigation to tournaments page detected");
      // Force a refresh of tournament data
      refetchTournaments();
    }
  }, [location.pathname]);

  // Add this function to your useTournament hook or implement here
  const refetchTournaments = () => {
    // Call your API to fetch tournaments again
    // This could be a function from your hook or a direct API call
    console.log("Refreshing tournament data");
    // Implementation depends on your data fetching logic
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="rounded-md border">
        <TournamentTable
          tournaments={tournaments}
          isLoading={isLoading}
          editStatus={editStatus}
          onStatusChange={handleStatusChange}
          onUpdateStatus={updateTournamentStatus}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onChangeStatusFromDropdown={handleChangeStatusFromDropdown}
          formatDate={formatDate}
          onTournamentNameClick={handleTournamentNameClick}
        />
      </div>

      {!isLoading && tournaments.length > 0 && (
        <Pagination
          currentPage={pagination.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <TournamentModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        formData={formData}
        formMode={formMode}
        isSubmitting={isFormSubmitting}
        onInputChange={handleInputChange}
        onDateChange={handleDateChange}
        onNumberChange={handleNumberChange}
        onSubmit={handleFormSubmit}
      />

      {/* Tournament navigation cards */}
      {selectedTournament && (
        <TournamentNavCards
          tournamentId={selectedTournament.tournament_id}
          tournamentName={selectedTournament.tournament_name}
          onClose={handleCloseNavCards}
        />
      )}
    </div>
  );
};
