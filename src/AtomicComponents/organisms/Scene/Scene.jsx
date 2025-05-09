import React, { useState } from "react";
import { Card, CardContent } from "@/AtomicComponents/atoms/shadcn/card";
import { SceneHeader } from "@/AtomicComponents/molecules/SceneHeader/SceneHeader";
import { SceneTable } from "@/AtomicComponents/organisms/SceneTable/SceneTable";
import { Pagination } from "@/AtomicComponents/molecules/Pagination/Pagination";
import { SceneModal } from "@/AtomicComponents/organisms/SceneModal/SceneModal";
import { useSceneManagement } from "@/hooks/useSceneManagement";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";

export const Scene = () => {
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

  // Add new state for status confirmation
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [sceneToToggle, setSceneToToggle] = useState(null);

  // New function to handle status toggle click
  const handleStatusToggleClick = (resourceId, currentStatus) => {
    setSceneToToggle({ resourceId, currentStatus });
    setStatusConfirmOpen(true);
  };

  // New function to handle confirmation
  const handleStatusConfirm = () => {
    if (sceneToToggle) {
      handleStatusToggle(sceneToToggle.resourceId, sceneToToggle.currentStatus);
    }
    setStatusConfirmOpen(false);
    setSceneToToggle(null);
  };

  return (
    <>
      <h1 className="text-2xl font-bold pb-4">Scene List</h1>

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
            onStatusToggle={handleStatusToggleClick}
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

      {/* Status Change Confirmation Dialog */}
      <Dialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to{" "}
            {sceneToToggle?.currentStatus ? "disable" : "enable"} this scene?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleStatusConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
