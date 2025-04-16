import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";

export const LoadingIndicator = ({ size = "large" }) => {
  const sizeClass = size === "small" ? "h-4 w-4" : "h-8 w-8";

  return (
    <div className="flex justify-center items-center">
      <Loader2 className={`${sizeClass} text-primary animate-spin`} />
    </div>
  );
};

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(["small", "large"]),
}