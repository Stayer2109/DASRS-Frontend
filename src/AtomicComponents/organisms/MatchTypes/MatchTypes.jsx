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
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";

export const MatchTypes = () => {
  const {
    tableData,
    isLoading,
    error,
    isModalOpen,
    setIsModalOpen,
    formMode,
    setFormMode,
    formData,
    setFormData,
    handleFormSubmit,
    handleStatusToggle,
    handleSort,
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
    setFormMode("edit");
    setFormData(matchType);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    toast.error("Delete functionality not implemented");
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

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
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
          onDelete={handleDelete}
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
  );
};
