import {
  Collapsible,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { useState, useEffect } from "react"; // Import useState and useEffect

const LeaderboardCard = ({ type, tournamentData }) => {
  const tournament = tournamentData;
  const tournamenntContent = tournamentData?.content || [];
  const [openRound, setOpenRound] = useState(null); // Track the open state for each round by its index

  // Reset collapsible state when tournamentData changes
  useEffect(() => {
    setOpenRound(null); // Close all collapsibles when tournamentData changes
  }, [tournamentData]);

  const handleToggle = (index) => {
    // Toggle the selected round, open if closed, close if opened
    setOpenRound(openRound === index ? null : index);
  };

  // Helper function to return the appropriate color for rankings
  const getRankingColor = (ranking) => {
    if (ranking === 1) return "text-yellow-500 font-bold text-2xl"; // Gold for 1st place
    if (ranking === 2) return "text-gray-400 font-bold text-xl"; //   Silver for 2nd place
    if (ranking === 3) return "text-amber-600 font-bold text-lg"; // Bronze for 3rd place
    return "text-gray-800"; // Default color for other rankings
  };

  return (
    <div className="bg-white shadow-md mb-6 p-4 rounded-lg">
      {type === "tournament" ? (
        <>
          <div className="flex flex-col mb-2">
            <h2 className="font-bold text-xl">Tournament Leaderboard</h2>
            <h4 className="font-semibold text-md">
              {tournament?.tournament_name}
            </h4>
          </div>

          {tournamenntContent.length === 0 ? (
            <div className="flex flex-col mb-2">
              <h4 className="font-semibold text-md">
                No rounds available for this tournament.
              </h4>
            </div>
          ) : (
            tournamenntContent.map((round, index) => {
              const isOpen = openRound === index; // Determine if this round is open

              // Sort the leaderboard entries by ranking (ascending order)
              const sortedLeaderboard = round?.content?.sort(
                (a, b) => a.ranking - b.ranking
              );

              return (
                <Collapsible
                  key={index}
                  open={isOpen}
                  onOpenChange={() => handleToggle(index)}
                  className="mb-2"
                >
                  <div
                    className="flex justify-between items-center bg-gray-100 p-2 rounded-t-md"
                    onClick={() => handleToggle(index)}
                  >
                    <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm cursor-pointer">
                      <h4 className="font-semibold text-md">
                        {round?.round_name}
                      </h4>
                      {/* Display the appropriate icon */}
                      {isOpen ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </CollapsibleTrigger>
                  </div>

                  {/* Content is now tightly wrapped inside the collapsible */}
                  <CollapsibleContent className="bg-gray-50 px-4 pt-2 pb-2 border-gray-200 border-t-2 rounded-b-md">
                    <div className="text-gray-600 text-sm">
                      <p>
                        <strong>Description:</strong>{" "}
                        {round?.description || "N/A"}
                      </p>
                      <p>
                        <strong>Finish Type:</strong>{" "}
                        {round?.finish_type || "N/A"}
                      </p>

                      <h5 className="mt-3 font-semibold text-md">
                        Leaderboard:
                      </h5>
                      <div className="space-y-4">
                        {/* Render each team as a card */}
                        {sortedLeaderboard?.length === 0 ? (
                          <div className="text-gray-500">
                            No leaderboard entries available.
                          </div>
                        ) : (
                          sortedLeaderboard?.map((entry) => (
                            <div
                              key={entry.leaderboard_id}
                              className="flex justify-between items-center bg-white shadow-sm mt-1 p-4 border rounded-lg"
                            >
                              <div className="flex items-center">
                                <div
                                  className={`mr-2 font-medium ${getRankingColor(
                                    entry.ranking
                                  )}`}
                                >
                                  #{entry.ranking}
                                </div>
                                <div className="font-semibold text-lg">
                                  Team: {entry.team_name}
                                  {entry.team_tag && (
                                    <span className="ml-2 text-gray-500">
                                      ({entry.team_tag})
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="font-semibold text-blue-600">
                                {entry.team_score || "N/A"} pts
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Display MVP and additional stats (Fastest Lap Time and Top Speed) */}
                      <div className="bg-gray-100 mt-4 p-4 rounded-lg">
                        <h5 className="font-semibold text-md">
                          MVP - Fastest Lap
                        </h5>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <p className="text-gray-800">
                              Team: {round.fastest_lap_time.team_name || "N/A"}
                            </p>
                            {round.fastest_lap_time.team_tag && (
                              <span className="text-xs">
                                ({round.fastest_lap_time.team_tag})
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600">
                            Time: {round.fastest_lap_time.lap_time || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-gray-100 mt-4 p-4 rounded-lg">
                        <h5 className="font-semibold text-md">
                          MVP - Top Speed
                        </h5>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1">
                            <p className="text-gray-800">
                              Team: {round.top_speed.team_name || "N/A"}
                            </p>
                            {round.top_speed.team_tag && (
                              <span className="text-xs">
                                ({round.top_speed.team_tag || "N/A"})
                              </span>
                            )}
                          </div>
                          <p className="text-blue-600">
                            Speed: {round.top_speed.speed || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              );
            })
          )}
        </>
      ) : null}
    </div>
  );
};

LeaderboardCard.propTypes = {
  type: PropTypes.oneOf(["tournament", "round"]).isRequired,
  tournamentData: PropTypes.shape({
    tournament_id: PropTypes.number.isRequired,
    tournament_name: PropTypes.string.isRequired,
    round_id: PropTypes.number,
    round_name: PropTypes.string,
    description: PropTypes.string,
    finish_type: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        leaderboard_id: PropTypes.number,
        ranking: PropTypes.number,
        team_score: PropTypes.number,
        created_date: PropTypes.string,
        team_name: PropTypes.string,
        team_tag: PropTypes.string, // Added team_tag as a required prop
        fastest_lap_time: PropTypes.shape({
          lap_time: PropTypes.string,
          team_name: PropTypes.string,
        }),
        top_speed: PropTypes.shape({
          speed: PropTypes.string,
          team_name: PropTypes.string,
        }),
      })
    ),
    last: PropTypes.bool,
    page_no: PropTypes.number,
    page_size: PropTypes.number,
    total_elements: PropTypes.number,
    total_pages: PropTypes.number,
  }).isRequired,
};

export default LeaderboardCard;
