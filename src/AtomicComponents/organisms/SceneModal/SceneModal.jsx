import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { SceneForm } from "@/AtomicComponents/molecules/SceneForm/SceneForm";

export const SceneModal = ({
  isOpen,
  onOpenChange,
  formData,
  formMode,
  isSubmitting,
  onInputChange,
  onTypeChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create New Scene" : "Edit Scene"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "create"
              ? "Add a new scene to your collection."
              : "Update the details of the selected scene."}
          </DialogDescription>
        </DialogHeader>

        <SceneForm
          formData={formData}
          formMode={formMode}
          isSubmitting={isSubmitting}
          onInputChange={onInputChange}
          onTypeChange={onTypeChange}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
