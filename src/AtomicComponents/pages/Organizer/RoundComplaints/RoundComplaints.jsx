import { Button } from "@/AtomicComponents/atoms/Button/Button";
import Checkbox from "@/AtomicComponents/atoms/Checkbox/Checkbox";
import Input from "@/AtomicComponents/atoms/Input/Input";
import Select from "@/AtomicComponents/atoms/Select/Select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import ComplaintCard from "@/AtomicComponents/molecules/ComplaintCard/ComplaintCard";
import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import { ComplaintReplyValidation } from "@/utils/Validation";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Tooltip } from "recharts";

// STATUS CLASS CSS
const statusClass = (status) => {
  const base = "font-semibold px-2 py-1 rounded text-sm";
  switch (status?.toUpperCase()) {
    case "PENDING":
      return `${base} bg-yellow-100 text-yellow-800`;
    case "APPROVED":
      return `${base} bg-green-100 text-green-800`;
    case "REJECTED":
      return `${base} bg-red-100 text-red-800`;
    default:
      return `${base} bg-blue-100 text-blue-800`;
  }
};

// STATUS OPTIONS FOR SELECT
const statusOptions = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// KEY MAPPING FOR TOURNAMENT STATUS
const complaintsStatusMap = {
  all: "",
  pending: "PENDING",
  approved: "APPROVED",
  rejected: "REJECTED",
};

// CHECK IF STATUS IS PENDING
const isPending = (status) => status?.toString().toUpperCase() === "PENDING";
const displayedValues = [6, 9, 12, 15];

const RoundComplaints = () => {
  //#region VARIABLES DECLARATION
  const { roundId } = useParams();
  const [round, setRound] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showByStatus, setShowByStatus] = useState("all");
  const [error, setError] = useState(null);
  const [pageSize, setPageSize] = useState(displayedValues[0]);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectOptions, setSelectOptions] = useState([]);
  const [expandedTeams, setExpandedTeams] = useState([]);
  const [allComplaints, setAllComplaints] = useState([]);
  const [rematchData, setRematchData] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [rematchModalShow, setRematchModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [complaintReplyData, setComplaintReplyData] = useState({
    reply: "",
    status: "",
  });
  const [complaintErrors, setComplaintErrors] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  //#endregion

  // CHECK IF THERE IS ANY APPROVED COMPLAINTS TO RENDER REMATCH CREATE BUTTON
  const hasApprovedComplaint = allComplaints.some(
    (complaint) => complaint.status?.toUpperCase() === "APPROVED"
  );

  // RETURN SET OF DISABLED MATCH TEAM IDS OR SELECT OPTIONS AND ONLY RE-RENDER IF ALL COMPLAINTS CHANGE
  const disabledMatchTeamIds = useMemo(() => {
    return new Set(
      allComplaints
        .filter((c) => c.has_rematch && c.match_team_id)
        .map((c) => c.match_team_id)
    );
  }, [allComplaints]);

  // GET STATUS PARAMS
  const getStatusParam = () => {
    return complaintsStatusMap[showByStatus] || null;
  };

  // COLLAPSING TEAMS
  const toggleTeamCollapse = (team) => {
    setExpandedTeams((prev) =>
      prev.includes(team) ? prev.filter((t) => t !== team) : [...prev, team]
    );
  };

  // TEAM SELECT ALL
  const toggleTeamSelect = (team) => {
    const playersInTeam = selectOptions.filter((option) =>
      option.label.includes(team)
    );

    const enabledPlayers = playersInTeam.filter(
      (player) => !disabledMatchTeamIds.has(player.value)
    );

    const allEnabledChecked = enabledPlayers.every((player) =>
      rematchData.includes(player.value)
    );

    if (allEnabledChecked) {
      // Deselect only enabled players
      const toRemove = enabledPlayers.map((p) => p.value);
      setRematchData((prev) => prev.filter((id) => !toRemove.includes(id)));
    } else {
      // Select only enabled & unchecked players
      const toAdd = enabledPlayers
        .map((p) => p.value)
        .filter((id) => !rematchData.includes(id));
      setRematchData((prev) => [...prev, ...toAdd]);
    }
  };

  // FETCH ROUND DATA
  const fetchRoundData = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(`rounds/${roundId}`);
      setRound(res.data.data);
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Failed to load data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH COMPLAINTS DATA
  const fetchComplaintsData = async () => {
    const statusParam = getStatusParam();

    try {
      setIsLoading(true);
      setError(null);
      const res = await apiClient.get(`complaints/round/${roundId}`, {
        params: {
          pageNo: pageIndex - 1,
          pageSize,
          sortBy: "status",
          sortDirection: "desc",
          status: statusParam,
        },
      });
      setComplaints(res.data.data.content);
      setTotalPages(res.data.data.total_pages || 1);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints.");
    } finally {
      setIsLoading(false);
    }
  };

  // REPLY VALIDATION
  const validateReply = () => {
    const errors = ComplaintReplyValidation(complaintReplyData);
    setComplaintErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 📨 HANDLE STATUS CHANGE
  const handleConfirmStatusChange = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.put(
        `complaints/reply/${selectedComplaint?.id}`,
        complaintReplyData
      );

      if (res.data.http_status === 200) {
        await Promise.all([
          fetchComplaintsData(),
          fetchAllComplaints(),
          fetchAvailableMatchTeamId(),
        ]);

        Toast({
          title: "Success",
          type: "success",
          message: `Complaint ${confirmAction} successfully.`,
        });

        handleCloseComplaintModal();
        handleCloseConfirmModal();
      }
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Failed to process complaint.",
      });
      handleCloseConfirmModal();
    } finally {
      setIsLoading(false);
    }
  };

  // FETCH ALL COMPLAINTS
  const fetchAllComplaints = async () => {
    try {
      const res = await apiClient.get(`complaints/round/${roundId}`, {
        params: {
          pageNo: 0,
          pageSize: 1000, // large enough to fetch all (adjust if needed)
          sortBy: "status",
          sortDirection: "desc",
        },
      });
      setAllComplaints(res.data.data.content);
    } catch (err) {
      if (err.code === "ECONNABORTED") {
        Toast({
          title: "Timeout",
          type: "error",
          message:
            "The server is taking too long to respond. Please try again.",
        });
      } else {
        setError("Failed to load complaints. Please try again.");
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    }
  };

  // GET AVAILABLE MATCHTEAMID FOR REMATCH
  const fetchAvailableMatchTeamId = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get(
        `complaints/round/${roundId}/status/APPROVED`
      );

      const resSelectOptions = res.data.data
        .map((item) => ({
          value: item.match_team_id,
          label: `${item.full_name} (${item.team_name})`,
        }))
        .filter(
          (option, index, self) =>
            index === self.findIndex((o) => o.value === option.value)
        );
      setSelectOptions(resSelectOptions);
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

  // HANDLE REMATCH FORM SUBMIT
  const handleSubmitRematchForm = async (e) => {
    e.preventDefault();

    const validMatchIds = rematchData.filter((id) => !!id);

    const params = new URLSearchParams();
    validMatchIds.forEach((id) => {
      params.append("matchTeamId", id);
    });

    try {
      setIsLoading(true);
      const res = await apiClient.post(`/matches/rematch?${params.toString()}`);

      if (res.data.http_status === 200) {
        Toast({
          title: "Success",
          type: "success",
          message: res.data.message || "Rematch created successfully.",
        });
      }

      await Promise.all([
        fetchComplaintsData(),
        fetchAllComplaints(),
        fetchAvailableMatchTeamId(),
      ]);

      handleCloseRematchModal();
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

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  //#region MODAL CONTROLLERS
  // COMPLAINT MODAL
  const handleOpenComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
    setComplaintModalShow(true);
    setComplaintReplyData({
      reply: complaint?.reply || "",
      status: complaint?.status || "",
    });
  };

  const handleCloseComplaintModal = () => {
    setComplaintModalShow(false);
    setSelectedComplaint(null);
    setComplaintReplyData({ reply: "", status: "" });
    setComplaintErrors({});
  };

  // CONFIRM MODAL
  const handleOpenConfirmModal = (action) => {
    if (!validateReply()) return;
    setConfirmAction(action);
    setConfirmModalShow(true);
    setComplaintReplyData((prev) => ({
      ...prev,
      status: action === "approve" ? "APPROVED" : "REJECTED",
    }));
  };

  const handleCloseConfirmModal = () => {
    setConfirmModalShow(false);
    setConfirmAction(null);
  };

  // REMATCH MODAL
  const handleOpenRematchModal = () => {
    setRematchModalShow(true);
  };

  const handleCloseRematchModal = () => {
    setRematchModalShow(false);
  };
  //#endregion

  //#region USEEFFECTS
  // FETCH DATA ON MOUNT
  useEffect(() => {
    if (!roundId) return;
    fetchRoundData();
    fetchAllComplaints();
    fetchAvailableMatchTeamId();
    setPageIndex(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, showByStatus]);

  // FETCH COMPLAINTS DATA ON CHANGE
  useEffect(() => {
    if (roundId) {
      fetchComplaintsData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, showByStatus, pageIndex, pageSize]);
  //#endregion

  return (
    <>
      <div className="z-50">{isLoading && <Spinner />}</div>

      <div className="relative p-4">
        {/* Display Errors If Any Found */}
        {error && (
          <div className="bg-red-50 mb-10 px-4 py-3 border border-red-200 rounded-md text-red">
            {error}
          </div>
        )}

        {/* SHOW BY STATUS */}
        <div className="flex flex-col items-center">
          {" "}
          <h1 className="font-bold text-gray-700 text-2xl text-center">
            Complaints of Round: {round?.round_name}
          </h1>
          <h className="mb-6 font-bold text-yellow-600 text-sm italic">
            (There must be one approved complaint in order to create rematch)
          </h>
          <div className="flex items-center gap-4 mb-4">
            <Label
              htmlFor="showByStatus"
              className="font-semibold text-gray-700 whitespace-nowrap"
            >
              Show By Status
            </Label>
            <Select
              options={statusOptions}
              value={showByStatus}
              placeHolder={"Select status"}
              onChange={(e) => {
                setShowByStatus(e.target.value);
              }}
              className="w-full sm:max-w-xs"
            />
          </div>
          <div className="flex justify-center mb-6">
            <Button
              content="Create Rematch For Round"
              disabled={!hasApprovedComplaint}
              tooltipData={
                hasApprovedComplaint
                  ? "Create a rematch for this round"
                  : "You cannot create a rematch for this round"
              }
              tooltipId="create-button-tooltip"
              onClick={handleOpenRematchModal}
              className="px-6 py-2"
            />
          </div>
        </div>

        {/* Complaint Card Render */}
        {complaints.length === 0 ? (
          <p className="font-medium text-red-500 text-center">
            No complaints found.
          </p>
        ) : (
          <div className="gap-x-20 gap-y-10 grid md:grid-cols-2 lg:grid-cols-3">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => handleOpenComplaintModal(complaint)}
              />
            ))}
          </div>
        )}

        {/* Complaint Modal */}
        <Modal
          size="md"
          show={complaintModalShow}
          onHide={handleCloseComplaintModal}
        >
          <Modal.Header content="Complaint Details" />
          <Modal.Body>
            <div className="flex flex-col gap-4 text-gray-700 text-sm">
              {/* ID + Status */}
              <div className="flex justify-between items-center">
                <h2 className="font-semibold text-lg">
                  Complaint ID: {selectedComplaint?.id}
                </h2>
                <span
                  className={`${statusClass(
                    selectedComplaint?.status
                  )} px-3 py-2`}
                >
                  {selectedComplaint?.status}
                </span>
              </div>

              {/* Title */}
              <p>
                <strong>Title:</strong> {selectedComplaint?.title}
              </p>

              {/* Description */}
              <p>
                <strong>Description:</strong> {selectedComplaint?.description}
              </p>

              {/* Team */}
              <p>
                <strong>Team:</strong> {selectedComplaint?.team_name || "N/A"}
              </p>

              {/* Match */}
              <p>
                <strong>Match:</strong> {selectedComplaint?.match_name || "N/A"}
              </p>

              {/* Account */}
              <p>
                <strong>Account ID:</strong>{" "}
                {selectedComplaint?.account_id || "N/A"}
              </p>

              <p>
                <strong>Rematch Status:</strong>{" "}
                {selectedComplaint?.has_rematch ? (
                  <span className="font-medium text-green-600">
                    Already has rematch
                  </span>
                ) : (
                  <span className="font-medium text-red-600">
                    Not created rematch
                  </span>
                )}
              </p>

              {/* Created */}
              <p className="text-gray-500">
                <strong>Created:</strong> {selectedComplaint?.created_date}
              </p>

              {/* Updated */}
              <p className="text-gray-500">
                <strong>Updated:</strong>{" "}
                {selectedComplaint?.last_modified_date}
              </p>

              {/* Reply Input */}
              <div className="gap-2 grid w-full">
                <Label htmlFor="complaint_reply">Your reply</Label>
                <Input
                  id="complaint_reply"
                  value={complaintReplyData.reply}
                  placeholder="Enter your reply here..."
                  disabled={!isPending(selectedComplaint?.status)}
                  onChange={(e) =>
                    setComplaintReplyData({
                      ...complaintReplyData,
                      reply: e.target.value,
                    })
                  }
                />
                {complaintErrors?.reply && (
                  <p className="text-red-500 text-xs">
                    {complaintErrors.reply}
                  </p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <Modal.Footer>
              <Button
                content="Reject"
                disabled={!isPending(selectedComplaint?.status)}
                tooltipId="reject-button-tooltip"
                tooltipData={
                  !isPending(selectedComplaint?.status)
                    ? "You cannot reject this complaint"
                    : ""
                }
                onClick={() => handleOpenConfirmModal("reject")}
              />
              <Button
                content="Approve"
                bgColor="#FFF"
                disabled={!isPending(selectedComplaint?.status)}
                tooltipId="approve-button-tooltip"
                tooltipData={
                  !isPending(selectedComplaint?.status)
                    ? "You cannot approve this complaint"
                    : ""
                }
                onClick={() => handleOpenConfirmModal("approve")}
              />
            </Modal.Footer>
          </Modal.Body>
        </Modal>

        {/* Confirm Modal */}
        <Dialog open={confirmModalShow} onOpenChange={handleCloseConfirmModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground text-sm">
              Are you sure you want to{" "}
              <strong className="text-black">{confirmAction}</strong> this
              complaint?
            </p>
            <DialogFooter>
              <Button content="No" onClick={handleCloseConfirmModal} />
              <Button
                content="Yes"
                onClick={handleConfirmStatusChange}
                bgColor="#FFF"
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Rematch Modal */}
        <Modal
          size="sm"
          show={rematchModalShow}
          onHide={handleCloseRematchModal}
        >
          <Modal.Header content="Create Rematch" />
          <Modal.Body>
            <form id="rematchForm" onSubmit={handleSubmitRematchForm}>
              <div className="flex flex-col gap-4 text-gray-700 text-sm">
                {[
                  ...new Set(
                    selectOptions.map((o) =>
                      o.label.split("(")[1].replace(")", "")
                    )
                  ),
                ].map((team) => {
                  const playersInTeam = selectOptions.filter((option) =>
                    option.label.includes(team)
                  );

                  const allChecked = playersInTeam.every((player) =>
                    rematchData.includes(player.value)
                  );

                  const isOpen = expandedTeams.includes(team);

                  const allDisabled = playersInTeam.every((player) =>
                    disabledMatchTeamIds.has(player.value)
                  );

                  return (
                    <div
                      key={team}
                      className={`p-3 border rounded-md cursor-pointer transition-colors duration-[.15s] ease-linear ${
                        allChecked && !allDisabled ? "bg-blue-100" : ""
                      } ${allDisabled ? "opacity-65" : ""}`}
                    >
                      <div
                        onClick={() => toggleTeamCollapse(team)}
                        className="group flex justify-between items-center mb-2 cursor-pointer"
                      >
                        <h5 className="font-semibold text-blue-700 text-h5 group-hover:underline group-hover:scale-105">
                          {team} {isOpen ? "▾" : "▸"}
                        </h5>

                        {!allDisabled && (
                          <p
                            onClick={(e) => {
                              e.stopPropagation(); // prevent triggering collapse when selecting all
                              toggleTeamSelect(team);
                            }}
                            className="text-blue-500 text-sm hover:underline"
                          >
                            {allChecked ? "Deselect All" : "Select All"}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {isOpen &&
                          playersInTeam.map((player) => (
                            <Checkbox
                              key={player.value}
                              id={`checkbox-${player.value}`}
                              label={player.label.split(" (")[0]}
                              checked={
                                rematchData.includes(player.value) ||
                                disabledMatchTeamIds.has(player.value)
                              }
                              disabled={disabledMatchTeamIds.has(player.value)}
                              onChange={(e) => {
                                if (disabledMatchTeamIds.has(player.value))
                                  return;

                                if (e.target.checked) {
                                  setRematchData((prev) => [
                                    ...prev,
                                    player.value,
                                  ]);
                                } else {
                                  setRematchData((prev) =>
                                    prev.filter((v) => v !== player.value)
                                  );
                                }
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          </Modal.Body>

          <Modal.Footer>
            <Button content="Cancel" onClick={handleCloseRematchModal} />
            <Button
              disabled={rematchData.filter(Boolean).length === 0}
              content="Create Rematch"
              bgColor="#FFF"
              tooltipData={
                rematchData.filter(Boolean).length === 0
                  ? "Please select at least one player"
                  : ""
              }
              tooltipId="modal-tooltip"
              form="rematchForm"
              type="submit"
            />

            <Tooltip id="modal-tooltip" style={{ borderRadius: "8px" }} />
          </Modal.Footer>
        </Modal>

        {/* Pagination */}
        <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
          <DasrsPagination
            pageSize={pageSize}
            pageIndex={pageIndex}
            page={pageIndex}
            count={totalPages}
            handlePagination={handlePagination}
            handleChangePageSize={handleChangePageSize}
            displayedValues={displayedValues}
          />
        </div>
      </div>
    </>
  );
};

export default RoundComplaints;
