import React, { useState, useEffect } from "react";
import { apiClient } from "@/config/axios/axios";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { toast } from "sonner";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";

export const TournamentRegistration = () => {
  const [tournaments, setTournaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { auth } = useAuth();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  // Pagination states
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Display values for pagination
  const displayedValues = [6, 12, 18, 24];

  const fetchActiveTournaments = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get("tournaments", {
        params: {
          pageNo: pageIndex - 1,
          pageSize,
          status: "ACTIVE",
          sortBy: "SORT_BY_ID_ASC",
        },
      });

      if (response.data.http_status === 200) {
        const data = response.data.data;
        setTournaments(data.content || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      toast.error("Failed to fetch tournaments");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = (tournament) => {
    setSelectedTournament(tournament);
    setConfirmDialogOpen(true);
  };

  const handleRegisterTeam = async () => {
    if (!selectedTournament) return;

    try {
      await apiClient.post(
        `tournaments/register-team/${selectedTournament.tournament_id}/${auth.teamId}`
      );
      toast.success("Successfully registered for tournament");
      setConfirmDialogOpen(false);
      setSelectedTournament(null);
      // Refresh the tournaments list
      fetchActiveTournaments();
    } catch (error) {
      console.error("Error registering team:", error);
      toast.error(error.response?.data?.message || "Failed to register team");
    }
  };

  // Pagination handlers
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1); // Reset to first page when changing page size
  };

  useEffect(() => {
    fetchActiveTournaments();
  }, [pageIndex, pageSize]); // Refetch when pagination changes

  if (isLoading) return <Spinner />;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">All Tournaments</h1>

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
                <Badge variant="secondary">
                  {tournament.team_list?.length || 0}/{tournament.team_number}
                  Teams
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-500 truncate">
                  {tournament.tournament_context}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span>
                    Start:
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </span>
                  <span>
                    End: {new Date(tournament.end_date).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => handleRegisterClick(tournament)}
                  disabled={
                    (tournament.team_list?.length || 0) >=
                    tournament.team_number
                  }
                >
                  {(tournament.team_list?.length || 0) >= tournament.team_number
                    ? "Tournament Full"
                    : "Register Team"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Tournament Registration</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to register your team for{" "}
              <span className="font-semibold">
                {selectedTournament?.tournament_name}
              </span>
              ?
            </p>
            <div className="mt-4 space-y-2 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Start Date:</span>
                <span>
                  {selectedTournament &&
                    new Date(
                      selectedTournament.start_date
                    ).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>End Date:</span>
                <span>
                  {selectedTournament &&
                    new Date(selectedTournament.end_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Teams:</span>
                <span>
                  {selectedTournament?.team_list?.length || 0}/
                  {selectedTournament?.team_number}
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              By registering, your team commits to participating in all
              tournament matches during the specified period.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRegisterTeam}>Confirm Registration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {tournaments.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No active tournaments available
        </div>
      )}

      {tournaments.length > 0 && (
        <DasrsPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          handlePagination={handlePagination}
          handleChangePageSize={handleChangePageSize}
          page={pageIndex}
          count={totalPages}
          displayedValues={displayedValues}
        />
      )}
    </div>
  );
};
