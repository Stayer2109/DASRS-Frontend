import React from "react";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { LoadingSpinner } from "@/AtomicComponents/atoms/LoadingSpinner/LoadingSpinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/AtomicComponents/atoms/shadcn/select";
import { DialogFooter } from "@/AtomicComponents/atoms/shadcn/dialog";

export const SceneForm = ({ 
  formData, 
  formMode, 
  isSubmitting, 
  onInputChange, 
  onTypeChange,
  onSubmit, 
  onCancel 
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4 pt-4">
      <div className="grid w-full gap-2">
        <Label htmlFor="resource_name">Scene Name</Label>
        <Input
          id="resource_name"
          name="resource_name"
          value={formData.resource_name}
          onChange={onInputChange}
          required
          placeholder="Enter scene name"
        />
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="resource_type">Resource Type</Label>
        <Select
          name="resource_type"
          value={formData.resource_type}
          onValueChange={onTypeChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MAP">MAP</SelectItem>
            <SelectItem value="UI">UI</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="resource_image">Image URL</Label>
        <Input
          id="resource_image"
          name="resource_image"
          value={formData.resource_image || ""}
          onChange={onInputChange}
          placeholder="Enter image URL"
        />
      </div>

      <div className="grid w-full gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description || ""}
          onChange={onInputChange}
          placeholder="Enter scene description"
          rows={4}
        />
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              {formMode === "create" ? "Creating..." : "Saving..."}
            </>
          ) : formMode === "create" ? (
            "Create Scene"
          ) : (
            "Save Changes"
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};