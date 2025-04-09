import React from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/AtomicComponents/atoms/shadcn/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { Checkbox } from "@/AtomicComponents/atoms/shadcn/checkbox";

export const RoundForm = ({
  formData,
  isSubmitting,
  onInputChange,
  onDateChange,
  onNumberChange,
  onSelectChange,
  onSubmit,
  onCancel,
  resources,
  environments,
  matchTypes,
  formMode,
}) => {
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".calendar-dropdown")) {
        setStartDateOpen(false);
        setEndDateOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col h-full pb-6">
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="round_name">Round Name</Label>
              <Input
                id="round_name"
                name="round_name"
                value={formData.round_name}
                onChange={onInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="team_limit">Qualification Spots</Label>
              <Input
                id="team_limit"
                name="team_limit"
                type="number"
                value={formData.team_limit}
                onChange={onNumberChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <div className="relative calendar-dropdown">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setStartDateOpen(!startDateOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.start_date ? (
                    format(new Date(formData.start_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
                {startDateOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 bg-white rounded-md shadow-lg border p-2">
                    <DayPicker
                      mode="single"
                      selected={
                        formData.start_date
                          ? new Date(formData.start_date)
                          : undefined
                      }
                      onSelect={(date) => {
                        onDateChange("start_date", date);
                        setStartDateOpen(false);
                      }}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <div className="relative calendar-dropdown">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setEndDateOpen(!endDateOpen)}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.end_date ? (
                    format(new Date(formData.end_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
                {endDateOpen && (
                  <div className="absolute top-full left-0 z-50 mt-1 bg-white rounded-md shadow-lg border p-2">
                    <DayPicker
                      mode="single"
                      selected={
                        formData.end_date
                          ? new Date(formData.end_date)
                          : undefined
                      }
                      onSelect={(date) => {
                        onDateChange("end_date", date);
                        setEndDateOpen(false);
                      }}
                      initialFocus
                      disabled={(date) =>
                        formData.start_date
                          ? date < new Date(formData.start_date)
                          : date < new Date()
                      }
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Score Method Section */}
            <div className="col-span-2">
              <h3 className="text-lg font-semibold mb-3">Score Method</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lap">Lap Points</Label>
                  <Input
                    id="lap"
                    name="lap"
                    type="number"
                    value={formData.scoreMethod?.lap}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assistUsageCount">Assist Usage Points</Label>
                  <Input
                    id="assistUsageCount"
                    name="assistUsageCount"
                    type="number"
                    value={formData.scoreMethod?.assistUsageCount}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="collision">Collision Points</Label>
                  <Input
                    id="collision"
                    name="collision"
                    type="number"
                    value={formData.scoreMethod?.collision}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_race_time">Race Time Points</Label>
                  <Input
                    id="total_race_time"
                    name="total_race_time"
                    type="number"
                    value={formData.scoreMethod?.total_race_time}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="off_track">Off Track Points</Label>
                  <Input
                    id="off_track"
                    name="off_track"
                    type="number"
                    value={formData.scoreMethod?.off_track}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="average_speed">Average Speed Points</Label>
                  <Input
                    id="average_speed"
                    name="average_speed"
                    type="number"
                    value={formData.scoreMethod?.average_speed}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="total_distance">Distance Points</Label>
                  <Input
                    id="total_distance"
                    name="total_distance"
                    type="number"
                    value={formData.scoreMethod?.total_distance}
                    onChange={(e) => onNumberChange(e, "scoreMethod")}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Match Finish Type</Label>
                  <Select
                    value={formData.scoreMethod?.match_finish_type}
                    onValueChange={(value) =>
                      onSelectChange("match_finish_type", value, "scoreMethod")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LAP">LAP</SelectItem>
                      <SelectItem value="TIME">TIME</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Selection Cards */}
            <div className="col-span-2 space-y-4">
              <Label>Resource</Label>
              <div className="grid grid-cols-3 gap-4">
                {resources?.map((resource) => (
                  <div
                    key={resource.resource_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.resource_id === resource.resource_id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      onSelectChange("resource_id", resource.resource_id)
                    }
                  >
                    <h4 className="font-medium">{resource.resource_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {resource.resource_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <Label>Environment</Label>
              <div className="grid grid-cols-3 gap-4">
                {environments?.map((env) => (
                  <div
                    key={env.environment_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.environment_id === env.environment_id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      onSelectChange("environment_id", env.environment_id)
                    }
                  >
                    <h4 className="font-medium">{env.environment_name}</h4>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 space-y-4">
              <Label>Match Type</Label>
              <div className="grid grid-cols-3 gap-4">
                {matchTypes?.map((type) => (
                  <div
                    key={type.match_type_id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      formData.match_type_id === type.match_type_id
                        ? "border-primary bg-primary/10"
                        : "hover:border-primary/50"
                    }`}
                    onClick={() =>
                      onSelectChange("match_type_id", type.match_type_id)
                    }
                  >
                    <h4 className="font-medium">{type.match_type_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Duration: {type.match_duration}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Type: {type.finish_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
              />
            </div>

            <div className="col-span-2 flex items-center space-x-2">
              <Checkbox
                id="is_last"
                checked={formData.is_last}
                onCheckedChange={(checked) =>
                  onInputChange({ target: { name: "is_last", value: checked } })
                }
              />
              <Label htmlFor="is_last">Is Final Round</Label>
            </div>
          </div>
        </div>

        {/* Form Footer */}
        <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingIndicator size="small" className="mr-2" />
                {formMode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : formMode === "create" ? (
              "Create Round"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};
