import {
  Collapsible,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";
import { useRef, useEffect, useState } from "react";
import { apiClient } from "./../../../../config/axios/axios";
import Toast from "../../Toaster/Toaster";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

const TournamentLeaderboardCard = ({ tournamentData }) => {
  const tournament = tournamentData;
  const tournamenntContent = tournamentData?.content || [];
  const [openRound, setOpenRound] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [teamLeaderboard, setTeamLeaderboard] = useState(null);
  const [teamLeaderboardShow, setTeamLeaderboardShow] = useState(false);

  const getRankingStyle = (ranking) => {
    if (ranking === 1) return "text-yellow-500 font-extrabold text-2xl";
    if (ranking === 2) return "text-gray-400 font-bold text-xl";
    if (ranking === 3) return "text-amber-600 font-semibold text-lg";
    return "text-slate-800 font-medium";
  };

  const getRankingStyleModal = (ranking) => {
    switch (ranking) {
      case 1:
        return "text-yellow-600 font-bold";
      case 2:
        return "text-slate-600 font-bold";
      case 3:
        return "text-amber-600 font-bold";
      default:
        return "text-gray-700 font-semibold";
    }
  };

  const handleToggle = (index) => {
    setOpenRound(openRound === index ? null : index);
  };

  const handleSelectTeam = (team) => {
    setSelectedTeam(team);
  };

  const fetchTeamLeaderboard = async (teamId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`leaderboards/team/${teamId}`);
      if (response.data.http_status === 200) {
        setTeamLeaderboard(response.data.data);
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowTeamLeaderboard = () => setTeamLeaderboardShow(true);

  const handleCloseTeamLeaderboard = () => {
    setTeamLeaderboardShow(false);
    setTimeout(() => {
      setSelectedTeam(null);
      setTeamLeaderboard(null);
    }, 350);
  };

  useEffect(() => setOpenRound(null), [tournamentData]);
  useEffect(() => {
    if (selectedTeam) fetchTeamLeaderboard(selectedTeam?.team_id);
  }, [selectedTeam]);
  useEffect(() => {
    if (teamLeaderboard) handleShowTeamLeaderboard();
  }, [teamLeaderboard]);

  return (
    <>
      {isLoading && <Spinner />}
      <div className="bg-white shadow-lg mb-8 p-6 border border-gray-200 rounded-2xl">
        <div className="mb-6">
          <h2 className="mb-1 font-bold text-gray-800 text-2xl">
            📊 Tournament Leaderboard
          </h2>
          <p className="text-gray-600 text-sm">{tournament?.tournament_name}</p>
        </div>

        {tournamenntContent.length === 0 ? (
          <div className="text-gray-400 italic">
            No rounds available for this tournament.
          </div>
        ) : (
          tournamenntContent.map((round, index) => {
            const isOpen = openRound === index;
            const sortedLeaderboard = round?.content
              ?.slice()
              .sort((a, b) => a.ranking - b.ranking);
            return (
              <Collapsible
                key={index}
                open={isOpen}
                onOpenChange={() => handleToggle(index)}
                className="mb-3"
              >
                <div
                  className="flex justify-between items-center bg-gray-200 p-3 rounded-t-md cursor-pointer"
                  onClick={() => handleToggle(index)}
                >
                  <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-700 text-sm cursor-pointer">
                    <h4 className="font-semibold text-md">
                      {round?.round_name}
                    </h4>
                    {isOpen ? (
                      <ChevronUp size={18} />
                    ) : (
                      <ChevronDown size={18} />
                    )}
                  </CollapsibleTrigger>
                </div>

                <AnimatePresence initial={false}>
                  <AutoHeightMotionDiv isOpen={isOpen}>
                    <div className="p-5 border border-gray-200 rounded-b-xl">
                      <p className="mb-1 text-gray-600 text-sm">
                        <strong>Description:</strong>{" "}
                        {round?.description || "N/A"}
                      </p>
                      <p className="mb-4 text-gray-600 text-sm">
                        <strong>Finish Type:</strong>{" "}
                        {round?.finish_type || "N/A"}
                      </p>
                      <div className="space-y-4">
                        {sortedLeaderboard?.length === 0 ? (
                          <p className="text-gray-400 italic">
                            No leaderboard entries available.
                          </p>
                        ) : (
                          sortedLeaderboard.map((entry) => (
                            <div
                              key={entry?.leaderboard_id}
                              className="flex justify-between items-center bg-gray-50 p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className={`${getRankingStyle(
                                    entry?.ranking
                                  )}`}
                                >
                                  #{entry?.ranking}
                                </span>
                                <span
                                  onClick={() => handleSelectTeam(entry)}
                                  className="font-medium hover:text-blue-600 text-lg cursor-pointer"
                                >
                                  {entry?.team_name || "N/A"}
                                  {entry?.team_tag && (
                                    <span className="ml-1 text-gray-400">
                                      ({entry?.team_tag})
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className="font-semibold text-blue-600">
                                {entry?.team_score ?? "N/A"} pts
                              </div>
                            </div>
                          ))
                        )}

                        <div className="gap-4 grid sm:grid-cols-2 pt-4">
                          <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
                            <h5 className="mb-1 font-semibold text-blue-800">
                              🏁 MVP - Fastest Lap
                            </h5>
                            <p className="text-gray-700 text-sm">
                              Team:{" "}
                              {round?.fastest_lap_time?.team_name || "N/A"} (
                              {round?.fastest_lap_time?.team_tag || "N/A"})
                            </p>
                            <p className="text-blue-600 text-sm">
                              Time: {round?.fastest_lap_time?.lap_time ?? "N/A"}
                            </p>
                          </div>
                          <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
                            <h5 className="mb-1 font-semibold text-green-800">
                              🚀 MVP - Top Speed
                            </h5>
                            <p className="text-gray-700 text-sm">
                              Team: {round?.top_speed?.team_name || "N/A"} (
                              {round?.top_speed?.team_tag || "N/A"})
                            </p>
                            <p className="text-green-600 text-sm">
                              Speed: {round?.top_speed?.speed ?? "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AutoHeightMotionDiv>
                </AnimatePresence>
              </Collapsible>
            );
          })
        )}
      </div>

      <Modal
        size="sm"
        show={teamLeaderboardShow}
        onHide={handleCloseTeamLeaderboard}
      >
        <Modal.Header content="Team Leaderboard" />
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
                    className="bg-gray-50 shadow-sm p-4 border rounded-lg text-sm"
                  >
                    <p>
                      <strong>Tournament:</strong>{" "}
                      {entry.tournament_name || "N/A"}
                    </p>
                    <p>
                      <strong>Round:</strong> {entry.round_name || "N/A"}
                    </p>
                    <p>
                      <strong>Ranking:</strong>{" "}
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

const AutoHeightMotionDiv = ({ isOpen, children }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);
  useEffect(() => {
    if (ref.current) setHeight(ref.current.scrollHeight);
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

TournamentLeaderboardCard.propTypes = {
  tournamentData: PropTypes.shape({
    tournament_id: PropTypes.number.isRequired,
    tournament_name: PropTypes.string.isRequired,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        round_name: PropTypes.string,
        description: PropTypes.string,
        finish_type: PropTypes.string,
        content: PropTypes.arrayOf(
          PropTypes.shape({
            leaderboard_id: PropTypes.number,
            ranking: PropTypes.number,
            team_score: PropTypes.number,
            team_name: PropTypes.string,
            team_tag: PropTypes.string,
          })
        ),
        fastest_lap_time: PropTypes.shape({
          lap_time: PropTypes.string,
          team_name: PropTypes.string,
          team_tag: PropTypes.string,
        }),
        top_speed: PropTypes.shape({
          speed: PropTypes.string,
          team_name: PropTypes.string,
          team_tag: PropTypes.string,
        }),
      })
    ),
  }).isRequired,
};

AutoHeightMotionDiv.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};
