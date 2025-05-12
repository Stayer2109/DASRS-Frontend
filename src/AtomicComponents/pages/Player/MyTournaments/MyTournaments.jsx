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
  const { auth } = useAuth();
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const role = auth?.role.toString().toLowerCase();

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
    navigate(`/${role}/tournaments/${tournamentId}/rounds`);
  };

  useEffect(() => {
    fetchMyTournaments();
  }, []);

  if (isLoading) return <Spinner />;

  return (
    <div className="mx-auto p-4 container">
      <h1 className="mb-6 font-bold text-2xl">My Tournaments</h1>

      <div className="gap-4 grid md:grid-cols-2">
        {tournaments.map((tournament) => (
          <Card key={tournament.tournament_id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span
                  className="max-w-[200px] truncate"
                  title={tournament.tournament_name}
                >
                  {tournament.tournament_name}
                </span>
                <Badge className="mt-2">{tournament.status}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm truncate">
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
        <div className="mt-8 text-gray-500 text-center">
          You haven't joined any tournaments yet
        </div>
      )}
    </div>
  );
};
