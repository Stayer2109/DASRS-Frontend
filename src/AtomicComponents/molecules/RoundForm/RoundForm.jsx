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
import { Checkbox } from "@/AtomicComponents/atoms/shadcn/checkbox";
import { Calendar } from "@/AtomicComponents/atoms/shadcn/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/AtomicComponents/atoms/shadcn/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";

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
  formMode, // Add formMode prop
}) => {
  return (
    <div className="flex flex-col h-full pb-6">
      <form onSubmit={onSubmit} className="flex flex-col h-full">
        {/* Scrollable content */}
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.start_date ? (
                      format(new Date(formData.start_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.start_date ? new Date(formData.start_date) : undefined}
                    onSelect={(date) => onDateChange("start_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.end_date ? (
                      format(new Date(formData.end_date), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.end_date ? new Date(formData.end_date) : undefined}
                    onSelect={(date) => onDateChange("end_date", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
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
                    onClick={() => onSelectChange("resource_id", resource.resource_id)}
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
                    onClick={() => onSelectChange("environment_id", env.environment_id)}
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
                    onClick={() => onSelectChange("match_type_id", type.match_type_id)}
                  >
                    <h4 className="font-medium">{type.match_type_name}</h4>
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

        {/* Fixed footer */}
        <div className="flex justify-end space-x-2 pt-4 mt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <LoadingIndicator size="small" className="mr-2" />
                {formMode === "edit" ? "Saving..." : "Creating..."}
              </>
            ) : (
              formMode === "edit" ? "Save Changes" : "Create Round"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};



