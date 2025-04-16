import React, { useState, useEffect } from "react";
import { apiClient } from "@/config/axios/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { toast } from "sonner";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { useNavigate } from "react-router-dom";

export const MyTournaments = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const navigate = useNavigate();

  // Display values for pagination

  const fetchMyTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(
        "tournaments/team/" + auth?.teamId,
        {}
      );

      if (response.data.http_status === 200) {
        const data = response.data.data;
        setTournaments(data || []);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error(error.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRounds = (tournamentId) => {
    navigate(`/tournaments/${tournamentId}/rounds`);
  };

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Tournaments</h1>

      <div className="grid gap-4 md:grid-cols-2">
        {tournaments.map((tournament) => (
          <Card key={tournament.tournament_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span
                  className="truncate max-w-[200px]"
                  title={tournament.tournament_name}
                >
                  {tournament.tournament_name}
                </span>
                <Badge className="mt-2">{tournament.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">
                  {tournament.tournament_context}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    Start:{new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                  <span>
                    End: {new Date(tournament.end_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleViewRounds(tournament.tournament_id)}
              >
                View Rounds
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {tournaments.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          You haven't joined any tournaments yet
        </div>
      )}
    </div>
  );
};

