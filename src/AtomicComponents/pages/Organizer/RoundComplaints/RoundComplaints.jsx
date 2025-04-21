import { Button } from "@/AtomicComponents/atoms/Button/Button";
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
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import { ComplaintReplyValidation } from "@/utils/Validation";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const isPending = (status) => status?.toString().toUpperCase() === "PENDING";

const RoundComplaints = () => {
  const { roundId } = useParams();
  const [round, setRound] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showByStatus, setShowByStatus] = useState("all");
  const [error, setError] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [complaintReplyData, setComplaintReplyData] = useState({
    reply: "",
    status: "",
  });
  const [complaintErrors, setComplaintErrors] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [roundRes, complaintsRes] = await Promise.all([
        apiClient.get(`rounds/${roundId}`),
        apiClient.get(`complaints/round/${roundId}`),
      ]);
      setRound(roundRes.data.data);
      setComplaints(complaintsRes.data.data.content);
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Failed to load data.",
      });
      setError("Failed to load complaints");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REPLY VALIDATION
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
        fetchData();
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
  //#endregion

  //#region USEEFFECTS
  useEffect(() => {
    if (roundId) fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundId, showByStatus]);
  //#endregion

  return (
    <div className="p-4">
      {isLoading && <Spinner />}

      {/* Display Errors If Any Found */}
      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center">
        {" "}
        <h1 className="mb-6 font-bold text-gray-700 text-2xl text-center">
          Complaints of - Round: {round?.round_name}
        </h1>
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
            onChange={(e) => {
              setShowByStatus(e.target.value);
            }}
            className="w-full sm:max-w-xs"
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

            {/* Created */}
            <p className="text-gray-500">
              <strong>Created:</strong> {selectedComplaint?.created_date}
            </p>

            {/* Updated */}
            <p className="text-gray-500">
              <strong>Updated:</strong> {selectedComplaint?.last_modified_date}
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
                <p className="text-red-500 text-xs">{complaintErrors.reply}</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <Modal.Footer>
            <Button
              content="Reject"
              disabled={!isPending(selectedComplaint?.status)}
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
    </div>
  );
};

export default RoundComplaints;
