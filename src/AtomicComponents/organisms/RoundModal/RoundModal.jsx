import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { RoundForm } from "@/AtomicComponents/molecules/RoundForm/RoundForm";
import PropTypes from "prop-types";

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
      <DialogContent className="flex flex-col p-0 sm:max-w-[700px] h-[90vh]">
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

        <div className="flex-1 px-5 overflow-hidden">
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

RoundModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onOpenChange: PropTypes.func.isRequired,
  formData: PropTypes.object.isRequired,
  formMode: PropTypes.string.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNumberChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  resources: PropTypes.array.isRequired,
  environments: PropTypes.array.isRequired,
  matchTypes: PropTypes.array.isRequired,
};
