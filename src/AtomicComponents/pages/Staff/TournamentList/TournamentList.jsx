import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/molecules/Table/Table";
import { apiClient } from "@/config/axios/axios";
import { useEffect, useState } from "react";
import { ConvertDate } from "../../../../utils/DateConvert";
import { useDebounce } from "@/hooks/useDebounce"; // adjust path if needed
import { TournamentNavCards } from "@/AtomicComponents/molecules/TournamentNavCards/TournamentNavCards";
import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import { DasrsTournamentActions } from "@/AtomicComponents/molecules/DasrsTournamentAction/DasrsTournamentAction";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
// import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";

const sortKeyMap = {
  tournament_id: "SORT_BY_ID",
  team_number: "SORT_BY_TEAM",
  created_date: "SORT_BY_CREATED",
  start_date: "SORT_BY_START",
  end_date: "SORT_BY_END",
};

export const TournamentList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentList, setTournamentList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [selectedTournamentId, setSelectedTournamentId] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByKey, setSortByKey] = useState("tournament_id"); // default sort key
  const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [pendingStatusUpdate, setPendingStatusUpdate] = useState({
    tournamentId: null,
    newStatus: "",
  });

  const columns = [
    { key: "tournament_id", label: "ID", sortable: true },
    { key: "tournament_name", label: "Name", sortable: false },
    { key: "created_date", label: "Created Date", sortable: true },
    { key: "start_date", label: "Start Date", sortable: true },
    { key: "end_date", label: "End Date", sortable: true },
    { key: "team_number", label: "Total of Teams", sortable: true },
    { key: "status", label: "Status", sortable: false },
    { key: "actions", label: "Actions", sortable: false },
  ];

  // GET SORT PARAMS
  const getSortByParam = () => {
    if (!sortByKey || !sortDirection) return null;
    const baseKey = sortKeyMap[sortByKey];
    return baseKey ? `${baseKey}_${sortDirection}` : null;
  };

  // HANDLE SORT
  const handleSort = (columnKey) => {
    const isSameColumn = sortByKey === columnKey;
    let newDirection = "ASC";

    // Check if the same column is clicked and change sort direction
    if (isSameColumn && sortDirection === "ASC") {
      newDirection = "DESC";
    }

    setSortByKey(columnKey);
    setSortDirection(newDirection);
    setPageIndex(1);
  };

  // Close navigation cards
  const handleCloseNavCards = () => {
    setSelectedTournament(null);
    setSelectedTournamentId(null);
  };

  // CHECK STATUS TO APPLY STYLES CLASS
  const statusClass = (status) => {
    switch (status.toString().toUpperCase()) {
      case "TERMINATED":
        return "text-red-500 font-bold";

      case "ACTIVE":
        return "text-green-500 font-bold";

      case "PENDING":
        return "text-yellow-500 font-bold";

      default:
        return "text-gray-500 font-bold";
    }
  };

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  // HANDLE CHANGE TOURNAMENT STATUS
  const handleChangeTournamentStatus = (tournamentId, status) => {
    setPendingStatusUpdate({ tournamentId, newStatus: status });
    setConfirmModalShow(true); // open modal
  };

  // HANDLE CONFIRM STATUS CHANGE
  const handleConfirmStatusChange = async () => {
    const { tournamentId, newStatus } = pendingStatusUpdate;
    try {
      setIsLoading(true);
      await apiClient.put(
        `/tournaments/status/${tournamentId}?status=${newStatus}`
      );

      // Update UI
      setTournamentList((prev) =>
        prev.map((t) =>
          t.tournament_id === tournamentId ? { ...t, status: newStatus } : t
        )
      );

      // Reset modal
      setConfirmModalShow(false);
      setPendingStatusUpdate({ tournamentId: null, newStatus: "" });
    } catch (error) {
      console.error("Failed to update tournament status", error);
      Toast({
        title: "Error",
        type: "error",
        message: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  //#region MODAL CONTROL
  const handleOpenConfirmModal = () => {
    setConfirmModalShow(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
  };
  //#endregion

  // FETCH TOURNAMENT LIST WITH SORTING AND SEARCHING CRITERIA
  useEffect(() => {
    const fetchTournamentList = async () => {
      try {
        setIsLoading(true);

        const sortByParam = getSortByParam();

        const response = await apiClient.get("tournaments", {
          params: {
            pageNo: pageIndex - 1,
            pageSize,
            sortBy: sortByParam,
            keyword: debouncedSearchTerm || undefined, // ← pass search param
          },
        });

        if (response.data.http_status === 200) {
          const data = response.data.data;
          setTournamentList(data.content || []);
          setTotalPages(data.total_pages || 1);
        }
      } catch (error) {
        console.error("Error fetching tournament list:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTournamentList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex, sortByKey, sortDirection, debouncedSearchTerm]);

  // FETCH SELECTED TOURNAMENT
  useEffect(() => {
    if (!selectedTournamentId) return;

    const fetchSelectedTournament = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(
          `tournaments/${selectedTournamentId}`
        );

        if (response.data.http_status === 200) {
          const data = response.data.data;
          setSelectedTournament(data);
        }
      } catch (error) {
        console.error("Error fetching selected tournament:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelectedTournament();
  }, [selectedTournamentId]);

  // Breadcrumb items - using your existing pattern
  const breadcrumbItems = [
    { label: "Tournament", href: "/tournaments" },
    ...(selectedTournament
      ? [{ label: selectedTournament.tournament_name }]
      : []),
  ];

  return (
    <>
      {isLoading && <Spinner />}

      <Breadcrumb items={breadcrumbItems} />

      {/* Search */}
      <div className="p-4">
        <div className="mb-4 flex justify-between flex-wrap gap-2">
          <Input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(1); // Reset to page 1 on search
            }}
            className="border border-gray-300 rounded px-4 py-2 w-full sm:max-w-xl"
          />
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <Table title="Tournament List">
          <TableHeader
            columns={columns}
            sortBy={sortByKey}
            sortDirection={sortDirection?.toLowerCase()}
            onSort={handleSort}
          />
          <TableBody>
            {tournamentList.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => {
                  if (col.key === "tournament_name") {
                    return (
                      <TableCell
                        key={col.key}
                        className="hover:text-blue-600 cursor-pointer"
                        onClick={() =>
                          setSelectedTournamentId(row.tournament_id)
                        }
                      >
                        {row.tournament_name}
                      </TableCell>
                    );
                  }

                  if (
                    ["created_date", "start_date", "end_date"].includes(col.key)
                  ) {
                    return (
                      <TableCell key={col.key}>
                        {ConvertDate(row[col.key])}
                      </TableCell>
                    );
                  }

                  if (col.key === "team_number") {
                    return (
                      <TableCell key={col.key}>
                        {`${row.team_list?.length || 0}/${row.team_number}`}
                      </TableCell>
                    );
                  }

                  if (col.key === "status") {
                    return (
                      <TableCell
                        key={col.key}
                        className={statusClass(row[col.key])}
                      >
                        {row[col.key]}
                      </TableCell>
                    );
                  }

                  if (col.key === "actions") {
                    return (
                      <>
                        <TableCell className="text-center">
                          <DasrsTournamentActions
                            tournamentId={row.tournament_id}
                            status={row.status}
                            onChangeStatus={handleChangeTournamentStatus}
                            onClick={handleOpenConfirmModal}
                          />
                        </TableCell>
                      </>
                    );
                  }

                  return <TableCell key={col.key}>{row[col.key]}</TableCell>;
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4 flex-wrap gap-4">
          <DasrsPagination
            pageSize={pageSize}
            pageIndex={pageIndex}
            page={pageIndex}
            count={totalPages}
            handlePagination={handlePagination}
            handleChangePageSize={handleChangePageSize}
          />
        </div>

        {selectedTournament && (
          <TournamentNavCards
            tournamentId={selectedTournament.tournament_id}
            tournamentName={selectedTournament.tournament_name}
            onClose={handleCloseNavCards}
          />
        )}
      </div>

      <Dialog open={confirmModalShow} onOpenChange={handleCloseConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to change status of this tournament to:{" "}
            <strong>{pendingStatusUpdate.newStatus}</strong>?
          </p>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseConfirmModal}>
              Cancel
            </Button>
            <Button onClick={handleConfirmStatusChange}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
