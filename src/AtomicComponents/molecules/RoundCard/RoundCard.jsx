import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Calendar, Map, Users } from "lucide-react";
import { ScoreMethodDetails } from "../CollapsibleDetails/ScoreMethodDetails";
import { MapDetails } from "../CollapsibleDetails/MapDetails";
import { EnvironmentDetails } from "../CollapsibleDetails/EnvironmentDetails";
import { formatDateString } from "@/utils/dateUtils";

export const RoundStatusBadge = ({ status }) => {
  const statusMap = {
    COMPLETED: { className: "bg-green-100 text-green-800", label: "Completed" },
    PENDING: { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
    TERMINATED: { className: "bg-red-100 text-red-800", label: "Terminated" },
    ACTIVE: { className: "bg-blue-100 text-blue-800", label: "Active" },
  };

  const { className, label } = statusMap[status] || {
    className: "bg-gray-100 text-gray-800",
    label: "Unknown",
  };

  return <Badge className={className}>{label}</Badge>;
};

export const RoundCard = ({ round, onViewMatches, onViewLeaderboard }) => {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="bg-gray-50 p-4 pb-3 border-b">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold">
            {round.round_name || `Round ${round.round_no}`}
          </CardTitle>
          {round.is_last && (
            <Badge className="bg-blue-100 text-blue-800">Final Round</Badge>
          )}
        </div>
        <div className="flex space-x-2">
          <RoundStatusBadge status={round.status} />
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
              <Users className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-muted-foreground">Team Limit:</span>
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

      <CardFooter>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewMatches(round.round_id)}
        >
          View Matches
        </Button>
      </CardFooter>
      <CardFooter className="border-t">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onViewLeaderboard(round.round_id)}
        >
          View Leaderboard
        </Button>
      </CardFooter>
    </Card>
  );
};
