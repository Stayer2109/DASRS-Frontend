import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { RoundForm } from "@/AtomicComponents/molecules/RoundForm/RoundForm";

export const RoundModal = ({
  isOpen,
  onOpenChange,
  formData,
  formMode,
  isSubmitting,
  onInputChange,
  onDateChange,
  onNumberChange,
  onSelectChange,
  onSubmit,
  resources,
  environments,
  matchTypes,
}) => {
  // Add validation for required props
  if (!resources || !environments || !matchTypes) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>
            {formMode === "edit" ? "Edit Round" : "Create New Round"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "edit" 
              ? "Update the round details and scoring rules."
              : "Add a new round to the tournament with scoring rules."}
          </DialogDescription>
        </DialogHeader>

        <div className="px-6 flex-1 overflow-hidden">
          <RoundForm
            formData={formData}
            formMode={formMode}
            isSubmitting={isSubmitting}
            onInputChange={onInputChange}
            onDateChange={onDateChange}
            onNumberChange={onNumberChange}
            onSelectChange={onSelectChange}
            onSubmit={onSubmit}
            onCancel={() => onOpenChange(false)}
            resources={resources}
            environments={environments}
            matchTypes={matchTypes}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};



