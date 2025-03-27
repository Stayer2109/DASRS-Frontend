import React from "react";
import { TournamentHeader } from "@/AtomicComponents/organisms/TournamentHeader/TournamentHeader";
import { TournamentTable } from "@/AtomicComponents/organisms/TournamentTable/TournamentTable";
import { Pagination } from "@/AtomicComponents/molecules/Pagination/Pagination";
import { TournamentModal } from "@/AtomicComponents/organisms/TournamentModal/TournamentModal";
import { useTournament } from "@/hooks/useTournament";

export const Tournament = () => {
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

  return (
    <div className="space-y-6">
      <TournamentHeader onNewTournament={handleNewTournament} />

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
    </div>
  );
};
