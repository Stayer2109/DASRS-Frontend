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
  editable,
  onClick,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={editable}
          className="hover:bg-white-hover p-0 w-8 h-8 cursor-pointer"
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Edit Tournament */}
        <DropdownMenuItem onClick={() => onEdit()} className="cursor-pointer">
          <PencilIcon className="mr-2 w-4 h-4" />
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
  editable: PropTypes.bool.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
