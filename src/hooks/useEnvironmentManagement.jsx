import { useState, useEffect } from "react";
import { apiClient } from "@/config/axios/axios";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";

export const useEnvironmentManagement = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState({
    environment_id: "",
    environment_name: "",
    status: "ACTIVE", // Add status field with default value
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);

      const response = await apiClient.get(
        `environments?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      setTableData(response.data.data.content || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.total_pages || 0,
        totalElements: response.data.data.total_elements || 0,
      }));
    } catch (err) {
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
      console.error("Error fetching environments:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageNo, pagination.pageSize, sortColumn, sortOrder]);

  const handleFormSubmit = async (formValues) => {
    try {
      if (formMode === "create") {
        await apiClient.post("environments", {
          environment_name: formValues.environment_name,
        });
      } else {
        await apiClient.put(`environments/${formValues.environment_id}`, {
          environment_name: formValues.environment_name,
          status: formValues.status, // Include status in the update payload
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving environment:", err);
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    }
  };

  const handleEdit = (id) => {
    const environmentToEdit = tableData.find(
      (item) => item.environment_id === id
    );
    if (environmentToEdit) {
      setFormMode("edit");
      setFormData({
        environment_id: environmentToEdit.environment_id,
        environment_name: environmentToEdit.environment_name,
        status: environmentToEdit.status || "ACTIVE", // Include status in form data
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this environment?")) {
      try {
        await apiClient.delete(`environments/${id}`);
        await fetchData();
      } catch (err) {
        console.error("Error deleting environment:", err);
        Toast({
          title: "Error",
          type: "error",
          message: err.response?.data?.message || "Error processing request.",
        });
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      // Convert boolean to expected status string
      const newStatus = currentStatus ? "INACTIVE" : "ACTIVE";

      await apiClient.put(
        `environments/change-status/${id}?enable=${!currentStatus}`
      );

      // Update local state
      setTableData((prevData) =>
        prevData.map((item) =>
          item.environment_id === id ? { ...item, status: newStatus } : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      Toast({
        title: "Error",
        type: "error",
        message: err.response?.data?.message || "Error processing request.",
      });
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, pageNo: newPage }));
  };

  return {
    tableData,
    isLoading,
    sortColumn,
    sortOrder,
    pagination,
    isModalOpen,
    setIsModalOpen,
    formMode,
    formData,
    handleFormSubmit,
    handleEdit,
    handleDelete,
    handleSort,
    handleStatusToggle,
    handlePageChange,
  };
};
