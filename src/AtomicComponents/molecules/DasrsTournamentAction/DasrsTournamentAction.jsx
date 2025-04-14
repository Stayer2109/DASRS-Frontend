import { PencilIcon, MoreHorizontal } from "lucide-react";
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

export const DasrsTournamentActions = ({
  onEdit,
  status,
  onClick,
}) => {
  return (
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

        {/* Edit Tournament */}
        <DropdownMenuItem onClick={() => onEdit()} className="cursor-pointer">
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Tournament
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuLabel>Change Status</DropdownMenuLabel>

        {/* Only Terminated Option */}
        <DropdownMenuItem
          disabled={status === "TERMINATED"}
          onClick={onClick}
          className="cursor-pointer"
        >
          Set to Terminated
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

DasrsTournamentActions.propTypes = {
  tournamentId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
