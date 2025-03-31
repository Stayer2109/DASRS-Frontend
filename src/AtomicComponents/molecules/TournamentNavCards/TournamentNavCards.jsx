import React from "react";
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
      icon: <CalendarIcon className="h-12 w-12 text-primary" />,
      path: `/tournaments/${tournamentId}/rounds`,
    },
    {
      title: "Teams",
      description: "Manage teams participating in the tournament",
      icon: <UsersIcon className="h-12 w-12 text-primary" />,
      path: `/tournaments/${tournamentId}/teams`,
    },
  ];

  const handleNavigate = (path) => {
    console.log("Navigating to:", path);
    navigate(path);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-8 max-w-4xl w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{tournamentName}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
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
                <Button>View {option.title}</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
