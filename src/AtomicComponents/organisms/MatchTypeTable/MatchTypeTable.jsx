import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Edit, Trash2 } from "lucide-react";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { StatusIndicator } from "@/AtomicComponents/atoms/StatusIndicator/StatusIndicator";

export const MatchTypeTable = ({
  data,
  isLoading,
  sortColumn,
  sortOrder,
  onSort,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => onSort("match_type_name")}
          >
            Name
          </TableHead>
          <TableHead>Code</TableHead>
          <TableHead>Duration (Hours)</TableHead>
          <TableHead>Player Number</TableHead>
          <TableHead>Team Number</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((matchType) => (
          <TableRow key={matchType.match_type_id}>
            <TableCell className="font-medium">
              {matchType.match_type_name}
            </TableCell>
            <TableCell>{matchType.match_type_code}</TableCell>
            <TableCell>{matchType.match_duration.toFixed(2)}</TableCell>
            <TableCell>{matchType.player_number}</TableCell>
            <TableCell>{matchType.team_number}</TableCell>
            <TableCell>
              <StatusIndicator isEnabled={matchType.status === "ACTIVE"} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(matchType.match_type_id)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(matchType.match_type_id)}
              >
                <Trash2 size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
