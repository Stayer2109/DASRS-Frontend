import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus } from "lucide-react";
import { useMatchTypeManagement } from "@/hooks/useMatchTypeManagement";
import { MatchTypeTable } from "@/AtomicComponents/organisms/MatchTypeTable/MatchTypeTable";
import { MatchTypeModal } from "@/AtomicComponents/molecules/MatchTypeModal/MatchTypeModal";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/AtomicComponents/atoms/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { useState } from "react";

export const MatchTypes = () => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [matchTypeToDelete, setMatchTypeToDelete] = useState(null);

  const {
    tableData,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    formMode,
    setFormMode,
    formData,
    setFormData,
    handleFormSubmit,
    handleStatusToggle,
    handleSort,
    handleDelete,
    sortColumn,
    sortOrder,
  } = useMatchTypeManagement();

  const handleCreate = () => {
    setFormMode("create");
    setFormData(null);
    setIsModalOpen(true);
  };

  const handleEdit = (id) => {
    const matchType = tableData.find((item) => item.match_type_id === id);
    if (matchType) {
      setFormMode("edit");
      setFormData({
        match_type_id: matchType.match_type_id,
        match_type_name: matchType.match_type_name,
        match_duration: matchType.match_duration,
        player_number: matchType.player_number,
        team_number: matchType.team_number,
        status: matchType.status,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteClick = (id) => {
    const matchType = tableData.find((item) => item.match_type_id === id);
    setMatchTypeToDelete(matchType);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!matchTypeToDelete) return;
    
    try {
      const success = await handleDelete(matchTypeToDelete.match_type_id);
      if (success) {
        toast.success("Match type deleted successfully");
      } else {
        toast.error("Failed to delete match type");
      }
    } catch (error) {
      console.error("Error deleting match type:", error);
      toast.error("Failed to delete match type");
    } finally {
      setConfirmDialogOpen(false);
      setMatchTypeToDelete(null);
    }
  };

  const onSubmit = async (data) => {
    try {
      await handleFormSubmit(data);
      toast.success(
        formMode === "create"
          ? "Match type created successfully"
          : "Match type updated successfully"
      );
    } catch (error) {
      toast.error("Failed to save match type");
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Match Type
          </Button>
        </CardHeader>
        <CardContent>
          <MatchTypeTable
            data={tableData}
            isLoading={isLoading}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <MatchTypeModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            formMode={formMode}
            formData={formData}
            onSubmit={onSubmit}
          />
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete the match type{" "}
            <span className="font-semibold">
              {matchTypeToDelete?.match_type_name}
            </span>
            ?
          </p>
          <p className="text-sm text-red-500 mt-2">
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
