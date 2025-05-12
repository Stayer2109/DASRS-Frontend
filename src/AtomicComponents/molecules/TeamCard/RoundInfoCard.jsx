/** @format */

import PropTypes from "prop-types";
import clsx from "clsx";

const RoundInfoCard = ({
  className = "",
  item = {},
  isActive = false,
  onClick = () => {},
}) => {
  const statusMap = {
    pending: {
      label: "Pending",
      class: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    },
    active: {
      label: "Active",
      class: "bg-red-100 text-red-600 border border-red-300",
    },
    terminated: {
      label: "Terminated",
      class: "bg-gray-100 text-gray-600 border border-gray-300",
    },
    completed: {
      label: "Completed",
      class: "bg-green-100 text-green-700 border border-green-300",
    },
  };

  const status = item.status?.toLowerCase();
  const config = statusMap[status] || {
    label: status ?? "Unknown",
    class: "bg-gray-200 text-gray-700 border border-gray-300",
  };

  return (
    <div
      onClick={onClick}
      className={clsx(
        "relative flex justify-between items-center px-6 py-4 border rounded-xl overflow-hidden transition-all duration-100 ease-linear cursor-pointer",
        isActive
          ? "bg-blue-500 text-white shadow-md"
          : "bg-gray-700 text-white hover:ring-2 hover:ring-blue-500 transition-shadow duration-100",
        className
      )}
    >
      {/* Title */}
      <h4 className="z-10 max-w-[80%] font-semibold text-base sm:text-lg truncate">
        {item.tournament_name ?? "Tournament name"}
      </h4>

      {/* Status Badge */}
      <div
        className={clsx(
          "z-10 px-3 py-1 rounded-full font-medium text-sm whitespace-nowrap",
          config.class
        )}
      >
        {config.label}
      </div>

      {/* Active Overlay Animation (if needed) */}
      {isActive && (
        <div className="absolute inset-0 bg-blue-500 opacity-30 rounded-xl animate-fade-in pointer-events-none" />
      )}
    </div>
  );
};

RoundInfoCard.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  isActive: PropTypes.bool,
  onClick: PropTypes.func,
};

export default RoundInfoCard;
