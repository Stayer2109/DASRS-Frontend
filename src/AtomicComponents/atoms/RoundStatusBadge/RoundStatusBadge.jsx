import React from "react";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";

export const RoundStatusBadge = ({ status }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "TERMINATED":
        return "bg-red-100 text-red-800";
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Badge className={getStatusStyles(status)}>
      {status || "Unknown"}
    </Badge>
  );
};