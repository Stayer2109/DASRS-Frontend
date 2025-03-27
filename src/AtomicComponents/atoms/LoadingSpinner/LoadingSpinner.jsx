import React from "react";
import { Loader2 } from "lucide-react";

export const LoadingSpinner = ({ size = "large" }) => {
  const sizeClass = size === "small" ? "h-4 w-4" : "h-8 w-8";

  return <Loader2 className={`animate-spin ${sizeClass} text-primary`} />;
};
