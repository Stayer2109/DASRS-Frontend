import React from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/AtomicComponents/atoms/shadcn/select";

export const SceneHeader = ({ 
  onNewScene, 
  error, 
  typeFilter, 
  onTypeFilterChange 
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button onClick={onNewScene} size="sm" className="gap-2">
          <Plus size={16} /> New Scene
        </Button>
        {error && <p className="text-destructive">{error}</p>}
      </div>
      <Select value={typeFilter} onValueChange={onTypeFilterChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Resource Types</SelectLabel>
            <SelectItem value="ALL">All Types</SelectItem>
            <SelectItem value="MAP">MAP</SelectItem>
            <SelectItem value="UI">UI</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};