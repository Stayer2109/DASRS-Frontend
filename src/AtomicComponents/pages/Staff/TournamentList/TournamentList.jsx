/**
 * TournamentList Component
 * ------------------------
 * Handles the listing, creation, editing, extending and termination of tournaments.
 * Includes table display, pagination, filtering, and form modal management.
 *
 * startDate and endDate must not be the same day.
 * startDate and endDate of a tournament ideally suggests a 7-day period.
 */

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/molecules/Table/Table";
import { useEffect, useState } from "react";
import {
  ConvertDate,
  FormatDateInput,
  FormatToISODate,
} from "../../../../utils/DateConvert";

import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import Select from "@/AtomicComponents/atoms/Select/Select";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import { DasrsTournamentActions } from "@/AtomicComponents/molecules/DasrsTournamentAction/DasrsTournamentAction";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import { TournamentNavCards } from "@/AtomicComponents/molecules/TournamentNavCards/TournamentNavCards";
import { apiClient } from "@/config/axios/axios";
import { useDebounce } from "@/hooks/useDebounce";
import { NormalizeData } from "@/utils/InputProces";
import { NormalizeServerErrors } from "@/utils/NormalizeError";
import { TournamentManagementValidation } from "@/utils/Validation";
import { Button as ButtonIcon } from "./../../../atoms/Button/Button";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";

// INITIAL FORM DATA
const initialFormData = () => ({
  tournament_name: "",
  start_date: "",
  end_date: "",
  tournament_context: "",
  team_number: 0,
});

// KEY MAPPING FOR SORT
const sortKeyMap = {
  tournament_id: "SORT_BY_ID",
  team_number: "SORT_BY_TEAM",
  created_date: "SORT_BY_CREATED",
  start_date: "SORT_BY_START",
  end_date: "SORT_BY_END",
};

// KEY MAPPING FOR TOURNAMENT STATUS
const tournamentStatusMap = {
  all: "ALL",
  active: "ACTIVE",
  terminated: "TERMINATED",
  complete: "COMPLETED",
};

export const TournamentList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentList, setTournamentList] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tournamentExtendedEndDate, setTournamentExtendedEndDate] =
    useState(null);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [sortByKey, setSortByKey] = useState("tournament_id");
  const [sortDirection, setSortDirection] = useState("ASC");
  const [showByStatus, setShowByStatus] = useState("all");
  const [formData, setFormData] = useState(initialFormData);
  const statusOptions = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "complete", label: "Complete" },
    { value: "terminated", label: "Terminated" },
  ];
  const [formMode, setFormMode] = useState("create");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [tournamentForView, setTournamentForView] = useState(null);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [tournamentManagementModalShow, setTournamentManagementModalShow] =
    useState(false);
  const [
    tournamentExtendedEndDateModalShow,
    setTournamentExtendedEndDateModalShow,
  ] = useState(false);
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

  // GET STATUS PARAMS
  const getStatusParam = () => {
    return tournamentStatusMap[showByStatus] || null;
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

  // Close navigation cards
  const handleCloseNavCards = () => {
    setTournamentForView(null);
  };

  // HANDLE TOURNAMENT MANAGEMENT DATA VALIDATION
  const handleTournamentManagementValidation = (data) => {
    const errors = TournamentManagementValidation(data);
    setTournamentManagementErrors(errors);
  };

  // HANDLE SUBMIT TOURNAMENT MANAGEMENT
  const handleSubmitTournamentManagement = async (e) => {
    e.preventDefault();

    // Validate form data
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

  // CHECK STATUS TO APPLY STYLES CLASS
  const statusClass = (status) => {
    switch (status.toString().toUpperCase()) {
      case "PENDING":
        return "text-yellow-500 font-bold";

      case "ACTIVE":
        return "text-blue-500 font-bold";

      case "COMPLETED":
        return "text-green-500 font-bold";

      case "TERMINATED":
        return "text-red-500 font-bold";
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
      await apiClient.put(
        `/tournaments/terminate/${selectedTournament.tournament_id}`
      );
      fetchTournamentList(); // Refresh the tournament list
      Toast({
        title: "Success",
        message: "Tournament has been terminated.",
        type: "success",
      });

      // Close modal and set selected tournament to null
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

  // HANDLE CONFIRM EXTEND TOURNAMENT DATE
  const handleConfirmExtendTournamentDate = async (e) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      setIsSubmitting(true);

      const response = await apiClient.put(
        `/tournaments/extend/${selectedTournament.tournament_id}`,
        {},
        {
          params: {
            newEndDate: FormatToISODate(tournamentExtendedEndDate),
          },
        }
      );

      if (response.data.http_status === 200) {
        Toast({
          title: "Success",
          message: response.data.message,
          type: "success",
        });
        fetchTournamentList();
        handleCloseTournamentExtendedEndDateModal();
      }
    } catch (error) {
      Toast({
        title: "Error",
        type: "error",
        message: error.response?.data?.message || "Error processing request.",
      });
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
      setTournamentExtendedEndDate(null); // Reset the extended end date
    }
  };

  // FETCH TOURNAMENT LIST
  const fetchTournamentList = async () => {
    try {
      setIsLoading(true);

      const sortByParam = getSortByParam();
      const statusParam = getStatusParam();

      const response = await apiClient.get("tournaments", {
        params: {
          pageNo: pageIndex - 1,
          pageSize,
          status: statusParam,
          sortBy: sortByParam,
          keyword: debouncedSearchTerm || undefined,
        },
      });

      if (response.data.http_status === 200) {
        const data = response.data.data;
        setTournamentList(data.content || []);
        setTotalPages(data.total_pages || 1);
      }
    } catch (error) {
      Toast({
        title: "Error",
        type: "error",
        message:
          error.response?.data?.message || "Failed to fetch tournament list.",
      });
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
  // CONFIRM MODAL
  const handleOpenConfirmModal = () => {
    setConfirmModalShow(true);
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
  };

  // TOURNAMENT EXTENDED END DATE MODAL
  const handleOpenTournamentExtendedEndDateModal = (tournament = null) => {
    setTournamentExtendedEndDateModalShow(true);
    setSelectedTournament(tournament);

    if (tournament) {
      setTournamentExtendedEndDate(
        FormatDateInput(new Date().getTime() + 86400000) || ""
      );
    }
  };

  const handleCloseTournamentExtendedEndDateModal = () => {
    setTournamentExtendedEndDateModalShow(false);
    setTournamentExtendedEndDate(null);
    setSelectedTournament(null);
  };

  // DATA MANIPULATION FOR TOURNAMENT MANAGEMENT MODAL WHEN OPENED
  /**
   * Opens the tournament modal in create or edit mode.
   * @param {object|null} tournament - The tournament to edit. If null, creates a new one. Default value is NULL.
   */
  const handleOpenTournamentManagementModal = (tournament = null) => {
    setTournamentManagementModalShow(true);
    setSelectedTournament(tournament);
    setFormMode(tournament ? "edit" : "create");

    // If tournament is not null - edit mode
    if (tournament) {
      setFormData({
        tournament_name: tournament?.tournament_name || "",
        start_date:
          FormatDateInput(tournament?.start_date) ||
          FormatToISODate(new Date().getTime() + 1 * 86400000),
        end_date: FormatDateInput(tournament?.end_date) || "",
        tournament_context: tournament?.tournament_context || "",
        team_number: tournament?.team_number || 2,
      });
    } else {
      // If tournament is null - create mode
      setFormData({
        tournament_name: tournament?.tournament_name || "",
        start_date:
          FormatDateInput(tournament?.start_date) ||
          FormatToISODate(new Date().getTime() + 1 * 86400000),
        end_date:
          FormatDateInput(tournament?.end_date) ||
          FormatToISODate(new Date().getTime() + 2 * 86400000),
        tournament_context: tournament?.tournament_context || "",
        team_number: tournament?.team_number || 2,
      });
    }
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
  }, [
    pageSize,
    pageIndex,
    sortByKey,
    sortDirection,
    debouncedSearchTerm,
    showByStatus,
  ]);

  // SET START DATE AND END DATE VALUE FOR EDIT TOURNAMENT
  useEffect(() => {
    if (
      formMode === "edit" &&
      selectedTournament?.start_date &&
      selectedTournament?.end_date
    ) {
      const now = new Date();
      const originalStart = new Date(selectedTournament.start_date);
      const originalEnd = new Date(selectedTournament.end_date);

      const isPastStart = originalStart <= now;
      const isPastEnd = originalEnd <= now;

      setFormData((prev) => ({
        ...prev,
        start_date: FormatToISODate(
          isPastStart ? new Date(now.getTime() + 1 * 86400000) : originalStart
        ),
        end_date: FormatToISODate(
          isPastEnd ? new Date(now.getTime() + 2 * 86400000) : originalEnd
        ),
      }));
    }
  }, [formMode, selectedTournament]);

  // Watch changes to start_date and end_date
  useEffect(() => {
    const start = new Date(formData.start_date);
    const end = new Date(formData.end_date);

    if (start >= end) {
      setFormData((prev) => ({
        ...prev,
        end_date: FormatToISODate(new Date(start.getTime() + 1 * 86400000)),
      }));
    } else if (end <= start) {
      setFormData((prev) => ({
        ...prev,
        start_date: FormatToISODate(new Date(end.getTime() - 1 * 86400000)),
      }));
    }
  }, [formData.start_date, formData.end_date]);

  useEffect(() => {
    if (!selectedTournament?.end_date) return;

    const now = new Date();
    const tournamentEnd = new Date(selectedTournament.end_date);

    const isFuture = FormatToISODate(tournamentEnd) > FormatToISODate(now);

    const newBaseDate = isFuture
      ? new Date(tournamentEnd.getTime() + 86400000)
      : new Date(now.getTime() + 86400000);

    setTournamentExtendedEndDate(FormatDateInput(newBaseDate));
  }, [selectedTournament]);
  //#endregion

  return (
    <>
      {isLoading && <Spinner />}

      <Breadcrumb items={breadcrumbItems} />

      {/* Search and Status Select*/}
      <div className="flex flex-col p-4">
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPageIndex(1); // Reset to page 1 on search
            }}
            className="px-4 py-2 border border-gray-300 rounded w-full sm:max-w-xl"
          />
        </div>

        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <Select
            options={statusOptions}
            value={showByStatus}
            placeHolder="Select status"
            onChange={(e) => {
              setShowByStatus(e.target.value);
            }}
            className="w-full sm:max-w-xl"
          />
        </div>
      </div>

      {/* Create New Tournament */}
      <div className="flex justify-between items-center px-4">
        <h3 className="font-medium text-lg">Tournament Management</h3>
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
            {/* If Tournament List Is Empty */}
            {tournamentList.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length + 1}
                  className="text-h2 text-red-600 text-center"
                >
                  No tournaments found.
                </TableCell>
              </TableRow>
            ) : (
              /* Or Else */
              tournamentList.map((row, idx) => (
                <TableRow
                  key={idx}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  index={idx}
                >
                  {columns.map((col) => {
                    // Render TOURNAMENT NAME column
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
                    // Render DATE columns
                    if (
                      ["created_date", "start_date", "end_date"].includes(
                        col.key
                      )
                    ) {
                      return (
                        <TableCell key={col.key}>
                          {ConvertDate(row[col.key])}
                        </TableCell>
                      );
                    }

                    // Render TEAM NUMBER column
                    if (col.key === "team_number") {
                      return (
                        <TableCell key={col.key}>
                          {`${row.team_list?.length || 0}/${row.team_number}`}
                        </TableCell>
                      );
                    }

                    // Render STATUS column
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

                    // Render ACTIONS column
                    if (col.key === "actions") {
                      return (
                        <>
                          <TableCell className="text-center">
                            <DasrsTournamentActions
                              status={row.status}
                              preventEdit={
                                row.is_started ||
                                row.status.toString().toLowerCase() ===
                                  "terminated"
                              }
                              onExtend={() =>
                                handleOpenTournamentExtendedEndDateModal(row)
                              }
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
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
          <DasrsPagination
            pageSize={pageSize}
            pageIndex={pageIndex}
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

      {/* Tournament Management Modal */}
      <Modal
        size="xl"
        onHide={handleCloseTournamentManagementModal}
        show={tournamentManagementModalShow}
      >
        <Modal.Header
          content={
            formMode === "edit" ? "Edit Tournament" : "Create New Tournament"
          }
        />
        <Modal.Body>
          <form
            id="tournamentManagementForm"
            onSubmit={handleSubmitTournamentManagement}
            className="space-y-4 pt-4"
          >
            {/* Tournament Name */}
            <div className="gap-2 grid w-full">
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
                <p className="text-red-500 text-xs">
                  {tournamentManagementErrors.tournament_name}
                </p>
              )}
            </div>

            {/* Start Date */}
            <div className="gap-2 grid w-full">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                type="date"
                id="start_date"
                name="start_date"
                value={FormatDateInput(formData.start_date) || ""}
                // Created or edited tournament must start at least 1 day from now
                min={FormatDateInput(new Date().getTime() + 1 * 86400000)}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    start_date: e.target.value,
                  });
                }}
              />
              {tournamentManagementErrors.start_date && (
                <p className="text-red-500 text-xs">
                  {tournamentManagementErrors.start_date}
                </p>
              )}
            </div>

            {/* End Date */}
            <div className="gap-2 grid w-full">
              <Label htmlFor="end_date">End Date</Label>
              <Input
                type="date"
                value={FormatDateInput(formData.end_date) || ""}
                // Created or edited tournament must end at least 1 day after start date
                min={FormatDateInput(
                  new Date(formData.start_date).getTime() + 1 * 86400000
                )}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    end_date: e.target.value,
                  });
                }}
              />
              {tournamentManagementErrors.end_date && (
                <p className="text-red-500 text-xs">
                  {tournamentManagementErrors.end_date}
                </p>
              )}
            </div>

            {/* Tournament Content */}
            <div className="gap-2 grid w-full">
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
                <p className="text-red-500 text-xs">
                  {tournamentManagementErrors.tournament_context}
                </p>
              )}
            </div>

            {/* Team numbers */}
            <div className="gap-2 grid w-full">
              <Label htmlFor="team_number">Number of Teams</Label>
              <Input
                type="number"
                id="team_number"
                name="team_number"
                min={2}
                max={20}
                step={1}
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
                <p className="text-red-500 text-xs">
                  {tournamentManagementErrors.team_number}
                </p>
              )}
            </div>
          </form>
        </Modal.Body>

        <Modal.Footer>
          <ButtonIcon
            type="button"
            onClick={handleCloseTournamentManagementModal}
            content="Cancel"
          />
          <ButtonIcon
            type="submit"
            disabled={isSubmitting}
            bgColor="#FFF"
            form="tournamentManagementForm"
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
        </Modal.Footer>
      </Modal>

      {/* Tournament Exteded End Date Modal */}
      <Modal
        size="xl"
        onHide={handleCloseTournamentExtendedEndDateModal}
        show={tournamentExtendedEndDateModalShow}
      >
        <Modal.Header content="Extend Tournament" />

        <Modal.Body>
          <form
            id="extendTournamentForm"
            onSubmit={handleConfirmExtendTournamentDate}
            className="space-y-4 pt-4"
          >
            <>
              {/* Tournament Name */}
              <h1 className="mb-5 text-3xl">
                {selectedTournament?.tournament_name}
              </h1>

              <div>
                <p className="text-yellow-600 text-sm">
                  Tournament occuring day will be from{" "}
                  <strong>
                    {selectedTournament?.start_date} -{" "}
                    {ConvertDate(tournamentExtendedEndDate)}
                  </strong>
                </p>
              </div>

              <div className="gap-2 grid w-full">
                <Label htmlFor="end_date">Old End Date</Label>
                <Input
                  type="date"
                  disabled
                  value={FormatDateInput(selectedTournament?.end_date) || ""}
                />
              </div>

              {/* Extended End Date */}
              <div className="gap-2 grid w-full">
                <Label htmlFor="end_date">New End Date</Label>
                <Input
                  type="date"
                  value={FormatDateInput(tournamentExtendedEndDate) || ""}
                  min={
                    FormatToISODate(selectedTournament?.end_date) <
                    FormatToISODate(new Date())
                      ? FormatDateInput(new Date(Date.now() + 86400000))
                      : FormatDateInput(
                          new Date(selectedTournament?.end_date).getTime() +
                            86400000
                        )
                  }
                  onChange={(e) => {
                    setTournamentExtendedEndDate(e.target.value);
                  }}
                />
              </div>
            </>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <ButtonIcon
            type="button"
            onClick={handleCloseTournamentExtendedEndDateModal}
            content="Cancel"
          />
          <ButtonIcon
            type="submit"
            disabled={isSubmitting}
            form="extendTournamentForm"
            bgColor="#FFF"
            className="w-46"
            content={
              isSubmitting ? (
                <>
                  <LoadingIndicator size="small" className="mr-2" />
                </>
              ) : (
                "Save Changes"
              )
            }
          />
        </Modal.Footer>
      </Modal>
    </>
  );
};
