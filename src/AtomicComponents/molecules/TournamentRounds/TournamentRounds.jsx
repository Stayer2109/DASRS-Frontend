import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Plus, Calendar, Clock, Flag, Map, Users } from "lucide-react";
import { apiAuth } from "@/config/axios/axios";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

export const TournamentRounds = ({ tournamentId }) => {
  const [rounds, setRounds] = useState([]);
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("TournamentRounds rendering with ID:", tournamentId);

  // Fetch tournament details and rounds
  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId) {
        console.error("No tournament ID provided");
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Fetch tournament information
        const tournamentResponse = await apiAuth.get(
          `tournaments/${tournamentId}`
        );
        setTournament(tournamentResponse.data.data);

        // Fetch rounds using the specific API endpoint you mentioned
        const roundsResponse = await apiAuth.get(
          `rounds/tournament/${tournamentId}`
        );
        setRounds(roundsResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching tournament rounds:", err);
        setError("Failed to load rounds. Please try again.");
        toast.error("Failed to load rounds. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Tournament", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/tournaments`,
    },
    { label: "Rounds" },
  ];

  const handleCreateRound = () => {
    // Implement round creation functionality
    console.log("Create new round for tournament:", tournamentId);
  };

  const handleBackToTournament = () => {
    console.log("Navigating back to tournaments");
    navigate("/tournaments", { replace: true }); // use replace to avoid stacking history
  };

  const handleViewMatches = (roundId) => {
    console.log(`View matches for round: ${roundId}`);
    // You can implement navigation to matches view here
  };

  // Format date strings
  const formatDateString = (dateString) => {
    if (!dateString) return "";
    try {
      // Parse the MM/DD/YYYY format
      const [date, time] = dateString.split(" ");
      const [month, day, year] = date.split("/");
      return `${day}/${month}/${year}`;
    } catch (err) {
      console.error("Date parsing error:", err);
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingIndicator />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {tournament?.tournament_name} - Rounds
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleBackToTournament}>
            Back to Tournaments
          </Button>
          <Button onClick={handleCreateRound}>
            <Plus className="h-4 w-4 mr-2" /> Create Round
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rounds.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">
                No rounds found for this tournament.
              </p>
              <Button variant="outline" onClick={handleCreateRound}>
                <Plus className="h-4 w-4 mr-2" /> Create First Round
              </Button>
            </CardContent>
          </Card>
        ) : (
          rounds.map((round) => (
            <Card
              key={round.round_id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">
                    {round.round_name || `Round ${round.round_no}`}
                  </CardTitle>
                  {round.is_last && (
                    <Badge className="bg-blue-100 text-blue-800">
                      Final Round
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {round.description && (
                    <p className="text-sm text-gray-600">{round.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(round.start_date)}
                    </span>

                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatDateString(round.end_date)}
                    </span>

                    <div className="flex items-center">
                      <Map className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Match Type:</span>
                    </div>
                    <span className="text-right font-medium">
                      {round.match_type_name}
                    </span>

                    <div className="flex items-center">
                      <Flag className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">
                        Finish Type:
                      </span>
                    </div>
                    <span className="text-right font-medium">
                      {round.finish_type}
                    </span>

                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Team Limit:</span>
                    </div>
                    <span className="text-right">{round.team_limit}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleViewMatches(round.round_id)}
                >
                  View Matches
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
