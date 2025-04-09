import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";

export const CarModal = ({ isOpen, onClose, formMode, formData, onSubmit }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create New Car" : "Edit Car"}
          </DialogTitle>
          <DialogDescription>
            {formMode === "create"
              ? "Add a new car to the system."
              : "Edit the car's specifications."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="car_name">Name</Label>
                <Input
                  id="car_name"
                  value={formData?.car_name || ""}
                  onChange={(e) =>
                    onFormDataChange({ car_name: e.target.value })
                  }
                  placeholder="Enter car name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maximum_torque">Maximum Torque</Label>
                <Input
                  id="maximum_torque"
                  type="number"
                  value={formData?.maximum_torque || 0}
                  onChange={(e) =>
                    onFormDataChange({ maximum_torque: Number(e.target.value) })
                  }
                  placeholder="Enter maximum torque"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimum_engine_rpm">Minimum Engine RPM</Label>
                <Input
                  id="minimum_engine_rpm"
                  type="number"
                  value={formData?.minimum_engine_rpm || 0}
                  onChange={(e) =>
                    onFormDataChange({ minimum_engine_rpm: Number(e.target.value) })
                  }
                  placeholder="Enter minimum engine RPM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maximum_engine_rpm">Maximum Engine RPM</Label>
                <Input
                  id="maximum_engine_rpm"
                  type="number"
                  value={formData?.maximum_engine_rpm || 0}
                  onChange={(e) =>
                    onFormDataChange({ maximum_engine_rpm: Number(e.target.value) })
                  }
                  placeholder="Enter maximum engine RPM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shift_up_rpm">Shift Up RPM</Label>
                <Input
                  id="shift_up_rpm"
                  type="number"
                  value={formData?.shift_up_rpm || 0}
                  onChange={(e) =>
                    onFormDataChange({ shift_up_rpm: Number(e.target.value) })
                  }
                  placeholder="Enter shift up RPM"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="shift_down_rpm">Shift Down RPM</Label>
                <Input
                  id="shift_down_rpm"
                  type="number"
                  value={formData?.shift_down_rpm || 0}
                  onChange={(e) =>
                    onFormDataChange({ shift_down_rpm: Number(e.target.value) })
                  }
                  placeholder="Enter shift down RPM"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final_drive_ratio">Final Drive Ratio</Label>
                <Input
                  id="final_drive_ratio"
                  type="number"
                  value={formData?.final_drive_ratio || 0}
                  onChange={(e) =>
                    onFormDataChange({ final_drive_ratio: Number(e.target.value) })
                  }
                  placeholder="Enter final drive ratio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="anti_roll_force">Anti Roll Force</Label>
                <Input
                  id="anti_roll_force"
                  type="number"
                  value={formData?.anti_roll_force || 0}
                  onChange={(e) =>
                    onFormDataChange({ anti_roll_force: Number(e.target.value) })
                  }
                  placeholder="Enter anti roll force"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="steering_helper_strength">Steering Helper Strength</Label>
                <Input
                  id="steering_helper_strength"
                  type="number"
                  value={formData?.steering_helper_strength || 0}
                  onChange={(e) =>
                    onFormDataChange({ steering_helper_strength: Number(e.target.value) })
                  }
                  placeholder="Enter steering helper strength"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="traction_helper_strength">Traction Helper Strength</Label>
                <Input
                  id="traction_helper_strength"
                  type="number"
                  value={formData?.traction_helper_strength || 0}
                  onChange={(e) =>
                    onFormDataChange({ traction_helper_strength: Number(e.target.value) })
                  }
                  placeholder="Enter traction helper strength"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Label htmlFor="is_enabled">Status</Label>
            <Switch
              id="is_enabled"
              checked={formData?.is_enabled || false}
              onCheckedChange={(checked) =>
                onFormDataChange({ is_enabled: checked })
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {formMode === "create" ? "Create Car" : "Update Car"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

