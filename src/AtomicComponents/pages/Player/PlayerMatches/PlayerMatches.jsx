import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar } from "@/AtomicComponents/atoms/shadcn/calendar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { formatDateString } from "@/utils/dateUtils";
import { Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PlayerMatches = () => {
  const {roundId} = useParams();
  const [isLoading, setIsLoading] = useState(false);
   const [matchesList, setMatchesList] = useState([]);

  useEffect(() => {
  if (!roundId) return;

  const fetchData = async () => {
    try {
      setIsLoading(true);
      // const response = 

    } catch (error) {
      console.error("Error fetching matches:", error);
    } finally {
      setIsLoading(false);
    }
  }

  fetchData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matchesList.length === 0 ? (
        <Card className="col-span-full">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">
              No matches found for this round.
            </p>
          </CardContent>
        </Card>
      ) : (
        matchesList.map((match) => (
          <Card
            key={match.match_id}
            className="hover:shadow-md transition-shadow overflow-hidden"
          >
            <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg font-bold">
                  Match {match.match_name}
                </CardTitle>
                <Badge
                  className={
                    match.status === "FINISHED"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }
                >
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
                  <div className="font-medium">
                    {match.teams[0].team_name || "No Team"}
                  </div>
                  <div className="text-lg font-bold">VS</div>
                  <div className="font-medium">
                    {match?.teams[1]?.team_name || "Team Not Available"}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-muted-foreground">Start:</span>
                  </div>
                  <span className="text-right">
                    {formatDateString(match.time_start)}
                  </span>

                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-muted-foreground">End:</span>
                  </div>
                  <span className="text-right">
                    {formatDateString(match.time_end)}
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
  );
};

export default PlayerMatches;
