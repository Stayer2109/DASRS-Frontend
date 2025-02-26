import React, { useState } from "react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";

export const Tournament = () => {
  const [tournaments, setTournaments] = useState([
    {
      id: 1,
      name: "Summer Code Challenge 2024",
      startDate: "2024-06-01",
      endDate: "2024-08-31",
      status: "Upcoming",
      participants: 0,
      teams: 0,
    },
    {
      id: 2,
      name: "Winter Code Challenge 2024",
      startDate: "2024-12-01",
      endDate: "2024-12-31",
      status: "On Going",
      participants: 10,
      teams: 0,
    },
    {
      id: 3,
      name: "Spring Code Challenge 2025",
      startDate: "2025-03-01",
      endDate: "2025-05-31",
      status: "Completed",
      participants: 0,
      teams: 0,
    },
    // Add more sample data as needed
  ]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "bg-yellow-100 text-yellow-800";
      case "on going":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tournament Management</h3>
        <Button>
          <PlusIcon className="h-4 w-4 mr-2" />
          New Tournament
        </Button>
      </div>

      {/* Tournament Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Number of Teams</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tournaments.map((tournament) => (
              <TableRow key={tournament.id}>
                <TableCell className="font-medium">{tournament.name}</TableCell>
                <TableCell>{tournament.startDate}</TableCell>
                <TableCell>{tournament.endDate}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                      tournament.status
                    )}`}
                  >
                    {tournament.status}
                  </span>
                </TableCell>
                <TableCell>{tournament.participants}</TableCell>
                <TableCell>{tournament.teams}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon">
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
