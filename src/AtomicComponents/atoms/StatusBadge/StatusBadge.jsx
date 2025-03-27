import React from "react";

export const StatusBadge = ({ status, onClick }) => {
  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-800";

    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "TERMINATED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
        status
      )}`}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {status || "Unknown"}
    </span>
  );
};
