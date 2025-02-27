import React from "react";

const TeamCard = ({ className, status, teamName, isActive }) => {
  return (
    <div
      className={`${className} bg-gray-main rounded-full p-3 px-5 text-white font-bold flex justify-between`}
    >
      <h4 className="text-h4 flex items-center">
        {teamName ? teamName : "Team name"}
      </h4>
      <div className="status bg-darkgray-main p-2 px-4 rounded-full">
        <p className="text-small">{status ? status : "Status"}</p>
      </div>
    </div>
  );
};

export default TeamCard;
