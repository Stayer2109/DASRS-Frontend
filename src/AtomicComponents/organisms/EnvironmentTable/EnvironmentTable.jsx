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

export const EnvironmentTable = ({
  data,
  isLoading,
  sortColumn,
  sortOrder,
  onSort,
  onStatusToggle,
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
            onClick={() => onSort("environment_name")}
          >
            Name
          </TableHead>
          <TableHead>Friction</TableHead>
          <TableHead>Visibility</TableHead>
          <TableHead>Brake Efficiency</TableHead>
          <TableHead>Slip Angle</TableHead>
          <TableHead>Reaction Delay</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((environment) => (
          <TableRow key={environment.environment_id}>
            <TableCell className="font-medium">
              {environment.environment_name}
            </TableCell>
            <TableCell>{environment.friction.toFixed(2)}</TableCell>
            <TableCell>{environment.visibility.toFixed(2)}</TableCell>
            <TableCell>{environment.brake_efficiency.toFixed(2)}</TableCell>
            <TableCell>{environment.slip_angle.toFixed(2)}</TableCell>
            <TableCell>{environment.reaction_delay.toFixed(2)}</TableCell>
            <TableCell>
              <StatusIndicator 
                isEnabled={environment.status === "ACTIVE"}
                onChange={() => 
                  onStatusToggle(
                    environment.environment_id, 
                    environment.status === "ACTIVE"
                  )
                }
              />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(environment.environment_id)}
              >
                <Edit size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(environment.environment_id)}
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

