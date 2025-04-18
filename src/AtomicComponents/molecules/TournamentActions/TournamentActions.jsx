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
import PropTypes from "prop-types";

export const TournamentActions = ({
  tournamentId,
  onEdit,
  onDelete,
  onChangeStatus,
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-white-hover cursor-pointer"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onEdit(tournamentId)}
            className="cursor-pointer"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Tournament
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onChangeStatus(tournamentId, "PENDING")}
          >
            Set to Pending
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onChangeStatus(tournamentId, "ACTIVE")}
          >
            Set to Active
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onChangeStatus(tournamentId, "COMPLETED")}
          >
            Set to Completed
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onChangeStatus(tournamentId, "TERMINATED")}
          >
            Set to Terminated
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="hover:text-red-600 cursor-pointer"
            onClick={() => onDelete(tournamentId)}
          >
            <TrashIcon className="h-4 w-4 mr-1" />
            Delete Tournament
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

TournamentActions.propTypes = {
  tournamentId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
