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

export const MatchTypeModal = ({
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
    
    // Create the payload object
    const payload = {
      match_type_name: formValues.get("match_type_name"),
      match_duration: parseFloat(formValues.get("match_duration")),
      player_number: parseInt(formValues.get("player_number")),
      team_number: parseInt(formValues.get("team_number")),
    };
    
    // If editing, include the match_type_id and status
    if (formMode === "edit" && formData) {
      payload.match_type_id = formData.match_type_id;
      payload.status = localStatus ? "ACTIVE" : "INACTIVE";
    } else {
      // For new match types, default to ACTIVE
      payload.status = "ACTIVE";
    }
    
    onSubmit(payload);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create Match Type" : "Edit Match Type"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "create"
              ? "Add a new match type to your system."
              : "Make changes to your match type here."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="match_type_name">Match Type Name</Label>
            <Input
              id="match_type_name"
              name="match_type_name"
              defaultValue={formData?.match_type_name || ""}
              placeholder="Enter match type name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="match_duration">Match Duration (Hours)</Label>
            <Input
              id="match_duration"
              name="match_duration"
              type="number"
              step="0.25"
              min="0.25"
              max="24"
              defaultValue={formData?.match_duration || 0.5}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="player_number">Player Number</Label>
            <Input
              id="player_number"
              name="player_number"
              type="number"
              min="1"
              max="100"
              defaultValue={formData?.player_number || 1}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_number">Team Number</Label>
            <Input
              id="team_number"
              name="team_number"
              type="number"
              min="1"
              max="50"
              defaultValue={formData?.team_number || 1}
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

