import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";

export const ParticipatingTeams = ({ matchList }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Flatten and deduplicate teams
  const teams = [
    ...new Map(
      matchList
        ?.flatMap((match) => match.teams || [])
        .map((team) => [team.team_id, team])
    ).values(),
  ];

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm">
        <span>Participating Teams</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-1 pt-2">
        <div className="flex flex-col gap-3 bg-gray-50 p-3 rounded-md text-sm">
          {teams.length > 0 ? (
            teams.map((team) => (
              <div
                key={team.team_id}
                className="text-muted-foreground hover:text-blue-500 text-sm hover:cursor-pointer"
              >
                {team.team_name}{" "}
                <span className="text-gray-400 text-xs">({team.team_tag})</span>
              </div>
            ))
          ) : (
            <p className="py-2 text-gray-500 text-sm text-center">
              No teams found
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
