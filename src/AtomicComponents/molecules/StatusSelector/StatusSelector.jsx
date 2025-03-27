import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/AtomicComponents/atoms/shadcn/select";

// Status options - can be imported from constants
const STATUS_OPTIONS = {
  PENDING: "Pending",
  ACTIVE: "Active", 
  TERMINATED: "Terminated",
  COMPLETED: "Completed"
};

export const StatusSelector = ({ 
  currentStatus, 
  onStatusChange, 
  onSubmit, 
  isSubmitting 
}) => {
  return (
    <div className="flex items-center gap-2">
      <Select
        value={currentStatus}
        onValueChange={onStatusChange}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="TERMINATED">Terminated</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button 
        size="sm" 
        onClick={onSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <LoadingIndicator size="small" />
        ) : (
          <Check className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};