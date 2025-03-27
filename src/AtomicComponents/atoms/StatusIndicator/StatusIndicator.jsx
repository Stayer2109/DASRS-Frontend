import React from "react";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Check, X } from "lucide-react";

export const StatusIndicator = ({ isEnabled, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={isEnabled} onCheckedChange={onChange} />
      <Badge variant={isEnabled ? "success" : "destructive"}>
        {isEnabled ? (
          <Check className="mr-1 h-4 w-4" />
        ) : (
          <X className="mr-1 h-4 w-4" />
        )}
        {isEnabled ? "Enabled" : "Disabled"}
      </Badge>
    </div>
  );
};
