import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { ChevronDown } from "lucide-react";
import PropTypes from "prop-types";
import apiClient from "@/config/axios/axios";
import Toast from "../../Toaster/Toaster";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

const RoundLeaderboardCard = ({ roundData }) => {
  //#region VARIABLE DECLARATIONS
  const matchList = roundData?.match_list || [];
  const [openMatch, setOpenMatch] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamLeaderboard, setTeamLeaderboard] = useState(null);

  // MODAL CONTROLLERS
  const [teamLeaderboardShow, setTeamLeaderboardShow] = useState(false);
  //#endregion

  // GET STATUS STYLE
  const getStatusStyle = (status) => {
    const normalized = (status || "").toString().toUpperCase();
    switch (normalized) {
      case "PENDING":
        return "text-yellow-500 font-semibold";
      case "FINISHED":
        return "text-green-500 font-semibold";
      case "TERMINATED":
        return "text-red-500 font-semibold";
      default:
        return "text-gray-500 font-medium"; // fallback style
    }
  };

  // GET RANKING STYLE FOR MODAL
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

  // HANDLE TOGGLE OPENN STATE OF MATCH
  const handleToggle = (index) => {
    setOpenMatch(openMatch === index ? null : index);
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
  // RESET STATE ON ROUND DATA CHANGE
  useEffect(() => {
    setOpenMatch(null);
  }, [roundData]);

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
        <div className="flex flex-col mb-2">
          <h2 className="font-bold text-xl">Round Leaderboard</h2>
          <h4 className="font-semibold text-md">{roundData?.round_name}</h4>
          <p className="text-gray-600 text-sm">{roundData?.description}</p>
        </div>

        {matchList.length === 0 ? (
          <div className="flex flex-col mb-2">
            <h4 className="font-semibold text-md">
              No matches available for this round.
            </h4>
          </div>
        ) : (
          matchList.map((match, index) => {
            const isOpen = openMatch === index;

            return (
              <div key={match?.match_id} className="mb-2">
                <div
                  className="flex justify-between items-center bg-gray-100 p-2 rounded-t-md cursor-pointer"
                  onClick={() => handleToggle(index)}
                >
                  <div className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm">
                    <h4 className="font-semibold text-md">
                      {match?.match_name}
                    </h4>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown size={16} />
                    </motion.div>
                  </div>
                </div>

                {/* Motion */}
                <AnimatePresence initial={false}>
                  <AutoHeightMotionDiv isOpen={isOpen}>
                    <div className="flex flex-col gap-1.5 bg-gray-50 px-4 pt-2 pb-2 border-gray-200 border-t-2 rounded-b-md text-gray-600 text-sm">
                      <p>
                        <strong>Match Code:</strong>{" "}
                        {match?.match_code || "N/A"}
                      </p>
                      <p>
                        <strong>Start Time:</strong>{" "}
                        {match?.time_start || "N/A"}
                      </p>
                      <p>
                        <strong>End Time:</strong> {match?.time_end || "N/A"}
                      </p>
                      <p>
                        <strong>Match Form:</strong>{" "}
                        {match?.match_form || "N/A"}
                      </p>
                      <p>
                        <strong>Status:</strong>{" "}
                        <span className={getStatusStyle(match?.status)}>
                          {match?.status
                            ? match.status.toString().toUpperCase()
                            : "N/A"}
                        </span>
                      </p>

                      {/* Render teams if available */}
                      <div className="mt-2">
                        <h5 className="mb-2 font-semibold text-md">Teams:</h5>

                        {match?.teams &&
                        Array.isArray(match?.teams) &&
                        match?.teams.length > 0 ? (
                          <div className="space-y-2">
                            {match.teams.map((team) => (
                              <div
                                key={team.team_id}
                                className="flex justify-between items-center bg-white shadow-sm p-3 border rounded-lg"
                              >
                                <div
                                  className="flex items-center gap-2 hover:text-blue-500 cursor-pointer"
                                  onClick={() => handleSelectTeam(team)}
                                >
                                  <p className="font-semibold">
                                    {team?.team_name}
                                  </p>
                                  {team?.team_tag && (
                                    <span className="text-gray-500 text-xs">
                                      ({team?.team_tag})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="font-semibold text-gray-400 italic">
                            There are no teams in this match.
                          </p>
                        )}
                      </div>
                    </div>
                  </AutoHeightMotionDiv>
                </AnimatePresence>
              </div>
            );
          })
        )}
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

export default RoundLeaderboardCard;

// AutoHeightMotionDiv - for smooth expand/collapse
const AutoHeightMotionDiv = ({ isOpen, children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.scrollHeight);
    }
  }, [isOpen, children]);

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

AutoHeightMotionDiv.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

RoundLeaderboardCard.propTypes = {
  roundData: PropTypes.shape({
    round_name: PropTypes.string,
    description: PropTypes.string,
    match_list: PropTypes.arrayOf(
      PropTypes.shape({
        match_id: PropTypes.number,
        match_name: PropTypes.string,
        match_code: PropTypes.string,
        match_form: PropTypes.string,
        time_start: PropTypes.string,
        time_end: PropTypes.string,
        status: PropTypes.string,
        teams: PropTypes.arrayOf(
          PropTypes.shape({
            team_id: PropTypes.number,
            team_name: PropTypes.string,
            team_tag: PropTypes.string,
            account_id: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
};
