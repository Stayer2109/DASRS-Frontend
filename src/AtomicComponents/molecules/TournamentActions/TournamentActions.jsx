import React, { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import PropTypes from "prop-types";

export const TournamentActions = ({ tournamentId, onEdit, onChangeStatus }) => {
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    status: null,
  });

  const handleConfirm = () => {
    onChangeStatus(tournamentId, confirmDialog.status);
    setConfirmDialog({ isOpen: false, status: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ isOpen: false, status: null });
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Pending",
      ACTIVE: "Active",
      COMPLETED: "Completed",
      TERMINATED: "Terminated",
    };
    return statusMap[status] || status;
  };

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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={handleCancel}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to change the tournament status to{" "}
              <span className="font-semibold">
                {getStatusText(confirmDialog.status)}
              </span>
              ?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

TournamentActions.propTypes = {
  tournamentId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onChangeStatus: PropTypes.func.isRequired,
};
