import { useState } from "react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Map, Users, Flag } from "lucide-react";
import { formatDateString } from "@/utils/dateUtils";
import { RoundStatusBadge } from "@/AtomicComponents/atoms/RoundStatusBadge/RoundStatusBadge";
import { EnvironmentDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/EnvironmentDetails";
import { MapDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/MapDetails";
import { ScoreMethodDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/ScoreMethodDetails";

const PlayerRounds = () => {
  const [roundList] = useState([]);

  return (
    <div className="space-y-6">
      {roundList.length == 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500">
          No rounds available.
        </div>
      ) : (
        roundList.map((round) => (
          <Card
            key={round.round_id}
            className="hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
          >
            <CardHeader className="bg-gray-50 p-4 pb-3 border-b h-[120px] flex flex-col justify-between shrink-0">
              <div className="flex justify-between items-start w-full">
                <CardTitle className="text-lg font-bold group relative">
                  <span className="truncate block max-w-[200px] group-hover:text-clip">
                    {round.round_name || `Round ${round.round_no}`}
                  </span>
                  <span className="invisible group-hover:visible absolute -top-8 left-0 bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap z-50">
                    {round.round_name || `Round ${round.round_no}`}
                  </span>
                </CardTitle>
                {round.is_last && (
                  <Badge className="bg-blue-100 text-blue-800 shrink-0">
                    Final Round
                  </Badge>
                )}
              </div>
              <div className="flex space-x-2 mt-auto">
                <RoundStatusBadge status={round.status} />
                {round.is_last && (
                  <Badge className="bg-red-500 text-white">Final Round</Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="p-4 h-[400px] overflow-y-auto">
              <div className="space-y-3">
                {round.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {round.description}
                  </p>
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
                  <span className="text-right font-medium truncate">
                    {round.match_type_name}
                  </span>

                  <div className="flex items-center">
                    <Flag className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-muted-foreground">Finish Type:</span>
                  </div>
                  <span className="text-right font-medium truncate">
                    {round.finish_type}
                  </span>

                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-muted-foreground">
                      Qualification Spots:
                    </span>
                  </div>
                  <span className="text-right">{round.team_limit}</span>
                </div>

                <div className="space-y-2 pt-2 border-t">
                  <EnvironmentDetails environmentId={round.environment_id} />
                </div>
                <div className="space-y-2 pt-2 border-t">
                  <MapDetails resourceId={round.map_id} />
                </div>
                <div className="pt-2 border-t">
                  <ScoreMethodDetails scoredMethodId={round.scored_method_id} />
                </div>
              </div>
            </CardContent>

            <div className="mt-auto border-t shrink-0">
              <CardFooter className="p-4">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  // onClick={() => handleViewMatches(round.round_id)}
                >
                  View Matches
                </Button>
              </CardFooter>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  className="w-full cursor-pointer"
                  // onClick={() => handleViewLeaderboard(round.round_id)}
                >
                  View Leaderboard
                </Button>
              </CardFooter>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default PlayerRounds;
