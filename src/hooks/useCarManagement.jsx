import { useState, useEffect } from "react";
import apiClient from "@/config/axios/axios";
import Toast from "@/AtomicComponents/molecules/Toaster/Toaster";

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
    is_enabled: true,
  });
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageNo, pagination.pageSize, sortColumn, sortOrder]);

  const handleFormSubmit = async (e, submittedFormData) => {
    e.preventDefault();
    try {
      const payload = {
        car_name: submittedFormData.car_name,
        maximum_torque: submittedFormData.maximum_torque,
        minimum_engine_rpm: submittedFormData.minimum_engine_rpm,
        maximum_engine_rpm: submittedFormData.maximum_engine_rpm,
        shift_up_rpm: submittedFormData.shift_up_rpm,
        shift_down_rpm: submittedFormData.shift_down_rpm,
        final_drive_ratio: submittedFormData.final_drive_ratio,
        anti_roll_force: submittedFormData.anti_roll_force,
        steering_helper_strength: submittedFormData.steering_helper_strength,
        traction_helper_strength: submittedFormData.traction_helper_strength,
        front_camper: submittedFormData.front_camper,
        rear_camper: submittedFormData.rear_camper,
        front_ssr: submittedFormData.front_ssr,
        rear_ssr: submittedFormData.rear_ssr,
        front_suspension: submittedFormData.front_suspension,
        rear_suspension: submittedFormData.rear_suspension,
        front_ssd: submittedFormData.front_ssd,
        rear_ssd: submittedFormData.rear_ssd,
        max_brake_torque: submittedFormData.max_brake_torque,
        is_enabled: submittedFormData.is_enabled, // Include is_enabled in the payload
      };

      if (formMode === "create") {
        await apiClient.post("cars", payload);
      } else {
        await apiClient.put(`cars/${submittedFormData.car_id}`, payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      Toast({
        title: "Error",
        message: err.response?.data?.message || "Error processing request.",
        type: "error",
      });
    }
  };

  const handleEdit = (id) => {
    const carToEdit = tableData.find((item) => item.car_id === id);
    if (carToEdit) {
      setFormMode("edit");
      setFormData({
        ...carToEdit,
        is_enabled: carToEdit.is_enabled, // Ensure is_enabled is included
      });
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car?")) {
      try {
        await apiClient.delete(`cars/${id}`);
        await fetchData();
      } catch (err) {
        console.error("Error deleting car:", err);
        setError("Failed to delete car. Please try again.");
      }
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

  const handleViewDetails = (id) => {
    const carDetails = tableData.find((item) => item.car_id === id);
    if (carDetails) {
      setSelectedCar(carDetails);
      setIsDetailsModalOpen(true);
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
    handleSort,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedCar,
    handleViewDetails,
  };
};
