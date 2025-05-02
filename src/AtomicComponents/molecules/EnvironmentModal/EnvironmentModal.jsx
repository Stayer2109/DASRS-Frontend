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
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";
import { useState, useEffect } from "react";

export const EnvironmentModal = ({
  isOpen,
  onClose,
  formMode,
  formData,
  onSubmit,
}) => {
  const [localStatus, setLocalStatus] = useState(formData?.status === "ACTIVE");
  
  // Update local status when formData changes
  useEffect(() => {
    setLocalStatus(formData?.status === "ACTIVE");
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValues = new FormData(e.target);
    
    const payload = {
      environment_name: formValues.get("environment_name"),
    };
    
    // If editing, include the environment_id and status
    if (formMode === "edit" && formData) {
      payload.environment_id = formData.environment_id;
      payload.status = localStatus ? "ACTIVE" : "INACTIVE";
    }
    
    onSubmit(payload);
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

          {formMode === "edit" && (
            <div className="flex items-center space-x-2">
              <Switch 
                id="status"
                checked={localStatus}
                onCheckedChange={setLocalStatus}
              />
              <Label htmlFor="status" className="flex items-center">
                <div className={`ml-2 text-sm font-medium ${localStatus ? 'text-green-600' : 'text-red-600'}`}>
                  {localStatus ? 'Active' : 'Inactive'}
                </div>
              </Label>
            </div>
          )}

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
