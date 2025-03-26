import React from "react";
import { PencilIcon, TrashIcon, MoreHorizontal } from "lucide-react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/AtomicComponents/atoms/shadcn/dropdown-menu";

export const TournamentActions = ({ 
  tournamentId,
  onEdit,
  onDelete,
  onChangeStatus 
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onEdit(tournamentId)}>
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Tournament
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onChangeStatus(tournamentId, "PENDING")}>
          Set to Pending
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(tournamentId, "ACTIVE")}>
          Set to Active
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(tournamentId, "COMPLETED")}>
          Set to Completed
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onChangeStatus(tournamentId, "TERMINATED")}>
          Set to Terminated
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600"
          onClick={() => onDelete(tournamentId)}
        >
          <TrashIcon className="h-4 w-4 mr-2" />
          Delete Tournament
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};