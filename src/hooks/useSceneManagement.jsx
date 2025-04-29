import apiClient from "@/config/axios/axios";
import { useState, useEffect } from "react";

export const useSceneManagement = () => {
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
    totalPages: 0,
    totalElements: 0,
  });

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); // 'create' or 'edit'
  const [formData, setFormData] = useState({
    resource_id: null,
    resource_name: "",
    resource_image: "",
    resource_type: "UI",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch data from API
  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await apiClient.get(
        `resources/admin?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      // Correct path to content array
      const contentData = response.data.data.content;

      // Update table data with correct path
      setTableData(contentData || []);

      // Update pagination with correct paths
      setPagination((prev) => ({
        ...prev,
        totalPages: response.data.data.total_pages || 0,
        totalElements: response.data.data.total_elements || 0,
      }));
    } catch (err) {
      console.error("Error fetching resources:", err);
      setError("Failed to load resources. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data when component mounts or when sort/filter changes
  useEffect(() => {
    fetchData();
  }, [pagination.pageNo, pagination.pageSize, sortColumn, sortOrder]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle type change from select
  const handleTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, resource_type: value }));
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (formMode === "create") {
        // Create new scene
        const payload = {
          resource_name: formData.resource_name,
          resource_image: formData.resource_image || null,
          resource_type: formData.resource_type,
          description: formData.description,
        };

        await apiClient.post("resources", payload);
      } else {
        // Edit existing scene
        const payload = {
          resource_name: formData.resource_name,
          resource_image: formData.resource_image || null,
          resource_type: formData.resource_type,
          description: formData.description,
        };

        await apiClient.put(`resources/${formData.resource_id}`, payload);
      }

      // Refresh data after successful operation
      await fetchData();

      // Close modal and reset form
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving scene:", err);
      setError(
        `Failed to ${
          formMode === "create" ? "create" : "update"
        } scene. Please try again.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      resource_id: null,
      resource_name: "",
      resource_image: "",
      resource_type: "UI",
      description: "",
    });
  };

  // Handle new scene button click
  const handleNewScene = () => {
    setFormMode("create");
    resetForm();
    setIsModalOpen(true);
  };

  // Handle edit button click
  const handleEdit = (id) => {
    const sceneToEdit = tableData.find((item) => item.resource_id === id);
    if (sceneToEdit) {
      setFormMode("edit");
      setFormData({
        resource_id: sceneToEdit.resource_id,
        resource_name: sceneToEdit.resource_name || "",
        resource_image: sceneToEdit.resource_image || "",
        resource_type: sceneToEdit.resource_type || "UI",
        description: sceneToEdit.description || "",
      });
      setIsModalOpen(true);
    }
  };

  // Handle delete action
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this scene?")) {
      try {
        await apiClient.delete(`resources/${id}`);
        await fetchData();
      } catch (err) {
        console.error("Error deleting scene:", err);
        setError("Failed to delete scene. Please try again.");
      }
    }
  };

  // Handle column sorting
  const handleSort = (column) => {
    if (sortColumn === column) {
      // Toggle sort order if same column is clicked
      const newOrder = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(newOrder);
    } else {
      // Set new column and default to ascending order
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id, currentStatus) => {
    try {
      // Optimistic update
      setTableData((prevData) =>
        prevData.map((item) =>
          item.resource_id === id
            ? { ...item, is_enable: !item.is_enable }
            : item
        )
      );

      // API call to update status
      await apiClient.put(
        `resources/change-status/${id}?enable=${!currentStatus}`
      );

      // If API call fails, the catch block will revert the change
    } catch (err) {
      console.error("Error updating status:", err);

      // Revert the optimistic update
      setTableData((prevData) =>
        prevData.map((item) =>
          item.resource_id === id ? { ...item, is_enable: currentStatus } : item
        )
      );

      // Show error message
      setError("Failed to update status. Please try again.");
    }
  };

  // Handle pagination - updated to match your existing Pagination component
  const handlePageChange = (newPage) => {
    // Make sure newPage is within bounds
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        pageNo: newPage,
      }));
    }
  };

  // Filter the contents based on type
  const filteredContents = tableData.filter((item) =>
    typeFilter === "ALL" ? true : item.resource_type === typeFilter
  );

  return {
    tableData: filteredContents,
    isLoading,
    error,
    typeFilter,
    setTypeFilter,
    sortColumn,
    sortOrder,
    pagination,
    isModalOpen,
    setIsModalOpen,
    formMode,
    formData,
    isSubmitting,
    handleInputChange,
    handleTypeChange,
    handleFormSubmit,
    handleNewScene,
    handleEdit,
    handleDelete,
    handleSort,
    handleStatusToggle,
    handlePageChange, // Return the updated pagination handler
  };
};
