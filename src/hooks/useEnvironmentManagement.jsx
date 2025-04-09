import { useState, useEffect } from "react";
import { apiAuth } from "@/config/axios/axios";

export const useEnvironmentManagement = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
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
    description: "",
    is_enable: true
  });

  // Fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiAuth.get(
        `environments?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      setTableData(response.data.data.content || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.total_pages || 0,
        totalElements: response.data.data.total_elements || 0,
      }));
    } catch (err) {
      console.error("Error fetching environments:", err);
      setError("Failed to load environments. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageNo, pagination.pageSize, sortColumn, sortOrder]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formMode === "create") {
        await apiAuth.post("environments", {
          environment_name: formData.environment_name,
          description: formData.description,
        });
      } else {
        await apiAuth.put(`environments/${formData.environment_id}`, {
          environment_name: formData.environment_name,
          description: formData.description,
        });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving environment:", err);
      setError("Failed to save environment. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const environmentToEdit = tableData.find((item) => item.environment_id === id);
    if (environmentToEdit) {
      setFormMode("edit");
      setFormData({
        environment_id: environmentToEdit.environment_id,
        environment_name: environmentToEdit.environment_name,
        description: environmentToEdit.description,
        is_enable: environmentToEdit.is_enable,
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this environment?")) {
      try {
        await apiAuth.delete(`environments/${id}`);
        await fetchData();
      } catch (err) {
        console.error("Error deleting environment:", err);
        setError("Failed to delete environment. Please try again.");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      // Convert boolean to expected status string
      const newStatus = currentStatus ? "INACTIVE" : "ACTIVE";
      
      await apiAuth.put(`environments/change-status/${id}?enable=${!currentStatus}`);
      
      // Update local state
      setTableData((prevData) =>
        prevData.map((item) =>
          item.environment_id === id
            ? { ...item, status: newStatus }
            : item
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status. Please try again.");
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
    error,
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
