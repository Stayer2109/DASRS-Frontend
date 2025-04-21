import { useEffect, useState } from "react";
import { Button } from "@/AtomicComponents/atoms/Button/Button";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import ComplaintCard from "@/AtomicComponents/molecules/ComplaintCard/ComplaintCard";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import {
  Modal,
  ModalBody,
  ModalHeader,
} from "@/AtomicComponents/organisms/Modal/Modal";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import Input from "@/AtomicComponents/atoms/Input/Input";
import { ComplaintReplyValidation } from "@/utils/Validation";
import { apiClient } from "@/config/axios/axios";

// STATUS STYLES
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

const isPending = (status) => status?.toString().toUpperCase() === "PENDING";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [confirmModalShow, setConfirmModalShow] = useState(false);
  const [complaintReplyData, setComplaintReplyData] = useState({
    reply: "",
    status: "",
  });
  const [complaintErrors, setComplaintErrors] = useState({});
  const [confirmAction, setConfirmAction] = useState(null);
  const [error, setError] = useState(null);

  // 📥 FETCH COMPLAINTS
  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      const res = await apiClient.get("complaints");
      if (res.data.http_status === 200) {
        setComplaints(res.data.data || []);
      }
    } catch (err) {
      setError("Failed to load complaints");
      Toast({
        title: "Error",
        type: "error",
        message:
          err.response?.data?.message ||
          "Something went wrong. Please try again.",
      });
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
        fetchComplaints();
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

  //#region USEFFECTS CONTROLLERS
  useEffect(() => {
    fetchComplaints();
    return () => {
      setComplaints([]);
      setError(null);
    };
  }, []);
  //#endregion

  return (
    <>
      {isLoading && <Spinner />}

      {error && (
        <div className="bg-red-50 px-4 py-3 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* If Complaint List Is Empty */}
      {complaints.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <h1 className="font-bold text-gray-700 text-2xl">
            No Complaints Found
          </h1>
          <p className="text-gray-500">There are no complaints to display.</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="font-bold text-gray-700 text-2xl">
            Player Complaints
          </h1>
          <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6 px-4 w-full max-w-[2000px]">
            {complaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => handleOpenComplaintModal(complaint)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      <Modal
        size="md"
        show={complaintModalShow}
        onHide={handleCloseComplaintModal}
      >
        <ModalHeader content="Complaint Details" />
        <ModalBody>
          <div className="flex flex-col gap-4 text-gray-700 text-sm">
            {/* ID + Status */}
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">
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

            {/* Created */}
            <p className="text-gray-500">
              <strong>Created:</strong> {selectedComplaint?.created_date}
            </p>

            {/* Updated */}
            <p className="text-gray-500">
              <strong>Updated:</strong> {selectedComplaint?.last_modified_date}
            </p>

            {/* Reply */}
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
          <div className="flex justify-end gap-4 mt-6 pt-4 border-t">
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
          </div>
        </ModalBody>
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
    </>
  );
};

export default Complaints;
