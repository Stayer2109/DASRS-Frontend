import {
  Collapsible,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { useRef } from "react";
import { useState, useEffect } from "react"; // Import useState and useEffect
import { apiClient } from "./../../../../config/axios/axios";
import Toast from "../../Toaster/Toaster";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

const TournamentLeaderboardCard = ({ type, tournamentData }) => {
  //#region VARIABLE DECLARATIONS
  const tournament = tournamentData;
  const tournamenntContent = tournamentData?.content || [];
  const [openRound, setOpenRound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamLeaderboard, setTeamLeaderboard] = useState(null);

  // MODAL CONTROLLERS
  const [teamLeaderboardShow, setTeamLeaderboardShow] = useState(false);
  //#endregion

  // HELPER FUNCTION TO GET RANKING COLOR
  const getRankingStyle = (ranking) => {
    if (ranking === 1) return "text-yellow-500 font-bold text-2xl";
    if (ranking === 2) return "text-gray-400 font-bold text-xl";
    if (ranking === 3) return "text-amber-600 font-bold text-lg";
    return "text-gray-800"; // Default color for other rankings
  };

  const getRankingStyleModal = (ranking) => {
    switch (ranking) {
      case 1:
        return "text-yellow-600 font-bold"; // 1st place
      case 2:
        return "text-slate-600 font-bold"; // 2nd place
      case 3:
        return "text-amber-600 font-bold"; // 3rd place
      default:
        return "text-gray-700 font-semibold"; // others
    }
  };

  // HANDLE TOGGLE ROUND CARD
  const handleToggle = (index) => {
    // Toggle the selected round, open if closed, close if opened
    setOpenRound(openRound === index ? null : index);
  };

  // HANDLE SELECT TEAM
  const handleSelectTeam = (team) => {
    // Set the selected team ID
    setSelectedTeam(team);
  };

  // FETCH TEAM LEADERBOARD
  const fetchTeamLeaderboard = async (teamId) => {
    try {
      setIsLoading(true); // Set loading state to true
      const respone = await apiClient.get(`leaderboards/team/${teamId}`);

      if (respone.data.http_status === 200) {
        const data = respone.data.data;
        setTeamLeaderboard(data); // Set the team leaderboard data
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  //#region MODAL CONTROLLERS
  const handleShowTeamLeaderboard = () => {
    setTeamLeaderboardShow(true); // Show the team leaderboard modal
  };

  const handleCloseTeamLeaderboard = () => {
    setTeamLeaderboardShow(false); // Close the team leaderboard modal
    setTimeout(() => {
      setSelectedTeam(null); // Reset selected team ID
      setTeamLeaderboard(null); // Reset team leaderboard data
    }, 350);
  };
  //#endregion

  //#region USEEFFECTS
  // RESET COLLAPSIBLE STATE ON TOURNAMENT DATA CHANGE
  useEffect(() => {
    setOpenRound(null); // Close all collapsibles when tournamentData changes
  }, [tournamentData]);

  useEffect(() => {
    if (selectedTeam) fetchTeamLeaderboard(selectedTeam?.team_id); // Fetch leaderboard for the selected team
  }, [selectedTeam]);

  useEffect(() => {
    if (teamLeaderboard) {
      handleShowTeamLeaderboard(); // Show the modal when team leaderboard data is available
    }
  }, [teamLeaderboard]);
  //#endregion

  return (
    <>
      {isLoading && <Spinner />}

      <div className="bg-white shadow-md mb-6 p-4 rounded-lg">
        {type === "tournament" ? (
          <>
            <div className="flex flex-col mb-2">
              <h2 className="font-bold text-xl">Tournament Leaderboard</h2>
              <h4 className="font-semibold text-md">
                {tournament?.tournament_name}
              </h4>
            </div>

            <div className="flex flex-col gap-2">
              <>
                {tournamenntContent.length === 0 ? (
                  <div className="flex flex-col mb-2">
                    <h4 className="font-semibold text-md">
                      No rounds available for this tournament.
                    </h4>
                  </div>
                ) : (
                  tournamenntContent.map((round, index) => {
                    const isOpen = openRound === index; // Check if round is opened

                    // Sort the leaderboard entries by ranking ascly
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

                        {/* Motion */}
                        <AnimatePresence initial={false}>
                          <AutoHeightMotionDiv isOpen={isOpen}>
                            <div className="text-gray-600 text-sm">
                              <p className="mt-2">
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
                                  <div className="font-semibold text-gray-400 italic">
                                    No leaderboard entries available.
                                  </div>
                                ) : (
                                  sortedLeaderboard?.map((entry) => (
                                    <div
                                      key={entry?.leaderboard_id}
                                      className="flex justify-between items-center bg-white shadow-sm mt-1 p-4 border rounded-lg"
                                    >
                                      <div className="flex items-center">
                                        <div
                                          className={`mr-2 font-medium ${getRankingStyle(
                                            entry?.ranking
                                          )}`}
                                        >
                                          #{entry?.ranking}
                                        </div>
                                        <div
                                          className="font-semibold hover:text-blue-500 text-lg cursor-pointer"
                                          onClick={() =>
                                            handleSelectTeam(entry)
                                          }
                                        >
                                          {entry?.team_name}
                                          {entry?.team_tag && (
                                            <span className="ml-2 text-gray-500">
                                              ({entry?.team_tag})
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="font-semibold text-blue-600">
                                        {entry?.team_score || "N/A"} pts
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
                                      Team:{" "}
                                      {round?.fastest_lap_time.team_name ||
                                        "N/A"}
                                    </p>
                                    {round?.fastest_lap_time.team_tag && (
                                      <span className="text-xs">
                                        ({round?.fastest_lap_time.team_tag})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-blue-600">
                                    Time:{" "}
                                    {round?.fastest_lap_time.lap_time || "N/A"}
                                  </p>
                                </div>
                              </div>

                              <div className="bg-gray-100 mt-2 p-4 rounded-lg">
                                <h5 className="font-semibold text-md">
                                  MVP - Top Speed
                                </h5>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center gap-1">
                                    <p className="text-gray-800">
                                      Team:{" "}
                                      {round?.top_speed.team_name || "N/A"}
                                    </p>
                                    {round?.top_speed.team_tag && (
                                      <span className="text-xs">
                                        ({round?.top_speed.team_tag || "N/A"})
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-blue-600">
                                    Speed: {round?.top_speed.speed || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </AutoHeightMotionDiv>
                        </AnimatePresence>
                      </Collapsible>
                    );
                  })
                )}
              </>
            </div>
          </>
        ) : null}
      </div>

      {/* Team Leaderboard Modal */}
      <Modal
        size="sm"
        show={teamLeaderboardShow}
        onHide={handleCloseTeamLeaderboard}
      >
        <Modal.Header content={"Team Leaderboard"} />

        <Modal.Body>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Spinner />
            </div>
          ) : teamLeaderboard?.length > 0 ? (
            <div className="flex flex-col gap-3">
              <h1 className="mb-2 font-semibold text-gray-800 text-2xl text-center">
                {selectedTeam?.team_name} detailed leaderboard
              </h1>
              {[...teamLeaderboard]
                .sort((a, b) => a.ranking - b.ranking)
                .map((entry) => (
                  <motion.div
                    key={entry.leaderboard_id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col gap-1 bg-gray-50 shadow-sm p-4 border rounded-lg text-sm"
                  >
                    <p>
                      <strong>Tournament:</strong>{" "}
                      {entry.tournament_name || "N/A"}
                    </p>
                    <p>
                      <strong>Round:</strong> {entry.round_name || "N/A"}
                    </p>
                    <p>
                      <strong>Ranking: </strong>
                      <span
                        className={`${getRankingStyleModal(entry?.ranking)}`}
                      >
                        #{entry.ranking ?? "N/A"}
                      </span>
                    </p>

                    <p>
                      <strong>Score:</strong> {entry.team_score ?? "N/A"} pts
                    </p>
                  </motion.div>
                ))}
            </div>
          ) : (
            <div className="py-6 text-gray-400 text-center italic">
              No leaderboard data available for this team.
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TournamentLeaderboardCard;

// AUTOMATIC HEIGHT MOTION DIV
const AutoHeightMotionDiv = ({ isOpen, children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [isOpen, children]); // remeasure when open or content changes

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: isOpen ? height : 0, opacity: isOpen ? 1 : 0 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      <div ref={ref}>{children}</div>
    </motion.div>
  );
};

TournamentLeaderboardCard.propTypes = {
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
        team_tag: PropTypes.string,
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

AutoHeightMotionDiv.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
