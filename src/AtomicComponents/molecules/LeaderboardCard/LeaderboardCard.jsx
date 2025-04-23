import PropTypes from "prop-types";

const LeaderboardCard = ({ type, data }) => {
  const content = data?.content || [];

  return (
    <div className="bg-white shadow-md mb-6 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-bold text-xl">
          {type === "tournament" ? "Tournament Leaderboard" : "Round Leaderboard"}
        </h2>
        {data?.round_id && (
          <span className="text-gray-500 text-sm">Round ID: {data.round_id}</span>
        )}
      </div>

      <p className="mb-4 text-gray-500 text-sm">
        Finish Type: {data?.finish_type || "Unknown"}
      </p>

      {content.length === 0 ? (
        <p className="text-muted-foreground">No teams found in leaderboard.</p>
      ) : (
        <div className="space-y-3">
          {content
            .sort((a, b) => a.ranking - b.ranking)
            .map((entry) => (
              <div
                key={`${entry.team_id}-${entry.ranking}`}
                className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 p-3 border rounded-md transition"
              >
                <div className="font-semibold text-lg">#{entry.ranking}</div>
                <div className="flex-1 ml-4">
                  {/* <div className="font-medium">Team ID: {entry.team_id}</div> */}
                  <div className="font-medium">{entry.team_name}</div>
                  <div className="text-gray-500 text-sm">
                    Date: {entry.created_date}
                  </div>
                </div>
                <div className="font-semibold text-blue-600 text-sm">
                  {entry.team_score} pts
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

LeaderboardCard.propTypes = {
  type: PropTypes.oneOf(["tournament", "round"]).isRequired,
  data: PropTypes.shape({
    round_id: PropTypes.number,
    finish_type: PropTypes.string,
    content: PropTypes.arrayOf(
      PropTypes.shape({
        leaderboard_id: PropTypes.number,
        ranking: PropTypes.number,
        team_score: PropTypes.number,
        created_date: PropTypes.string,
        team_id: PropTypes.number,
      })
    ),
  }).isRequired,
};

export default LeaderboardCard;
