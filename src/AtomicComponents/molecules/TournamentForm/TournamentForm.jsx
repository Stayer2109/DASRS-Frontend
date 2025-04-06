import React from "react";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { DialogFooter } from "@/AtomicComponents/atoms/shadcn/dialog";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

export const TournamentForm = ({
  formData,
  formMode,
  isSubmitting,
  onInputChange,
  onDateChange,
  onNumberChange,
  onSubmit,
  onCancel,
}) => {
  const [startDateOpen, setStartDateOpen] = React.useState(false);
  const [endDateOpen, setEndDateOpen] = React.useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid w-full gap-2">
        <Label htmlFor="tournament_name">Tournament Name</Label>
        <Input
          id="tournament_name"
          name="tournament_name"
          value={formData.tournament_name || ""}
          onChange={onInputChange}
          required
          placeholder="Enter tournament name"
        />
      </div>
      <div className="grid w-full gap-2">
        <Label htmlFor="start_date">Start Date</Label>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
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

      <div className="grid w-full gap-2">
        <Label htmlFor="end_date">End Date</Label>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
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
                  formData.end_date ? new Date(formData.end_date) : undefined
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

      <div className="grid w-full gap-2">
        <Label htmlFor="tournament_context">Tournament Context</Label>
        <Textarea
          id="tournament_context"
          name="tournament_context"
          value={formData.tournament_context || ""}
          onChange={onInputChange}
          placeholder="Enter tournament context"
          rows={4}
        />
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="team_number">Number of Teams</Label>
        <Input
          id="team_number"
          name="team_number"
          type="number"
          min="2"
          value={formData.team_number || 2}
          onChange={onNumberChange}
          required
        />
      </div>

      <DialogFooter>
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
            "Create Tournament"
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};
