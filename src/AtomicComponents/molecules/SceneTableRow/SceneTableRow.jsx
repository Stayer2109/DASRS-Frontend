import React from "react";
import { TableCell, TableRow } from "@/AtomicComponents/atoms/shadcn/table";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Pencil } from "lucide-react";
import { ResourceTypeBadge } from "@/AtomicComponents/atoms/ResourceTypeBadge/ResourceTypeBadge";
import { StatusIndicator } from "@/AtomicComponents/atoms/StatusIndicator/StatusIndicator";
import { ResourcePreview } from "@/AtomicComponents/atoms/ResourcePreview/ResourcePreview";

export const SceneTableRow = ({ item, onStatusToggle, onEdit }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">
        {item.resource_id}
      </TableCell>
      <TableCell>{item.resource_name}</TableCell>
      <TableCell>
        <ResourceTypeBadge type={item.resource_type} />
      </TableCell>
      <TableCell>
        <ResourcePreview 
          image={item.resource_image} 
          description={item.description} 
        />
      </TableCell>
      <TableCell>
        <StatusIndicator 
          isEnabled={item.is_enable} 
          onChange={() => onStatusToggle(item.resource_id, item.is_enable)}
        />
      </TableCell>
      <TableCell className="text-center">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onEdit(item.resource_id)}
        >
          <Pencil size={16} />
        </Button>
      </TableCell>
    </TableRow>
  );
};