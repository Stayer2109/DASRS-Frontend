import apiClient from "@/config/axios/axios";
import { useState, useEffect } from "react";

export const useMatchTypeManagement = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formData, setFormData] = useState(null);
  const [sortColumn, setSortColumn] = useState("id"); // Changed from match_type_id to id
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(
        `match-types?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      setTableData(response.data.data.content || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.total_pages || 0,
        totalElements: response.data.data.total_elements || 0,
      }));
    } catch (err) {
      console.error("Error fetching match types:", err);
      setError("Failed to load match types. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.pageNo, pagination.pageSize, sortColumn, sortOrder]);

  const handleFormSubmit = async (formData) => {
    try {
      if (formMode === "create") {
        await apiClient.post("match-types", formData);
      } else {
        await apiClient.put(`match-types/${formData.match_type_id}`, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving match type:", err);
      setError("Failed to save match type. Please try again.");
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus ? "INACTIVE" : "ACTIVE";
      
      await apiClient.put(`match-types/change-status/${id}?enable=${!currentStatus}`);
      
      setTableData((prevData) =>
        prevData.map((item) =>
          item.match_type_id === id
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

  return {
    tableData,
    isLoading,
    error,
    isModalOpen,
    setIsModalOpen,
    formMode,
    setFormMode,
    formData,
    setFormData,
    handleFormSubmit,
    handleStatusToggle,
    handleSort,
    sortColumn,
    sortOrder,
    pagination,
    setPagination,
  };
};
