import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/AtomicComponents/atoms/shadcn/dialog";
import { TournamentForm } from "@/AtomicComponents/molecules/TournamentForm/TournamentForm";

export const TournamentModal = ({
  isOpen,
  onOpenChange,
  formData,
  formMode,
  isSubmitting,
  onInputChange,
  onDateChange,
  onNumberChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create New Tournament" : "Edit Tournament"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "create"
              ? "Add a new tournament to the system."
              : "Update the details of the selected tournament."}
          </DialogDescription>
        </DialogHeader>

        <TournamentForm
          formData={formData}
          formMode={formMode}
          isSubmitting={isSubmitting}
          onInputChange={onInputChange}
          onDateChange={onDateChange}
          onNumberChange={onNumberChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};