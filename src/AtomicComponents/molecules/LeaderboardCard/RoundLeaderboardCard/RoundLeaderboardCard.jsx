import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";
import PropTypes from "prop-types";

const RoundLeaderboardCard = ({ roundData, isForEachRound = false }) => {
  const round = roundData;
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  const getRankingStyle = (ranking) => {
    if (ranking === 1) return "text-yellow-500 font-extrabold text-2xl";
    if (ranking === 2) return "text-gray-400 font-bold text-xl";
    if (ranking === 3) return "text-amber-600 font-semibold text-lg";
    return "text-slate-800 font-medium";
  };

  const toggleTeamExpand = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  return isForEachRound ? (
    // For each round - Display for each round in tournament
    <div className="space-y-6">
      {round?.leaderboard_list?.length === 0 ? (
        <div className="text-gray-400 italic">
          No leaderboard entries available.
        </div>
      ) : (
        round?.leaderboard_list
          .slice()
          .sort((a, b) => a.ranking - b.ranking)
          .map((entry) => (
            <div
              key={entry.leaderboard_id}
              className="bg-white shadow-md p-4 border border-gray-200 rounded-xl"
            >
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => toggleTeamExpand(entry.team_id)}
              >
                <h3 className="font-semibold text-gray-700 text-lg">
                  <span className={`${getRankingStyle(entry.ranking)} mr-2`}>
                    #{entry.ranking}
                  </span>
                  {entry.team_name || "N/A"}{" "}
                  <span className="text-gray-400">
                    ({entry.team_tag || "N/A"})
                  </span>
                </h3>
                {expandedTeamId === entry.team_id ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </div>
              <p className="mt-1 text-gray-500 text-sm">
                Score:{" "}
                <span className="font-medium text-blue-600">
                  {entry.team_score?.toFixed(2) ?? "N/A"} pts
                </span>
              </p>

              <AnimatePresence>
                {expandedTeamId === entry.team_id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 mt-4"
                  >
                    {entry.match_list?.length > 0 ? (
                      entry.match_list.map((match) => (
                        <div
                          key={match.match_id}
                          className="bg-gray-50 p-4 border border-gray-400 rounded-lg"
                        >
                          <div className="mb-1 font-semibold text-gray-700">
                            {match.match_name}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Type: {match.match_type}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Form: {match.match_form}
                          </div>
                          <div className="text-gray-500 text-sm">
                            Score: {match.match_score ?? "N/A"}
                          </div>
                          {match.player_list?.length > 0 ? (
                            <ul className="mt-2 pl-5 text-gray-600 text-sm list-disc">
                              {match.player_list.map((player, idx) => (
                                <li key={idx}>
                                  {player.player_name || "N/A"} – Score:{" "}
                                  {player.score ?? "N/A"}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mt-2 text-gray-400 text-sm italic">
                              No player data available
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No matches available
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
      )}

      <div className="gap-4 grid md:grid-cols-2 mt-6">
        {/* Fastest Lap */}
        <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
          <h4 className="mb-1 font-semibold text-blue-800">
            🏁 MVP - Fastest Lap
          </h4>
          <p className="text-gray-700 text-sm">
            Team: {round?.fastest_lap_time?.team_name || "N/A"} (
            {round?.fastest_lap_time?.team_tag || "N/A"})
          </p>
          <p className="text-blue-600 text-sm">
            Lap Time: {round?.fastest_lap_time?.lap_time?.toFixed(3) || "N/A"}s
          </p>
        </div>

        {/* Top Speed */}
        <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
          <h4 className="mb-1 font-semibold text-green-800">
            🚀 MVP - Top Speed
          </h4>
          <p className="text-gray-700 text-sm">
            Team: {round?.top_speed?.team_name || "N/A"} (
            {round?.top_speed?.team_tag || "N/A"})
          </p>
          <p className="text-green-600 text-sm">
            Speed: {round?.top_speed?.speed?.toFixed(2) || "N/A"} km/h
          </p>
        </div>
      </div>
    </div>
  ) : (
    // Is Not For Each Round - Display for leaderboards
    <div className="bg-white shadow-lg mb-8 p-6 border border-gray-100 rounded-2xl">
      <div className="mb-6">
        <h2 className="mb-1 font-bold text-gray-800 text-2xl">
          🏆 Round Leaderboard
        </h2>
        <p className="text-gray-600 text-sm">
          {round?.round_name || "Unnamed Round"}
        </p>
      </div>

      <div className="space-y-6">
        {round?.leaderboard_list?.length === 0 ? (
          <div className="text-gray-400 italic">
            No leaderboard entries available.
          </div>
        ) : (
          round.leaderboard_list
            .slice()
            .sort((a, b) => a.ranking - b.ranking)
            .map((entry) => (
              <div
                key={entry.leaderboard_id}
                className="bg-white shadow-md p-4 border border-gray-200 rounded-xl"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleTeamExpand(entry.team_id)}
                >
                  <h3 className="font-semibold text-gray-700 text-lg">
                    <span className={`${getRankingStyle(entry.ranking)} mr-2`}>
                      #{entry.ranking}
                    </span>
                    {entry.team_name || "N/A"}{" "}
                    <span className="text-gray-400">
                      ({entry.team_tag || "N/A"})
                    </span>
                  </h3>
                  {expandedTeamId === entry.team_id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </div>
                <p className="mt-1 text-gray-500 text-sm">
                  Score:{" "}
                  <span className="font-medium text-blue-600">
                    {entry.team_score?.toFixed(2) ?? "N/A"} pts
                  </span>
                </p>

                <AnimatePresence>
                  {expandedTeamId === entry.team_id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-3 mt-4"
                    >
                      {entry.match_list?.length > 0 ? (
                        entry.match_list.map((match) => (
                          <div
                            key={match.match_id}
                            className="bg-gray-50 p-4 border border-gray-400 rounded-lg"
                          >
                            <div className="mb-1 font-semibold text-gray-700">
                              {match.match_name}
                            </div>
                            <div className="text-gray-500 text-sm">
                              Type: {match.match_type}
                            </div>
                            <div className="text-gray-500 text-sm">
                              Form: {match.match_form}
                            </div>
                            <div className="text-gray-500 text-sm">
                              Score: {match.match_score ?? "N/A"}
                            </div>
                            {match.player_list?.length > 0 ? (
                              <ul className="mt-2 pl-5 text-gray-600 text-sm list-disc">
                                {match.player_list.map((player, idx) => (
                                  <li key={idx}>
                                    {player.player_name || "N/A"} – Score:{" "}
                                    {player.score ?? "N/A"}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="mt-2 text-gray-400 text-sm italic">
                                No player data available
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm italic">
                          No matches available
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
        )}

        <div className="gap-4 grid md:grid-cols-2 mt-6">
          {/* Fastest Lap */}
          <div className="bg-blue-50 p-4 border border-blue-200 rounded-lg">
            <h4 className="mb-1 font-semibold text-blue-800">
              🏁 MVP - Fastest Lap
            </h4>
            <p className="text-gray-700 text-sm">
              Team: {round?.fastest_lap_time?.team_name || "N/A"} (
              {round?.fastest_lap_time?.team_tag || "N/A"})
            </p>
            <p className="text-blue-600 text-sm">
              Lap Time: {round?.fastest_lap_time?.lap_time?.toFixed(3) || "N/A"}
              s
            </p>
          </div>

          {/* Top Speed */}
          <div className="bg-green-50 p-4 border border-green-200 rounded-lg">
            <h4 className="mb-1 font-semibold text-green-800">
              🚀 MVP - Top Speed
            </h4>
            <p className="text-gray-700 text-sm">
              Team: {round?.top_speed?.team_name || "N/A"} (
              {round?.top_speed?.team_tag || "N/A"})
            </p>
            <p className="text-green-600 text-sm">
              Speed: {round?.top_speed?.speed?.toFixed(2) || "N/A"} km/h
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundLeaderboardCard;

RoundLeaderboardCard.propTypes = {
  roundData: PropTypes.shape({
    round_name: PropTypes.string,
    finish_type: PropTypes.string,
    fastest_lap_time: PropTypes.object,
    top_speed: PropTypes.object,
    leaderboard_list: PropTypes.arrayOf(
      PropTypes.shape({
        leaderboard_id: PropTypes.number,
        ranking: PropTypes.number,
        team_score: PropTypes.number,
        team_id: PropTypes.number,
        team_name: PropTypes.string,
        team_tag: PropTypes.string,
        match_list: PropTypes.arrayOf(
          PropTypes.shape({
            match_id: PropTypes.number,
            match_name: PropTypes.string,
            match_type: PropTypes.string,
            match_score: PropTypes.number,
            match_form: PropTypes.string,
            player_list: PropTypes.arrayOf(
              PropTypes.shape({
                player_id: PropTypes.string,
                player_name: PropTypes.string,
                score: PropTypes.number,
              })
            ),
          })
        ),
      })
    ),
  }).isRequired,
  isForEachRound: PropTypes.bool,
};
