import React from "react";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";

export const ResourceTypeBadge = ({ type }) => {
  return (
    <Badge variant={type === "MAP" ? "default" : "secondary"}>{type}</Badge>
  );
};
