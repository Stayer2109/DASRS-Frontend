import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { useNavigate } from "react-router-dom";
import {
  CalendarIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

export const TournamentNavCards = ({
  tournamentId,
  tournamentName,
  onClose,
}) => {
  const navigate = useNavigate();

  const navOptions = [
    {
      title: "Rounds",
      description: "View all rounds and match schedules",
      icon: <CalendarIcon className="w-12 h-12 text-primary" />,
      path: `${tournamentId}/rounds`,
    },
    {
      title: "Teams",
      description: "Manage teams participating in the tournament",
      icon: <UsersIcon className="w-12 h-12 text-primary" />,
      path: `${tournamentId}/teams`,
    },
  ];

  const handleNavigate = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div
      className="z-50 fixed inset-0 flex justify-center items-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white shadow-xl p-8 rounded-lg w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-wrap justify-between items-center gap-5 mb-6">
          <h2 className="max-w-full md:max-w-[80%] font-bold text-2xl truncate">
            {tournamentName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 shrink-0"
          >
            <XMarkIcon className="w-6 h-6 cursor-pointer" />
          </button>
        </div>

        <div className="gap-6 grid md:grid-cols-2">
          {navOptions.map((option, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleNavigate(option.path)}
            >
              <CardHeader className="pb-2 text-center">
                <div className="flex justify-center mb-4">{option.icon}</div>
                <CardTitle>{option.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">
                  {option.description}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="cursor-pointer">View {option.title}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

TournamentNavCards.propTypes = {
  tournamentId: PropTypes.string.isRequired,
  tournamentName: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};