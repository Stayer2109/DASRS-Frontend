import React from "react";
import { Table, TableBody, TableCell, TableRow } from "@/AtomicComponents/atoms/shadcn/table";
import { SceneTableHeader } from "@/AtomicComponents/molecules/SceneTableHeader/SceneTableHeader";
import { SceneTableRow } from "@/AtomicComponents/molecules/SceneTableRow/SceneTableRow";
import { LoadingSpinner } from "@/AtomicComponents/atoms/LoadingSpinner/LoadingSpinner";

export const SceneTable = ({ 
  data,
  isLoading,
  sortColumn,
  sortOrder,
  onSort,
  onStatusToggle,
  onEdit
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Table>
      <SceneTableHeader 
        sortColumn={sortColumn} 
        sortOrder={sortOrder} 
        onSort={onSort} 
      />
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8">
              No resources found
            </TableCell>
          </TableRow>
        ) : (
          data.map((item) => (
            <SceneTableRow
              key={item.resource_id}
              item={item}
              onStatusToggle={onStatusToggle}
              onEdit={onEdit}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};