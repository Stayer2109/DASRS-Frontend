/** @format */

import PropTypes from "prop-types";
import "./TeamCard.scss";

const TeamCard = ({
  className = "",
  status = "Upcoming",
  teamName = "Team name",
  isActive = false,
  onClick = () => {},
}) => {
  return (
    <div
      className={`${className} relative overflow-hidden 
      rounded-full p-3 px-5 text-white font-bold flex justify-between 
      cursor-pointer transition-all duration-150 ease-linear team-card
      ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {/* Content Wrapper (so text stays visible above background) */}
      <div className="relative z-10 flex w-full justify-between">
        <h4 className="text-h4 flex items-center">
          {teamName ? teamName : "Team name"}
        </h4>
        <div className={`status p-2 px-4 rounded-full ${
            status.toLowerCase() === "upcoming"
              ? "bg-blue-500"
              : status.toLowerCase() === "finished"
              ? "bg-green-600"
              : status.toLowerCase() === "live"
              ? "bg-red-500"
              : "bg-[#1f1f1f]"
          }`}>
          {
            // Render status based on the status prop
            status.toLocaleLowerCase() === "upcoming" ? (
              <span className="text-small">Upcoming</span>
            ) : status.toLocaleLowerCase() === "finished" ? (
              <span className="text-small">Finished</span>
            ) : (
              <span className="text-small">Live</span>
            )
          }
        </div>
      </div>
    </div>
  );
};

TeamCard.propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
  teamName: PropTypes.string,
  isActive: PropTypes.bool, // Added prop
  onClick: PropTypes.func,
};

export default TeamCard;
