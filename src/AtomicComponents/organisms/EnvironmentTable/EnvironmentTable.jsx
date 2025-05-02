import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Edit } from "lucide-react";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { StatusIndicator } from "@/AtomicComponents/atoms/StatusIndicator/StatusIndicator";

export const EnvironmentTable = ({ data, isLoading, onSort, onEdit }) => {
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
            <TableCell>
              <StatusIndicator isEnabled={environment.status === "ACTIVE"} />
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(environment.environment_id)}
              >
                <Edit size={16} />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
