import React from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { PlusIcon } from "lucide-react";

export const TournamentHeader = ({ onNewTournament }) => {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium">Tournament Management</h3>
      <Button onClick={onNewTournament} size="sm" className="gap-2">
        <PlusIcon className="h-4 w-4" />
        New Tournament
      </Button>
    </div>
  );
};
