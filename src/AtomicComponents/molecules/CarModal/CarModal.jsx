import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";
import { useState, useEffect } from "react";

export const CarModal = ({ isOpen, onClose, formMode, formData, onSubmit }) => {
  const [localFormData, setLocalFormData] = useState(formData || {});

  useEffect(() => {
    setLocalFormData(formData || {});
  }, [formData]);

  const handleFormDataChange = (field, value) => {
    setLocalFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e, localFormData); // Pass both event and form data
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {formMode === "create" ? "Create New Car" : "Edit Car"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Car Name */}
          <div className="space-y-2">
            <Label htmlFor="car_name">Name</Label>
            <Input
              id="car_name"
              value={localFormData?.car_name || ""}
              onChange={(e) => handleFormDataChange("car_name", e.target.value)}
              required
              placeholder="Enter car name"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Engine Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                  Engine
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minimum_engine_rpm">
                      Minimum Engine RPM
                    </Label>
                    <Input
                      id="minimum_engine_rpm"
                      type="number"
                      required
                      value={localFormData?.minimum_engine_rpm || 700}
                      onChange={(e) =>
                        handleFormDataChange(
                          "minimum_engine_rpm",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximum_engine_rpm">
                      Maximum Engine RPM
                    </Label>
                    <Input
                      id="maximum_engine_rpm"
                      type="number"
                      required
                      value={localFormData?.maximum_engine_rpm || 7000}
                      onChange={(e) =>
                        handleFormDataChange(
                          "maximum_engine_rpm",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maximum_torque">Maximum Torque</Label>
                    <Input
                      id="maximum_torque"
                      type="number"
                      value={localFormData?.maximum_torque || 4500}
                      required
                      onChange={(e) =>
                        handleFormDataChange(
                          "maximum_torque",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift_up_rpm">Shift Up RPM</Label>
                    <Input
                      id="shift_up_rpm"
                      type="number"
                      required
                      value={localFormData?.shift_up_rpm || 5500}
                      onChange={(e) =>
                        handleFormDataChange(
                          "shift_up_rpm",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="shift_down_rpm">Shift Down RPM</Label>
                    <Input
                      id="shift_down_rpm"
                      type="number"
                      value={localFormData?.shift_down_rpm || 2750}
                      onChange={(e) =>
                        handleFormDataChange(
                          "shift_down_rpm",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="final_drive_ratio">Final Drive Ratio</Label>
                    <Input
                      id="final_drive_ratio"
                      type="number"
                      required
                      value={localFormData?.final_drive_ratio || 1}
                      onChange={(e) =>
                        handleFormDataChange(
                          "final_drive_ratio",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Handling Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                  Handling
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="steering_helper_strength">
                      Steering Helper Strength
                    </Label>
                    <Input
                      id="steering_helper_strength"
                      type="number"
                      required
                      value={localFormData?.steering_helper_strength || 1}
                      onChange={(e) =>
                        handleFormDataChange(
                          "steering_helper_strength",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traction_helper_strength">
                      Traction Helper Strength
                    </Label>
                    <Input
                      id="traction_helper_strength"
                      type="number"
                      required
                      value={localFormData?.traction_helper_strength || 1}
                      onChange={(e) =>
                        handleFormDataChange(
                          "traction_helper_strength",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>

              {/* Brake Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                  Brake
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_brake_torque">Max Brake Torque</Label>
                    <Input
                      id="max_brake_torque"
                      type="number"
                      required
                      value={localFormData?.max_brake_torque || 2500}
                      onChange={(e) =>
                        handleFormDataChange(
                          "max_brake_torque",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anti_roll_force">Anti Roll Force</Label>
                    <Input
                      id="anti_roll_force"
                      type="number"
                      required
                      value={localFormData?.anti_roll_force || 100}
                      onChange={(e) =>
                        handleFormDataChange(
                          "anti_roll_force",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Customize Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                  Customize
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="front_camper">Front Camper</Label>
                    <Input
                      id="front_camper"
                      type="number"
                      required
                      value={localFormData?.front_camper || -10}
                      onChange={(e) =>
                        handleFormDataChange(
                          "front_camper",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rear_camper">Rear Camper</Label>
                    <Input
                      id="rear_camper"
                      type="number"
                      required
                      value={localFormData?.rear_camper || -10}
                      onChange={(e) =>
                        handleFormDataChange(
                          "rear_camper",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="front_ssr">Front SSR</Label>
                    <Input
                      id="front_ssr"
                      type="number"
                      required
                      value={localFormData?.front_ssr || 10000}
                      onChange={(e) =>
                        handleFormDataChange(
                          "front_ssr",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rear_ssr">Rear SSR</Label>
                    <Input
                      id="rear_ssr"
                      type="number"
                      required
                      value={localFormData?.rear_ssr || 10000}
                      onChange={(e) =>
                        handleFormDataChange("rear_ssr", Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="front_suspension">Front Suspension</Label>
                    <Input
                      id="front_suspension"
                      type="number"
                      step="0.1"
                      required
                      value={localFormData?.front_suspension || 0.1}
                      onChange={(e) =>
                        handleFormDataChange(
                          "front_suspension",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rear_suspension">Rear Suspension</Label>
                    <Input
                      id="rear_suspension"
                      type="number"
                      step="0.1"
                      required
                      value={localFormData?.rear_suspension || 0.1}
                      onChange={(e) =>
                        handleFormDataChange(
                          "rear_suspension",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="front_ssd">Front SSD</Label>
                    <Input
                      id="front_ssd"
                      type="number"
                      required
                      value={localFormData?.front_ssd || 1000}
                      onChange={(e) =>
                        handleFormDataChange(
                          "front_ssd",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rear_ssd">Rear SSD</Label>
                    <Input
                      id="rear_ssd"
                      type="number"
                      required
                      value={localFormData?.rear_ssd || 1000}
                      onChange={(e) =>
                        handleFormDataChange("rear_ssd", Number(e.target.value))
                      }
                    />
                  </div>
                  {/* Status toggle - always visible in edit mode */}
                  {formMode === "edit" && (
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="is_enabled">Status</Label>
                      <Switch
                        id="is_enabled"
                        checked={localFormData?.is_enabled || false}
                        onCheckedChange={(checked) =>
                          handleFormDataChange("is_enabled", checked)
                        }
                      />
                      <span className={`text-sm ${localFormData?.is_enabled ? 'text-green-600' : 'text-red-600'}`}>
                        {localFormData?.is_enabled ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {formMode === "create" ? "Create" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
