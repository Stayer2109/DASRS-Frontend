/** @format */

import PropTypes from "prop-types";
import "./TeamCard.scss";

const RoundInfoCard = ({
  className = "",
  item = {},
  isActive = false,
  onClick = () => {},
}) => {
  const statusMap = {
    pending: {
      label: "Pending",
      style: "bg-yellow-600 text-white",
    },
    active: {
      label: "Active",
      style: "bg-red-500 text-white",
    },
    terminated: {
      label: "Terminated",
      style: "bg-gray-700 text-white",
    },
    completed: {
      label: "Completed",
      style: "bg-green-600 text-white",
    },
  };

  return (
    <div
      className={`${className} relative overflow-hidden 
      rounded-full p-3 px-5 text-white font-bold flex justify-between 
      cursor-pointer transition-all duration-150 ease-linear team-card
      ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {/* Content Wrapper (so text stays visible above background) */}
      <div className="relative z-10 flex w-full justify-between items-baseline gap-3">
        <h4 className="text-h4 flex items-center self-center">
          {item.round_name ?? "Team name"}
        </h4>
        {(() => {
          const status = item.status?.toLowerCase();
          const config = statusMap[status] || {
            label: status ?? "Unknown",
            style: "bg-gray-400 text-white",
          };

          return (
            <div
              className={`status p-2 px-4 rounded-full self-center ${config.style}`}
            >
              <span className="text-small font-medium">{config.label}</span>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

RoundInfoCard.propTypes = {
  className: PropTypes.string,
  item: PropTypes.object,
  isActive: PropTypes.bool, // Added prop
  onClick: PropTypes.func,
};

export default RoundInfoCard;
