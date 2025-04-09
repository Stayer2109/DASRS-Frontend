import { useState, useEffect } from "react";
import { apiAuth } from "@/config/axios/axios";

export const useCarManagement = () => {
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
    car_id: null,
    car_name: "",
    maximum_torque: 0,
    minimum_engine_rpm: 0,
    maximum_engine_rpm: 0,
    shift_up_rpm: 0,
    shift_down_rpm: 0,
    final_drive_ratio: 0,
    anti_roll_force: 0,
    steering_helper_strength: 0,
    traction_helper_strength: 0,
    is_enabled: true
  });

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiAuth.get(
        `cars?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      setTableData(response.data.data.content || []);
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.total_pages || 0,
        totalElements: response.data.data.total_elements || 0,
      }));
    } catch (err) {
      console.error("Error fetching cars:", err);
      setError("Failed to load cars. Please try again later.");
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
        await apiAuth.post("cars", formData);
      } else {
        await apiAuth.put(`cars/${formData.car_id}`, formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error("Error saving car:", err);
      setError("Failed to save car. Please try again.");
    }
  };

  const handleEdit = (id) => {
    const carToEdit = tableData.find((item) => item.car_id === id);
    if (carToEdit) {
      setFormMode("edit");
      setFormData({
        ...carToEdit
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await apiAuth.delete(`cars/${id}`);
        await fetchData();
      } catch (err) {
        console.error("Error deleting car:", err);
        setError("Failed to delete car. Please try again.");
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await apiAuth.put(`cars/change-status/${id}?enable=${!currentStatus}`);
      
      setTableData((prevData) =>
        prevData.map((item) =>
          item.car_id === id
            ? { ...item, is_enabled: !currentStatus }
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
    sortColumn,
    sortOrder,
    pagination,
    setPagination,
    isModalOpen,
    setIsModalOpen,
    formMode,
    setFormMode,
    formData,
    setFormData,
    handleFormSubmit,
    handleEdit,
    handleDelete,
    handleStatusToggle,
    handleSort,
  };
};