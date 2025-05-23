import {
  Card,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import PropTypes from "prop-types";

const statusClass = (status) => {
  switch (status?.toString().toUpperCase()) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const ComplaintCard = ({ complaint, onClick, mode = "organizer" }) => {
  return (
    <Card
      className="shadow-md hover:shadow-lg py-4 border border-gray-300 w-full hover:scale-[1.01] transition-transform duration-150 ease-in-out cursor-pointer"
      onClick={onClick}
    >
      {mode.toString().toLocaleLowerCase() === "organizer" ? (
        <CardHeader className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-start w-full">
            <CardTitle className="font-semibold text-gray-800 text-lg break-words whitespace-normal">
              {complaint?.title}
            </CardTitle>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${statusClass(
                complaint?.status
              )}`}
            >
              {complaint?.status}
            </span>
          </div>

          <div className="flex flex-col gap-1 bg-gray-50 px-3 py-2 rounded-md w-full text-muted-foreground text-sm">
            <div className="flex gap-1">
              <span className="font-medium">
                <strong>Team:</strong>
              </span>
              <span className="truncate">{complaint?.team_name || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-medium">
                <strong>Match:</strong>
              </span>
              <span className="truncate">{complaint?.match_name || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <strong className="font-medium">
                <strong>Your reply:</strong>
              </strong>
              <span className="truncate">{complaint?.reply || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <span
                className={`font-semibold
                    ${
                      complaint?.has_rematch ? "text-green-600" : "text-red-600"
                    }
                  `}
              >
                {complaint?.has_rematch
                  ? "Rematch created"
                  : "Rematch not created"}
              </span>
            </div>
          </div>
        </CardHeader>
      ) : (
        <CardHeader className="flex flex-col gap-3 p-4">
          <div className="flex justify-between items-start w-full">
            <CardTitle className="font-semibold text-gray-800 text-lg break-words whitespace-normal">
              {complaint?.title}
            </CardTitle>
            <span
              className={`text-sm font-medium px-3 py-1 rounded-full ${statusClass(
                complaint?.status
              )}`}
            >
              {complaint?.status}
            </span>
          </div>

          <div className="flex flex-col gap-1 bg-gray-50 px-3 py-2 rounded-md w-full text-muted-foreground text-sm">
            <div className="flex gap-1">
              <span className="font-medium">
                <strong>From:</strong>
              </span>
              <span className="truncate">{complaint?.full_name || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-medium">
                <strong>Match:</strong>
              </span>
              <span className="truncate">{complaint?.match_name || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <span className="font-medium">
                <strong>Reply from Organizer: </strong>
              </span>
              <span className="truncate">{complaint?.reply || "N/A"}</span>
            </div>
            <div className="flex gap-1">
              <span
                className={`font-semibold
                ${complaint?.has_rematch ? "text-green-600" : "text-red-600"}
              `}
              >
                {complaint?.has_rematch
                  ? "Rematch created"
                  : "Rematch not created"}
              </span>
            </div>
          </div>
        </CardHeader>
      )}
    </Card>
  );
};

ComplaintCard.propTypes = {
  complaint: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    team_name: PropTypes.string,
    match_name: PropTypes.string,
    status: PropTypes.string.isRequired,
    reply: PropTypes.string,
    created_date: PropTypes.string.isRequired,
    has_rematch: PropTypes.bool.isRequired,
    last_modified_date: PropTypes.string.isRequired,
    full_name: PropTypes.string,
  }).isRequired,
  mode: PropTypes.string,
  onClick: PropTypes.func,
};

export default ComplaintCard;
