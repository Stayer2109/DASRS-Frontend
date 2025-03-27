import React from "react";
import { Card, CardContent } from "@/AtomicComponents/atoms/shadcn/card";
import { SceneHeader } from "@/AtomicComponents/molecules/SceneHeader/SceneHeader";
import { SceneTable } from "@/AtomicComponents/organisms/SceneTable/SceneTable";
import { Pagination } from "@/AtomicComponents/molecules/Pagination/Pagination";
import { SceneModal } from "@/AtomicComponents/organisms/SceneModal/SceneModal";
import { useSceneManagement } from "@/hooks/useSceneManagement";

export default function Scene() {
  const {
    tableData,
    isLoading,
    error,
    typeFilter,
    setTypeFilter,
    sortColumn,
    sortOrder,
    pagination,
    isModalOpen,
    setIsModalOpen,
    formMode,
    formData,
    isSubmitting,
    handleInputChange,
    handleTypeChange,
    handleFormSubmit,
    handleNewScene,
    handleEdit,
    handleDelete,
    handleSort,
    handleStatusToggle,
    handlePageChange,
  } = useSceneManagement();

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <SceneHeader
            onNewScene={handleNewScene}
            error={error}
            typeFilter={typeFilter}
            onTypeFilterChange={setTypeFilter}
          />

          <SceneTable
            data={tableData}
            isLoading={isLoading}
            sortColumn={sortColumn}
            sortOrder={sortOrder}
            onSort={handleSort}
            onStatusToggle={handleStatusToggle}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      {/* Using your existing Pagination component */}
      {!isLoading && tableData.length > 0 && (
        <Pagination
          currentPage={pagination.pageNo}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <SceneModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        formData={formData}
        formMode={formMode}
        isSubmitting={isSubmitting}
        onInputChange={handleInputChange}
        onTypeChange={handleTypeChange}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}
