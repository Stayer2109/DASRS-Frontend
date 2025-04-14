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
import {
  ConvertDate,
  FormatDateInput,
  FormatToISODate,
} from "../../../../utils/DateConvert";
import { useDebounce } from "@/hooks/useDebounce";
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
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import { Button as ButtonIcon } from "./../../../atoms/Button/Button";
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "@/AtomicComponents/organisms/Modal/Modal";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { TournamentManagementValidation } from "@/utils/Validation";
import { NormalizeData } from "@/utils/InputProces";
import { NormalizeServerErrors } from "@/utils/NormalizeError";

const initialFormData = () => ({
  tournament_name: "",
  start_date: FormatToISODate(new Date()),
  end_date: "",
  tournament_context: "",
  team_number: 2,
});

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
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortByKey, setSortByKey] = useState("tournament_id");
  const [sortDirection, setSortDirection] = useState("ASC");

  const [formData, setFormData] = useState(initialFormData);
  const [formMode, setFormMode] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournamentForView, setTournamentForView] = useState(null);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [tournamentManagementModalShow, setTournamentManagementModalShow] =
    useState(false);
  const [tournamentManagementErrors, setTournamentManagementErrors] = useState(
    {}
  );

  // TABLE COLUMNS
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
    const newDirection =
      isSameColumn && sortDirection === "ASC" ? "DESC" : "ASC";
    setSortByKey(columnKey);
    setSortDirection(newDirection);
    setPageIndex(1);
  };

  // HANDLE UPDATE PROFILE DATA VALIDATION
  const handleTournamentManagementValidation = (data) => {
    const errors = TournamentManagementValidation(data);
    setTournamentManagementErrors(errors);
  };

  // HANDLE SUBMIT TOURNAMENT MANAGEMENT
  const handleSubmitTournamentManagement = async (e) => {
    e.preventDefault();
    const normalizedData = NormalizeData({
      ...formData,
      start_date: FormatToISODate(formData.start_date),
      end_date: FormatToISODate(formData.end_date),
    });

    if (Object.keys(tournamentManagementErrors).length > 0) return;

    try {
      setIsSubmitting(true);
      setIsLoading(true);

      const apiCall =
        formMode === "edit"
          ? apiClient.put(
              `/tournaments/${selectedTournament.tournament_id}`,
              normalizedData
            )
          : apiClient.post("/tournaments", normalizedData);

      const response = await apiCall;

      if (
        response.data.http_status === 201 ||
        response.data.http_status === 200
      ) {
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });
        fetchTournamentList();
        handleCloseTournamentManagementModal();
      }
    } catch (error) {
      const serverErrors = NormalizeServerErrors(
        error.response?.data?.data || {}
      );
      setTournamentManagementErrors((prev) => ({ ...prev, ...serverErrors }));
      Toast({
        title: "Error",
        type: "error",
        message: error.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  // Close navigation cards
  const handleCloseNavCards = () => {
    setTournamentForView(null);
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

  // HANDLE CHANGE TOURNAMENT STATUS
  const handleChangeTournamentStatus = (tournament) => {
    setSelectedTournament(tournament);
    setConfirmModalShow(true); // open modal
  };

  // HANDLE CONFIRM STATUS CHANGE
  const handleConfirmStatusChange = async () => {
    try {
      setIsLoading(true);
      // ✅ Hardcoded API call to terminate endpoint
      await apiClient.put(
        `/tournaments/terminate/${selectedTournament.tournament_id}`
      );
      // ✅ Update local state to reflect new status
      fetchTournamentList(); // Refresh the tournament list
      Toast({
        title: "Success",
        message: "Tournament has been terminated.",
        type: "success",
      });
      // ✅ Close modal & reset
      setConfirmModalShow(false);
      setSelectedTournament(null);
    } catch (error) {
      console.error("Failed to terminate tournament", error);
      Toast({
        title: "Error",
        type: "error",
        message:
          error.response?.data?.message || "Failed to terminate tournament.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH TOURNAMENT LIST
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

  // BREADCRUMB ITEMS
  const breadcrumbItems = [
    { label: "Tournament", href: "/tournaments" },
    ...(selectedTournament
      ? [{ label: selectedTournament.tournament_name }]
      : []),
  ];

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  //#region MODAL CONTROL
  const handleOpenConfirmModal = () => {
    setConfirmModalShow(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
  };

  const handleOpenTournamentManagementModal = (tournament = null) => {
    setTournamentManagementModalShow(true);
    setSelectedTournament(tournament);
    setFormMode(tournament ? "edit" : "create");
    setFormData({
      tournament_name: tournament?.tournament_name || "",
      start_date:
        FormatDateInput(tournament?.start_date) || FormatToISODate(new Date()),
      end_date: FormatDateInput(tournament?.end_date) || "",
      tournament_context: tournament?.tournament_context || "",
      team_number: tournament?.team_number || 2,
    });
  };

  const handleCloseTournamentManagementModal = () => {
    setTournamentManagementModalShow(false);
    setSelectedTournament(null);
    setFormData(initialFormData);
    setFormMode("create");
  };
  //#endregion

  //#region USEEFFECT SCOPE
  // FETCH TOURNAMENT LIST WITH SORTING AND SEARCHING CRITERIA
  useEffect(() => {
    fetchTournamentList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, pageIndex, sortByKey, sortDirection, debouncedSearchTerm]);

  // SET START DATE AND END DATE FOR CREATE TOURNAMENT
  useEffect(() => {
    if (formMode === "create" && formData.start_date) {
      const nextDay = new Date(
        new Date(formData.start_date).getTime() + 86400000
      );
      setFormData((prev) => ({ ...prev, end_date: FormatToISODate(nextDay) }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.start_date]);
  //#endregion

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

      <div className="flex justify-between items-center px-4">
        <h3 className="text-lg font-medium">Tournament Management</h3>
        <ButtonIcon
          bgColor="#000"
          content="New Tournament"
          onClick={() => handleOpenTournamentManagementModal()}
        />
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
                        onClick={() => setTournamentForView(row)}
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
                            status={row.status}
                            onEdit={() =>
                              handleOpenTournamentManagementModal(row)
                            }
                            onClick={() => {
                              handleOpenConfirmModal;
                              handleChangeTournamentStatus(row);
                            }}
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

        {tournamentForView && (
          <TournamentNavCards
            tournamentId={tournamentForView.tournament_id}
            tournamentName={tournamentForView.tournament_name}
            onClose={handleCloseNavCards}
          />
        )}
      </div>

      {/* Confirm Change Status */}
      <Dialog open={confirmModalShow} onOpenChange={handleCloseConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to <strong>terminate</strong> this tournament?
          </p>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={handleCloseConfirmModal}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmStatusChange}
              className="cursor-pointer"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tournament Modal */}
      <Modal
        size="xl"
        onHide={handleCloseTournamentManagementModal}
        show={tournamentManagementModalShow}
      >
        <ModalHeader
          content={
            formMode === "edit" ? "Edit Tournament" : "Create New Tournament"
          }
        />

        <ModalBody>
          <form
            onSubmit={handleSubmitTournamentManagement}
            className="space-y-4 pt-4"
          >
            {/* When Form Is Edit Mode */}
            {formMode === "edit" ? (
              <>
                {/* Tournament Name */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="tournament_name">Tournament Name</Label>
                  <Input
                    id="tournament_name"
                    name="tournament_name"
                    value={formData?.tournament_name || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tournament_name: e.target.value,
                      });
                    }}
                    placeholder="Enter tournament name"
                  />
                  {tournamentManagementErrors.tournament_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.tournament_name}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    type="date"
                    id="start_date"
                    name="start_date"
                    disabled
                    value={formData.start_date || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        start_date: e.target.value,
                      });
                    }}
                  />
                  {tournamentManagementErrors.start_date && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.start_date}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ""}
                    disabled
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        end_date: e.target.value,
                      });
                    }}
                  />
                  {tournamentManagementErrors.end_date && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.end_date}
                    </p>
                  )}
                </div>

                {/* Tournament Content */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="tournament_context">Tournament Context</Label>
                  <Textarea
                    id="tournament_context"
                    name="tournament_context"
                    value={formData.tournament_context || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tournament_context: e.target.value,
                      });
                    }}
                    placeholder="Enter tournament context"
                    rows={4}
                  />
                  {tournamentManagementErrors.tournament_context && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.tournament_context}
                    </p>
                  )}
                </div>

                {/* Team numbers */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="team_number">Number of Teams</Label>
                  <Input
                    type="number"
                    id="team_number"
                    name="team_number"
                    min="2"
                    max="100"
                    step="1"
                    value={formData.team_number || 2}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        team_number: parseInt(e.target.value),
                      });
                    }}
                    required
                  />
                  {tournamentManagementErrors.team_number && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.team_number}
                    </p>
                  )}
                </div>
              </>
            ) : (
              // When Form Is Create Mode
              <>
                {/* Tournament Name */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="tournament_name">Tournament Name</Label>
                  <Input
                    id="tournament_name"
                    name="tournament_name"
                    value={formData?.tournament_name || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tournament_name: e.target.value,
                      });
                    }}
                    placeholder="Enter tournament name"
                  />
                  {tournamentManagementErrors.tournament_name && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.tournament_name}
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    type="date"
                    id="start_date"
                    name="start_date"
                    min={new Date()}
                    value={formData.start_date || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        start_date: e.target.value,
                      });
                    }}
                  />
                  {tournamentManagementErrors.start_date && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.start_date}
                    </p>
                  )}
                </div>

                {/* End Date */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    type="date"
                    value={formData.end_date || ""}
                    min={FormatToISODate(
                      new Date(
                        new Date(formData.start_date).getTime() + 1 * 86400000
                      )
                    )}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        end_date: e.target.value,
                      });
                    }}
                  />
                  {tournamentManagementErrors.end_date && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.end_date}
                    </p>
                  )}
                </div>

                {/* Tournament Content */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="tournament_context">Tournament Context</Label>
                  <Textarea
                    id="tournament_context"
                    name="tournament_context"
                    value={formData.tournament_context || ""}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        tournament_context: e.target.value,
                      });
                    }}
                    placeholder="Enter tournament context"
                    rows={4}
                  />
                  {tournamentManagementErrors.tournament_context && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.tournament_context}
                    </p>
                  )}
                </div>

                {/* Team numbers */}
                <div className="grid w-full gap-2">
                  <Label htmlFor="team_number">Number of Teams</Label>
                  <Input
                    type="number"
                    id="team_number"
                    name="team_number"
                    min="2"
                    max="100"
                    step="1"
                    value={formData.team_number || 2}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        team_number: parseInt(e.target.value),
                      });
                    }}
                    required
                  />
                  {tournamentManagementErrors.team_number && (
                    <p className="text-xs text-red-500 mt-1">
                      {tournamentManagementErrors.team_number}
                    </p>
                  )}
                </div>
              </>
            )}

            <DialogFooter>
              <ButtonIcon
                type="button"
                variant="outline"
                onClick={handleCloseTournamentManagementModal}
                content="Cancel"
              />
              <ButtonIcon
                type="submit"
                disabled={isSubmitting}
                bgColor="#FFF"
                className="w-46"
                onClick={() => handleTournamentManagementValidation(formData)}
                content={
                  isSubmitting ? (
                    <>
                      <LoadingIndicator size="small" className="mr-2" />
                    </>
                  ) : formMode === "create" ? (
                    "Create Tournament"
                  ) : (
                    "Save Changes"
                  )
                }
              />
            </DialogFooter>
          </form>
        </ModalBody>
      </Modal>
    </>
  );
};
