import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Checkbox } from "@/AtomicComponents/atoms/shadcn/checkbox";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/AtomicComponents/atoms/shadcn/select";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import PropTypes from "prop-types";
import React from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

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
    <div className="flex flex-col pb-6 h-full">
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        <div className="flex-1 -mr-4 py-2 pr-4 overflow-y-auto">
          <div className="gap-4 grid grid-cols-2">
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
                  className="justify-start w-full"
                  onClick={() => setStartDateOpen(!startDateOpen)}
                >
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {formData.start_date ? (
                    format(new Date(formData.start_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
                {startDateOpen && (
                  <div className="top-full left-0 z-50 absolute bg-white shadow-lg mt-1 p-2 border rounded-md">
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
                  className="justify-start w-full"
                  onClick={() => setEndDateOpen(!endDateOpen)}
                >
                  <CalendarIcon className="mr-2 w-4 h-4" />
                  {formData.end_date ? (
                    format(new Date(formData.end_date), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
                {endDateOpen && (
                  <div className="top-full left-0 z-50 absolute bg-white shadow-lg mt-1 p-2 border rounded-md">
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
              <h3 className="mb-3 font-semibold text-lg">Score Method</h3>
              <div className="gap-4 grid grid-cols-2">
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
            <div className="space-y-4 col-span-2">
              <Label>Resource</Label>
              <div className="gap-4 grid grid-cols-3">
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
                    <p className="text-muted-foreground text-sm">
                      {resource.resource_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 col-span-2">
              <Label>Environment</Label>
              <div className="gap-4 grid grid-cols-3">
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

            <div className="space-y-4 col-span-2">
              <Label>Match Type</Label>
              <div className="gap-4 grid grid-cols-3">
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
                    <p className="text-muted-foreground text-sm">
                      Duration: {type.match_duration}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      Type: {type.finish_type}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={onInputChange}
              />
            </div>

            <div className="flex items-center space-x-2 col-span-2">
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

RoundForm.propTypes = {
  formData: PropTypes.shape({
    round_name: PropTypes.string.isRequired,
    team_limit: PropTypes.number.isRequired,
    start_date: PropTypes.string,
    end_date: PropTypes.string,
    scoreMethod: PropTypes.object.isRequired,
    resource_id: PropTypes.string.isRequired,
    environment_id: PropTypes.string.isRequired,
    match_type_id: PropTypes.string.isRequired,
    description: PropTypes.string,
    is_last: PropTypes.bool.isRequired,
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onInputChange: PropTypes.func.isRequired,
  onDateChange: PropTypes.func.isRequired,
  onNumberChange: PropTypes.func.isRequired,
  onSelectChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  resources: PropTypes.arrayOf(PropTypes.object).isRequired,
  environments: PropTypes.arrayOf(PropTypes.object).isRequired,
  matchTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  formMode: PropTypes.oneOf(["create", "edit"]).isRequired,
};