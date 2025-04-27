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
