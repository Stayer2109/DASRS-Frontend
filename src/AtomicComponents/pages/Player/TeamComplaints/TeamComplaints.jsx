import { Breadcrumb } from "@/AtomicComponents/atoms/Breadcrumb/Breadcrumb";
import Select from "@/AtomicComponents/atoms/Select/Select";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import ComplaintCard from "@/AtomicComponents/molecules/ComplaintCard/ComplaintCard";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import { apiClient } from "@/config/axios/axios";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";
import { useState } from "react";

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

const TeamComplaints = () => {
  const { auth } = useAuth();
  const teamId = auth?.teamId;
  const [complaints, setComplaints] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showByStatus, setShowByStatus] = useState("all");
  const [complaintModalShow, setComplaintModalShow] = useState(false);
  const [error, setError] = useState(null);

  // GET STATUS PARAMS
  const getStatusParam = () => {
    return complaintsStatusMap[showByStatus] || null;
  };

  // 📥 FETCH COMPLAINTS
  const fetchComplaints = async () => {
    const statusParam = getStatusParam();

    try {
      setIsLoading(true);
      const res = await apiClient.get(`complaints/team/${teamId}`, {
        params: {
          status: statusParam,
          sortBy: "createdDate", // add this
          sortDirection: "ASC", // and this
        },
      });

      if (res.data.http_status === 200) {
        setComplaints(res.data.data || []);
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
        setError("Failed to load complaints");
        Toast({
          title: "Error",
          type: "error",
          message:
            err.response?.data?.message ||
            "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  //#region MODAL CONTROLLERS
  // COMPLAINT MODAL
  const handleOpenComplaintModal = (complaint) => {
    setSelectedComplaint(complaint);
    setComplaintModalShow(true);
  };

  const handleCloseComplaintModal = () => {
    setComplaintModalShow(false);
    setSelectedComplaint(null);
  };
  //#endregion

  //#region USEFFECTS CONTROLLERS
  useEffect(() => {
    fetchComplaints();

    return () => {
      setComplaints([]);
      setError(null);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showByStatus]);
  //#endregion

  return (
    <>
      {isLoading && <Spinner />}

      {/* Errors Render */}
      {error && (
        <div className="bg-red-50 mb-10 px-4 py-3 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      {/* Breadcrumb */}
      {/* <Breadcrumb items={breadcrumbItems} /> */}

      {/* If Complaint List Is Empty */}
      <div className="flex flex-col items-center">
        <h1 className="mb-6 font-bold text-gray-700 text-2xl">
          Player Complaints
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
            placeHolder={"Select status"}
            onChange={(e) => {
              setShowByStatus(e.target.value);
            }}
            className="w-full sm:max-w-xs"
          />
        </div>

        <div className="space-y-8 mt-6 px-4 w-full max-w-[2000px]">
          {complaints.length === 0 ? (
            <div className="flex flex-col justify-center items-center mt-30">
              <h1 className="font-bold text-gray-700 text-2xl">
                No Complaints Found
              </h1>
              <p className="text-gray-500">
                There are no complaints to display.
              </p>
            </div>
          ) : (
            <>
              {complaints.map((group) => (
                <div key={group?.round_id}>
                  <h2
                    className="inline font-semibold text-gray-800 text-xl"
                    title="Click to view all complaints in this round"
                  >
                    {group?.round_name}
                  </h2>

                  <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-2">
                    {group?.complaints?.map((complaint) => (
                      <ComplaintCard
                        key={complaint?.id}
                        mode="team"
                        complaint={complaint}
                        onClick={() =>
                          handleOpenComplaintModal({
                            ...complaint,
                            round_name: group.round_name,
                            round_id: group.round_id,
                          })
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

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
              <h2 className="font-semibold text-xl">
                Complaint: {selectedComplaint?.title}
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

            {/* Round Name */}
            <p>
              <strong>Round:</strong> {selectedComplaint?.round_name || "N/A"}
            </p>

            {/* Match */}
            <p>
              <strong>Match:</strong> {selectedComplaint?.match_name || "N/A"}
            </p>

            {/* Description */}
            <p>
              <strong>Description:</strong> {selectedComplaint?.description}
            </p>

            {/* Team */}
            <p>
              <strong>From:</strong> {selectedComplaint?.full_name || "N/A"}
            </p>

            {/* Reply Input */}
            <p>
              <p>
                <strong>Reply from Organizer: </strong>
                {selectedComplaint?.reply || "N/A"}{" "}
              </p>
            </p>

            {/* Created */}
            <p className="text-gray-500">
              <strong>Created:</strong> {selectedComplaint?.created_date}
            </p>

            {/* Updated */}
            <p className="text-gray-500">
              <strong>Updated:</strong> {selectedComplaint?.last_modified_date}
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TeamComplaints;
