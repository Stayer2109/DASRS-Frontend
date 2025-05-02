import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/molecules/Table/Table";
import { useEffect, useState } from "react";
import { Button as ShadcnButton } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus, Eye, Lock, Unlock } from "lucide-react";
import Modal from "@/AtomicComponents/organisms/Modal/Modal";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/AtomicComponents/atoms/shadcn/dialog";

import DasrsPagination from "@/AtomicComponents/molecules/DasrsPagination/DasrsPagination";
import Input from "@/AtomicComponents/atoms/Input/Input";
import Spinner from "@/AtomicComponents/atoms/Spinner/Spinner";
import { Tooltip } from "react-tooltip";
import { apiClient } from "@/config/axios/axios";
import { useDebounce } from "@/hooks/useDebounce";
import Select from "@/AtomicComponents/atoms/Select/Select";

const sortKeyMap = {
  account_id: "SORT_BY_ID",
  last_name: "SORT_BY_LASTNAME",
  first_name: "SORT_BY_FIRSTNAME",
  email: "SORT_BY_EMAIL",
  team_name: "SORT_BY_TEAMNAME",
  role_name: "SORT_BY_ROLENAME",
};

const userRoleParams = {
  ALL: "ALL",
  ORGANIZER: "ORGANIZER",
  PLAYER: "PLAYER",
};

export const UserManagement = () => {
  const [playerList, setPlayerList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showByRole, setShowByRole] = useState("ALL");
  const roleSelectOptions = [
    { value: "ALL", label: "ALL" },
    { value: "PLAYER", label: "Player" },
    { value: "ORGANIZER", label: "Organizer" },
  ];

  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortByKey, setSortByKey] = useState("account_id"); // default sort key
  const [sortDirection, setSortDirection] = useState("ASC"); // "ASC", "DESC", or null
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccount, setNewAccount] = useState({
    email: "",
    address: "",
    phone: "",
    first_name: "",
    last_name: "",
    role_id: 2, // Fixed to Organizer role
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [isLoadingUserDetails, setIsLoadingUserDetails] = useState(false);
  const [isLockingUser, setIsLockingUser] = useState(false);

  // Add state for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [userToToggle, setUserToToggle] = useState(null);

  const columns = [
    { key: "account_id", label: "ID", sortable: true },
    { key: "last_name", label: "Last Name", sortable: true },
    { key: "first_name", label: "First Name", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone", sortable: false },
    { key: "role_name", label: "Role", sortable: true },
    { key: "is_locked", label: "Status", sortable: true },
  ];

  // GET SORT PARAMS
  const getSortByParam = () => {
    if (!sortByKey || !sortDirection) return null;
    const baseKey = sortKeyMap[sortByKey];
    return baseKey ? `${baseKey}_${sortDirection}` : null;
  };

  const getRoleParam = () => {
    return userRoleParams[showByRole] || null;
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

  //#region PAGINATION
  const handlePagination = (_pageSize, newPageIndex) => {
    setPageIndex(newPageIndex);
  };

  const handleChangePageSize = (newSize) => {
    setPageSize(newSize);
    setPageIndex(1);
  };
  //#endregion

  const handleCreateAccount = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);
      const response = await apiClient.post("accounts/by-admin", {
        ...newAccount,
        role_id: 2, // Ensure role_id is always 2 for Organizer
      });

      if (
        response.data.http_status === 200 ||
        response.data.http_status === 201
      ) {
        Toast({
          title: "Success",
          message: "Organizer account created successfully",
          type: "success",
        });
        setShowAddModal(false);
        // Reset form
        setNewAccount({
          email: "",
          address: "",
          phone: "",
          first_name: "",
          last_name: "",
          role_id: 2,
        });
        // Refresh the table
        fetchData();
      }
    } catch (error) {
      Toast({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to create organizer account",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to fetch user details
  const fetchUserDetails = async (userId) => {
    try {
      setIsLoadingUserDetails(true);
      const response = await apiClient.get(`accounts`, {
        params: { id: userId },
      });

      if (response.data.http_status === 200) {
        setSelectedUser(response.data.data);
        setShowUserDetailsModal(true);
      }
    } catch (error) {
      Toast({
        title: "Error",
        message:
          error.response?.data?.message || "Failed to fetch user details",
        type: "error",
      });
    } finally {
      setIsLoadingUserDetails(false);
    }
  };

  // Modified function to show confirmation dialog first
  const handleToggleLockClick = (userId, currentLockStatus) => {
    setUserToToggle({ userId, currentLockStatus });
    setConfirmDialogOpen(true);
  };

  // Function to actually toggle user lock status after confirmation
  const toggleUserLockStatus = async () => {
    if (!userToToggle) return;

    const { userId, currentLockStatus } = userToToggle;

    try {
      setIsLockingUser(true);
      const response = await apiClient.put(
        `accounts/lock/${userId}?lock=${!currentLockStatus}`
      );

      if (response.data.http_status === 200) {
        Toast({
          title: "Success",
          message: `User ${
            !currentLockStatus ? "locked" : "unlocked"
          } successfully`,
          type: "success",
        });

        // Update the user in the list
        setPlayerList((prevList) =>
          prevList.map((user) =>
            user.account_id === userId
              ? { ...user, is_locked: !currentLockStatus }
              : user
          )
        );

        // If user details modal is open, update the selected user
        if (selectedUser && selectedUser.account_id === userId) {
          setSelectedUser((prev) => ({
            ...prev,
            is_locked: !currentLockStatus,
          }));
        }
      }
    } catch (error) {
      Toast({
        title: "Error",
        message:
          error.response?.data?.message ||
          `Failed to ${currentLockStatus ? "unlock" : "lock"} user`,
        type: "error",
      });
    } finally {
      setIsLockingUser(false);
      setConfirmDialogOpen(false);
      setUserToToggle(null);
    }
  };

  // Add fetchData function to be used elsewhere
  const fetchData = async () => {
    const sortByParam = getSortByParam();
    const statusParam = getRoleParam();

    try {
      setIsLoading(true);
      const response = await apiClient.get("accounts/admin", {
        params: {
          pageNo: pageIndex - 1,
          pageSize,
          sortBy: sortByParam,
          keyword: debouncedSearchTerm || undefined,
          role: statusParam,
        },
      });

      if (response.data.http_status === 200) {
        const data = response.data.data;
        setPlayerList(response.data.data.content);
        setTotalPages(data.total_pages || 1);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    pageIndex,
    sortByKey,
    sortDirection,
    debouncedSearchTerm,
    showByRole,
  ]);

  return (
    <>
      {isLoading && <Spinner />}
      {isLoadingUserDetails && <Spinner />}
      {isLockingUser && <Spinner />}
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <ShadcnButton
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Organizer
          </ShadcnButton>
        </div>
        <div className="flex flex-wrap justify-between gap-2 mb-4">
          <Input
            type="text"
            placeholder="Search account by email or last name or first name ..."
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
            options={roleSelectOptions}
            value={showByRole}
            placeHolder="Select role"
            onChange={(e) => {
              setShowByRole(e.target.value);
            }}
            className="w-full sm:max-w-xl"
          />
        </div>
      </div>

      <div className="p-4">
        <Table>
          <TableHeader
            columns={[
              ...columns,
              { key: "actions", label: "Actions", sortable: false },
            ]}
            sortBy={sortByKey}
            sortDirection={sortDirection?.toLowerCase()}
            onSort={handleSort}
          />
          <TableBody>
            {playerList.map((row, idx) => (
              <TableRow
                key={idx}
                pageIndex={pageIndex}
                pageSize={pageSize}
                index={idx}
              >
                {columns.map((col) => {
                  if (col.key === "email") {
                    return (
                      <TableCell key={col.key}>
                        <a
                          href={`mailto:${row[col.key]}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                          data-tooltip-id="my-tooltip"
                          data-tooltip-content={`Send email to ${row[col.key]}`}
                          data-tooltip-place="top"
                        >
                          {row[col.key]}
                          <Tooltip
                            id="my-tooltip"
                            style={{ borderRadius: "12px" }}
                          />
                        </a>
                      </TableCell>
                    );
                  } else if (col.key === "is_locked") {
                    return (
                      <TableCell key={col.key}>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row[col.key]
                              ? "bg-red-100 text-red-800 border border-red-200"
                              : "bg-green-100 text-green-800 border border-green-200"
                          }`}
                        >
                          {row[col.key] ? "Locked" : "Active"}
                        </span>
                      </TableCell>
                    );
                  } else {
                    return <TableCell key={col.key}>{row[col.key]}</TableCell>;
                  }
                })}
                <TableCell>
                  <div className="flex space-x-2">
                    <ShadcnButton
                      variant="outline"
                      size="sm"
                      onClick={() => fetchUserDetails(row.account_id)}
                      className="flex items-center gap-1"
                      data-tooltip-id="view-tooltip"
                      data-tooltip-content="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </ShadcnButton>
                    <ShadcnButton
                      variant={row.is_locked ? "outline" : "destructive"}
                      size="sm"
                      onClick={() =>
                        handleToggleLockClick(row.account_id, row.is_locked)
                      }
                      className="flex items-center gap-1"
                      data-tooltip-id="lock-tooltip"
                      data-tooltip-content={
                        row.is_locked ? "Unlock Account" : "Lock Account"
                      }
                    >
                      {row.is_locked ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </ShadcnButton>
                  </div>
                  <Tooltip id="view-tooltip" style={{ borderRadius: "12px" }} />
                  <Tooltip id="lock-tooltip" style={{ borderRadius: "12px" }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 mt-4">
        <DasrsPagination
          pageSize={pageSize}
          pageIndex={pageIndex}
          page={pageIndex}
          count={totalPages}
          handlePagination={handlePagination}
          handleChangePageSize={handleChangePageSize}
        />
      </div>

      {/* Add Organizer Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="sm"
      >
        <Modal.Header content="Add New Organizer" />
        <Modal.Body>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={newAccount.email}
                  onChange={(e) =>
                    setNewAccount((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <Input
                  type="text"
                  value={newAccount.first_name}
                  onChange={(e) =>
                    setNewAccount((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <Input
                  type="text"
                  value={newAccount.last_name}
                  onChange={(e) =>
                    setNewAccount((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <Input
                  type="tel"
                  value={newAccount.phone}
                  onChange={(e) =>
                    setNewAccount((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <Input
                  type="text"
                  value={newAccount.address}
                  onChange={(e) =>
                    setNewAccount((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <ShadcnButton
                type="button"
                variant="outline"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </ShadcnButton>
              <ShadcnButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Organizer"}
              </ShadcnButton>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* User Details Modal */}
      <Modal
        show={showUserDetailsModal}
        onHide={() => setShowUserDetailsModal(false)}
        size="md"
      >
        <Modal.Header content="User Details" />
        <Modal.Body>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500 shadow-lg mb-3">
                  <img
                    src={
                      selectedUser.avatar || "https://via.placeholder.com/150"
                    }
                    alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedUser.first_name} {selectedUser.last_name}
                </h3>
                <span
                  className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser.is_locked
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-green-100 text-green-800 border border-green-200"
                  }`}
                >
                  {selectedUser.is_locked ? "Account Locked" : "Account Active"}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="text-sm uppercase text-gray-500 font-semibold mb-4 border-b pb-2">
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">ID</p>
                    <p className="font-medium text-gray-800 break-all">
                      {selectedUser.account_id}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Role</p>
                    <p className="font-medium text-gray-800">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                        {selectedUser.role_name}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800 break-all">
                      <a
                        href={`mailto:${selectedUser.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedUser.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-800">{selectedUser.phone || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-800">{selectedUser.address || "N/A"}</p>
                  </div>
                </div>
              </div>
              
              {/* Team information section - only shown for players */}
              {selectedUser.role_name === "PLAYER" && (
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200">
                  <h4 className="text-sm uppercase text-blue-700 font-semibold mb-4 border-b border-blue-200 pb-2">
                    Team Information
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">Team</p>
                      <p className="font-medium text-gray-800">
                        {selectedUser.team_name ? (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm">
                            {selectedUser.team_name}
                          </span>
                        ) : (
                          <span className="text-gray-500 italic">Not in a team</span>
                        )}
                      </p>
                    </div>
                    
                    {selectedUser.team_name && (
                      <div>
                        <p className="text-sm text-blue-700 mb-1">Role</p>
                        <p className="font-medium text-gray-800">
                          {selectedUser.is_leader ? (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm flex items-center w-fit">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 1L9 9H2L7 14.5L5 22L12 17.5L19 22L17 14.5L22 9H15L12 1Z" />
                              </svg>
                              Team Leader
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                              Team Member
                            </span>
                          )}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-6 space-x-3">
                <ShadcnButton
                  variant={selectedUser.is_locked ? "outline" : "destructive"}
                  onClick={() => {
                    // Close the details modal before showing the confirmation dialog
                    setShowUserDetailsModal(false);
                    // Small delay to ensure modal is closed before dialog opens
                    setTimeout(() => {
                      handleToggleLockClick(
                        selectedUser.account_id,
                        selectedUser.is_locked
                      );
                    }, 100);
                  }}
                  disabled={isLockingUser}
                  className="flex items-center gap-2"
                >
                  {selectedUser.is_locked ? (
                    <>
                      <Unlock className="h-4 w-4" />
                      Unlock Account
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Lock Account
                    </>
                  )}
                </ShadcnButton>
                <ShadcnButton
                  variant="outline"
                  onClick={() => setShowUserDetailsModal(false)}
                >
                  Close
                </ShadcnButton>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      {/* Confirmation Dialog for Lock/Unlock */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="z-[1000]">
          <DialogHeader>
            <DialogTitle>Confirm Action</DialogTitle>
          </DialogHeader>
          <div className="!mt-5">
            {userToToggle && (
              <p>
                Are you sure you want to{" "}
                {userToToggle.currentLockStatus ? "unlock" : "lock"} this
                account?
              </p>
            )}
          </div>
          <DialogFooter>
            <ShadcnButton
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </ShadcnButton>
            <ShadcnButton
              onClick={toggleUserLockStatus}
              disabled={isLockingUser}
            >
              {isLockingUser ? "Processing..." : "Confirm"}
            </ShadcnButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
