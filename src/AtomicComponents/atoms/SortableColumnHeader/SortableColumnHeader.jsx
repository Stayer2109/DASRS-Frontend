import React from "react";
import { TableHead } from "@/AtomicComponents/atoms/shadcn/table";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

export const SortableColumnHeader = ({
  column,
  currentSortColumn,
  currentSortOrder,
  onSort,
  children,
  className = "",
}) => {
  const getSortIcon = () => {
    if (currentSortColumn !== column) {
      return <ChevronsUpDown size={16} />;
    }
    return currentSortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  return (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 ${className}`}
      onClick={() => onSort(column)}
    >
      <div className="flex items-center justify-between">
        {children}
        {getSortIcon()}
      </div>
    </TableHead>
  );
};
