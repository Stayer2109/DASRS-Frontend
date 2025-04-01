import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Clock, Users, ArrowLeft } from "lucide-react";
import { apiAuth } from "@/config/axios/axios";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { toast } from "sonner";

export const RoundMatches = () => {
  const { tournamentId, roundId } = useParams();
  const [matches, setMatches] = useState([]);
  const [round, setRound] = useState(null);
  const [tournament, setTournament] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch tournament, round, and matches data
  useEffect(() => {
    const fetchData = async () => {
      if (!tournamentId || !roundId) {
        console.error("No tournament ID or round ID provided");
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

        // Fetch round information
        const roundResponse = await apiAuth.get(`rounds/${roundId}`);
        setRound(roundResponse.data.data);

        // Fetch matches for the round
        const matchesResponse = await apiAuth.get(
          `matches/round/${roundId}`
        );
        setMatches(matchesResponse.data.data || []);
      } catch (err) {
        console.error("Error fetching round matches:", err);
        setError("Failed to load matches. Please try again.");
        toast.error("Failed to load matches. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tournamentId, roundId]);

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Tournaments", href: "/tournaments" },
    {
      label: tournament?.tournament_name || "Tournament",
      href: `/tournaments`,
    },
    {
      label: "Rounds",
      href: `/tournaments/${tournamentId}/rounds`,
    },
    { label: round?.round_name || `Round ${round?.round_no}` || "Round Matches" },
  ];

  const handleBackToRounds = () => {
    navigate(`/tournaments/${tournamentId}/rounds`);
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

  // Format time strings
  const formatTimeString = (timeString) => {
    if (!timeString) return "";
    return timeString;
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
          {tournament?.tournament_name} - {round?.round_name || `Round ${round?.round_id}`} Matches
        </h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleBackToRounds}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Rounds
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <p className="text-muted-foreground mb-4">
                No matches found for this round.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card
              key={match.match_id}
              className="hover:shadow-md transition-shadow overflow-hidden"
            >
              <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg font-bold">
                    Match {match.match_name}
                  </CardTitle>
                  <Badge className={match.status === "FINISHED" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}>
                    {match.status}
                  </Badge>
                </div>
                <div className="text-sm text-gray-500">
                  Code: {match.match_code}
                </div>
              </CardHeader>

              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-md">
                    <div className="font-medium">{match.teams[0].team_name || "No Team"}</div>
                    <div className="text-lg font-bold">VS</div>
                    <div className="font-medium">{match?.teams[1]?.team_name || "Team Not Available"}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">Start:</span>
                    </div>
                    <span className="text-right">
                      {formatTimeString(match.time_start)}
                    </span>

                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-muted-foreground">End:</span>
                    </div>
                    <span className="text-right">
                      {formatTimeString(match.time_end)}
                    </span>

                    {match.status === "FINISHED" && (
                      <>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-muted-foreground">Score:</span>
                        </div>
                        <span className="text-right font-medium">
                          {match.team1_score || 0} - {match.team2_score || 0}
                        </span>
                      </>
                    )}
                  </div>

                  {match.location && (
                    <div className="text-sm mt-2">
                      <span className="text-muted-foreground">Location: </span>
                      {match.location}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
