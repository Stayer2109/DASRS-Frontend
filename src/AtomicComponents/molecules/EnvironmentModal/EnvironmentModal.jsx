import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";

export const EnvironmentModal = ({
  isOpen,
  onClose,
  formMode,
  formData,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formValues = new FormData(e.target);
    onSubmit({
      environment_name: formValues.get("environment_name"),
      friction: parseFloat(formValues.get("friction")),
      visibility: parseFloat(formValues.get("visibility")),
      brake_efficiency: parseFloat(formValues.get("brake_efficiency")),
      slip_angle: parseFloat(formValues.get("slip_angle")),
      reaction_delay: parseFloat(formValues.get("reaction_delay")),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create Environment" : "Edit Environment"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "create"
              ? "Add a new environment to your system."
              : "Make changes to your environment here."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="environment_name">Environment Name</Label>
            <Input
              id="environment_name"
              name="environment_name"
              defaultValue={formData?.environment_name || ""}
              placeholder="Enter environment name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="friction">Friction (0-1)</Label>
            <Input
              id="friction"
              name="friction"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={formData?.friction || 0.1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="visibility">Visibility (0-1)</Label>
            <Input
              id="visibility"
              name="visibility"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={formData?.visibility || 0.1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brake_efficiency">Brake Efficiency (0-1)</Label>
            <Input
              id="brake_efficiency"
              name="brake_efficiency"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={formData?.brake_efficiency || 0.1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slip_angle">Slip Angle (0-1)</Label>
            <Input
              id="slip_angle"
              name="slip_angle"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={formData?.slip_angle || 0.1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reaction_delay">Reaction Delay (0-1)</Label>
            <Input
              id="reaction_delay"
              name="reaction_delay"
              type="number"
              step="0.1"
              min="0"
              max="1"
              defaultValue={formData?.reaction_delay || 0.1}
              required
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {formMode === "create" ? "Create" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
