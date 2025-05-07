import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiClient } from "@/config/axios/axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/AtomicComponents/atoms/shadcn/card";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { toast } from "sonner";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import useAuth from "@/hooks/useAuth";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import { Map } from "lucide-react";
import { Flag } from "lucide-react";
import { Users } from "lucide-react";
import { EnvironmentDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/EnvironmentDetails";
import { MapDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/MapDetails";
import { ScoreMethodDetails } from "@/AtomicComponents/molecules/CollapsibleDetails/ScoreMethodDetails";
import { Trophy } from "lucide-react";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import RoundLeaderboardCard from "@/AtomicComponents/molecules/LeaderboardCard/RoundLeaderboardCard/RoundLeaderboardCard";
import { Button as ButtonIcon } from "./../../../atoms/Button/Button";

export const TeamTournamentRounds = () => {
  const { tournamentId } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();
  const [rounds, setRounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tournament, setTournament] = useState(null);
  const [roundLeaderboardModalShow, setRoundLeaderboardModalShow] =
    useState(false);
  const [roundLeaderboard, setRoundLeaderboard] = useState(null);
  const [_selectedRound, setSelectedRound] = useState(null);

  // Pagination states
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  // Display values for pagination
  const displayedValues = [6, 12, 18, 24];

  const fetchRounds = async () => {
    try {
      setIsLoading(true);
      const [roundsResponse, tournamentResponse] = await Promise.all([
        apiClient.get(`rounds/team/${auth.teamId}/tournament/${tournamentId}`, {
          params: {
            pageNo: pageIndex - 1, // Convert to 0-based index for API
            pageSize: pageSize,
            sortBy: "SORT_BY_ID_ASC",
          },
        }),
        apiClient.get(`tournaments/${tournamentId}`),
      ]);

      if (roundsResponse.data.http_status === 200) {
        setRounds(roundsResponse.data.data.rounds || []);
        setTotalPages(roundsResponse.data.data.total_pages || 1);
      }

      if (tournamentResponse.data.http_status === 200) {
        setTournament(tournamentResponse.data.data);
      }
    } catch (error) {
      console.error("Error fetching rounds:", error);
      toast.error("Failed to fetch rounds");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tournamentId, pageIndex, pageSize]);

  const handleViewMatches = (roundId, roundName) => {
    navigate(`/rounds/${roundId}/matches`, {
      state: { roundName }, // Pass round name as state
    });
  };

  // ROUND LEADERBOARD MODAL
  const handleOpenRoundLeaderboardModal = (round = null) => {
    setRoundLeaderboardModalShow(true);
    setSelectedRound(round);

    fetchRoundLeaderboard(round?.round_id);
  };

  const handleCloseRoundLeaderboardModal = () => {
    setRoundLeaderboardModalShow(false);

    setTimeout(() => {
      setSelectedRound(null);
      setRoundLeaderboard(null);
    }, 300);
  };

  const handleBack = () => {
    navigate("/tournaments/my-tournaments");
  };

  // Pagination handlers
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1); // Reset to first page when changing page size
  };

  // FETCH ROUND LEADERBOARD INFORMATION
  const fetchRoundLeaderboard = async (roundId) => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`leaderboards/round/v3/${roundId}`, {
        params: {
          pageNo: 0,
          pageSize: 100,
          sortBy: "id",
          sortDirection: "asc",
        },
      });

      if (response.data.http_status === 200) {
        setRoundLeaderboard(response.data.data || []);
      }
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className="mx-auto p-4 container">
        <Button variant="outline" onClick={handleBack} className="mb-4">
          Back to Tournaments
        </Button>

        <div className="mb-6">
          <h1 className="font-bold text-2xl">
            {tournament?.tournament_name || "Tournament Rounds"}
          </h1>
          <p className="mt-2 text-gray-500">
            View all rounds for this tournament
          </p>
        </div>

        <div className="gap-4 grid md:grid-cols-2 mb-4">
          {rounds.map((round) => (
            <Card key={round.round_id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span
                    className="max-w-[200px] truncate"
                    title={round.round_name}
                  >
                    {round.round_name}
                  </span>
                  <Badge
                    variant={
                      round.status === "ACTIVE" ? "success" : "secondary"
                    }
                  >
                    {round.status}
                  </Badge>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span>
                      Start: {new Date(round.start_date).toLocaleDateString()}
                    </span>
                    <span>
                      End: {new Date(round.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  {round.description && (
                    <p className="text-gray-500 text-sm">{round.description}</p>
                  )}

                  <div className="gap-x-4 grid grid-cols-2 text-sm">
                    <div className="flex items-center">
                      <Map className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">Match Type:</span>
                    </div>
                    <span className="font-medium text-right truncate">
                      {round.match_type_name}
                    </span>

                    <div className="flex items-center">
                      <Flag className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">
                        Finish Type:
                      </span>
                    </div>
                    <span className="font-medium text-right truncate">
                      {round.finish_type}
                    </span>

                    <div className="flex items-center">
                      <Users className="mr-2 w-4 h-4 text-gray-500" />
                      <span className="text-muted-foreground">
                        Qualification Spots:
                      </span>
                    </div>
                    <span className="text-right">{round.team_limit}</span>
                  </div>
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
              </CardContent>

              <div className="mt-auto">
                <CardFooter className="flex flex-col gap-2 p-4">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() =>
                      handleViewMatches(round.round_id, round.round_name)
                    }
                  >
                    <Users className="mr-2 w-4 h-4" />
                    View Matches
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleOpenRoundLeaderboardModal(round)}
                  >
                    <Trophy className="mr-2 w-4 h-4" />
                    View Leaderboard
                  </Button>
                </CardFooter>
              </div>
            </Card>
          ))}

          {rounds.length === 0 && (
            <div className="col-span-2 py-8 text-gray-500 text-center">
              No rounds found for this tournament
            </div>
          )}
        </div>

        {rounds.length > 0 && (
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

        {/* Round Leaderboard */}
        <Modal
          size="md"
          show={roundLeaderboardModalShow}
          onHide={handleCloseRoundLeaderboardModal}
        >
          <Modal.Header content="Round Leaderboard" />
          <Modal.Body>
            {roundLeaderboard ? (
              <div className="space-y-4">
                {/* Leaderboard Entries */}
                <div className="space-y-2">
                  {/* {
                        roundLeaderboard?.leaderboard_list
                      } */}
                  <RoundLeaderboardCard
                    roundData={roundLeaderboard}
                    isForEachRound
                  />
                </div>
              </div>
            ) : (
              <div className="py-4 text-gray-400 text-center">
                <p>No leaderboard data available for this round.</p>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <ButtonIcon
              type="button"
              onClick={handleCloseRoundLeaderboardModal}
              content="Close"
            />
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};
