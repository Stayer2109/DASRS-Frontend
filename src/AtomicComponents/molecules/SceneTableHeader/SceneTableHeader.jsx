import React from "react";
import { TableHeader, TableRow } from "@/AtomicComponents/atoms/shadcn/table";
import { TableHead } from "@/AtomicComponents/atoms/shadcn/table";
import { SortableColumnHeader } from "@/AtomicComponents/atoms/SortableColumnHeader/SortableColumnHeader";

export const SceneTableHeader = ({ sortColumn, sortOrder, onSort }) => {
  return (
    <TableHeader>
      <TableRow>
        <SortableColumnHeader
          column="id"
          currentSortColumn={sortColumn}
          currentSortOrder={sortOrder}
          onSort={onSort}
          className="w-[80px]"
        >
          ID
        </SortableColumnHeader>
        
        <SortableColumnHeader
          column="resourceName"
          currentSortColumn={sortColumn}
          currentSortOrder={sortOrder}
          onSort={onSort}
          className="w-52"
        >
          Scene Name
        </SortableColumnHeader>
        
        <SortableColumnHeader
          column="resourceType"
          currentSortColumn={sortColumn}
          currentSortOrder={sortOrder}
          onSort={onSort}
        >
          Type
        </SortableColumnHeader>
        
        <TableHead>Preview</TableHead>
        
        <SortableColumnHeader
          column="isEnable"
          currentSortColumn={sortColumn}
          currentSortOrder={sortOrder}
          onSort={onSort}
        >
          Status
        </SortableColumnHeader>
        
        <TableHead className="text-center">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};