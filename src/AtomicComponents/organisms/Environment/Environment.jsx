import { Card, CardContent } from "@/AtomicComponents/atoms/shadcn/card";
import { Pagination } from "@/AtomicComponents/molecules/Pagination/Pagination";
import { useEnvironmentManagement } from "@/hooks/useEnvironmentManagement";
import { EnvironmentTable } from "../EnvironmentTable/EnvironmentTable";
import { EnvironmentHeader } from "@/AtomicComponents/molecules/EnvironmentHeader/EnvironmentHeader";
import { EnvironmentModal } from "@/AtomicComponents/molecules/EnvironmentModal/EnvironmentModal";

export const Environment = () => {
  const {
    tableData,
    isLoading,
    error,
    sortColumn,
    sortOrder,
    pagination,
    isModalOpen,
    setIsModalOpen,
    formMode,
    formData,
    handleFormSubmit,
    handleEdit,
    handleDelete,
    handleSort,
    handleStatusToggle,
    handlePageChange,
  } = useEnvironmentManagement();

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <EnvironmentHeader
            onNewEnvironment={() => {
              setIsModalOpen(true);
              setFormMode("create"); // Changed from formMode("create")
            }}
            error={error}
          />

          <EnvironmentTable
            data={tableData}
            isLoading={isLoading}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      {!isLoading && tableData.length > 0 && (
        <Pagination
          currentPage={pagination.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <EnvironmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formMode={formMode}
        formData={formData}
        onSubmit={handleFormSubmit}
      />
    </>
  );
};

export default Environment;
