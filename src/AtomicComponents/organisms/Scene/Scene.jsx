import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/AtomicComponents/atoms/shadcn/select";
import { Card, CardContent } from "@/AtomicComponents/atoms/shadcn/card";
import { Badge } from "@/AtomicComponents/atoms/shadcn/badge";
import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";
import { Input } from "@/AtomicComponents/atoms/shadcn/input";
import { Textarea } from "@/AtomicComponents/atoms/shadcn/textarea";
import { Label } from "@/AtomicComponents/atoms/shadcn/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/AtomicComponents/atoms/shadcn/dialog";
import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Check,
  X,
  Pencil,
  Trash2,
  Plus,
  Loader2,
} from "lucide-react";
import { apiAuth } from "@/config/axios/axios";

export default function Scene() {
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

      const response = await apiAuth.get(
        `resources/admin?pageNo=${pagination.pageNo}&pageSize=${pagination.pageSize}&sortBy=${sortColumn}&sortDirection=${sortOrder}`
      );

      console.log("Full API response:", response.data);

      // Correct path to content array
      const contentData = response.data.data.content;
      console.log("Fetched resources:", contentData);

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

        await apiAuth.post("resources", payload);
      } else {
        // Edit existing scene
        const payload = {
          resource_name: formData.resource_name,
          resource_image: formData.resource_image || null,
          resource_type: formData.resource_type,
          description: formData.description,
        };

        await apiAuth.put(`resources/${formData.resource_id}`, payload);
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
        await apiAuth.delete(`resources/${id}`);
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

  // Get sort icon based on current state
  const getSortIcon = (column) => {
    if (sortColumn !== column) {
      return <ChevronsUpDown size={16} />;
    }
    return sortOrder === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
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
      await apiAuth.put(
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

  // Filter the contents based on type
  const filteredContents = tableData.filter((item) =>
    typeFilter === "ALL" ? true : item.resource_type === typeFilter
  );

  return (
    <>
      <Card className="w-full">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <Button onClick={handleNewScene} size="sm" className="gap-2">
                <Plus size={16} /> New Scene
              </Button>
              {error && <p className="text-destructive">{error}</p>}
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Resource Types</SelectLabel>
                  <SelectItem value="ALL">All Types</SelectItem>
                  <SelectItem value="MAP">MAP</SelectItem>
                  <SelectItem value="UI">UI</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="w-[80px] cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("id")}
                  >
                    <div className="flex items-center justify-between">
                      ID
                      {getSortIcon("id")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="w-52 cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("resourceName")}
                  >
                    <div className="flex items-center justify-between">
                      Scene Name
                      {getSortIcon("resourceName")}
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("resourceType")}
                  >
                    <div className="flex items-center justify-between">
                      Type
                      {getSortIcon("resourceType")}
                    </div>
                  </TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort("isEnable")}
                  >
                    <div className="flex items-center justify-between">
                      Status
                      {getSortIcon("isEnable")}
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No resources found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredContents.map((item) => (
                    <TableRow key={item.resource_id}>
                      <TableCell className="font-medium">
                        {item.resource_id}
                      </TableCell>
                      <TableCell>{item.resource_name}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.resource_type === "MAP"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {item.resource_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <img
                          className="w-full h-40 object-cover rounded-md shadow-sm"
                          src={
                            item.resource_image ||
                            "https://haieng.com/wp-content/uploads/2017/10/test-image-500x500.jpg"
                          }
                          alt="scene"
                        />
                        <div className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={item.is_enable}
                            onCheckedChange={() =>
                              handleStatusToggle(
                                item.resource_id,
                                item.is_enable
                              )
                            }
                          />
                          <Badge
                            variant={item.is_enable ? "success" : "destructive"}
                          >
                            {item.is_enable ? (
                              <Check className="mr-1 h-4 w-4" />
                            ) : (
                              <X className="mr-1 h-4 w-4" />
                            )}
                            {item.is_enable ? "Enabled" : "Disabled"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item.resource_id)}
                        >
                          <Pencil size={16} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageNo: Math.max(0, prev.pageNo - 1),
            }))
          }
          disabled={pagination.pageNo === 0}
        >
          Previous
        </Button>
        <div className="text-sm">
          Page {pagination.pageNo + 1} of {Math.max(1, pagination.totalPages)}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              pageNo: Math.min(prev.totalPages - 1, prev.pageNo + 1),
            }))
          }
          disabled={pagination.pageNo >= pagination.totalPages - 1}
        >
          Next
        </Button>
      </div>

      {/* Create/Edit Scene Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {formMode === "create" ? "Create New Scene" : "Edit Scene"}
            </DialogTitle>
            <DialogDescription>
              {formMode === "create"
                ? "Add a new scene to your collection."
                : "Update the details of the selected scene."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-4">
            <div className="grid w-full gap-2">
              <Label htmlFor="resource_name">Scene Name</Label>
              <Input
                id="resource_name"
                name="resource_name"
                value={formData.resource_name}
                onChange={handleInputChange}
                required
                placeholder="Enter scene name"
              />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="resource_type">Resource Type</Label>
              <Select
                name="resource_type"
                value={formData.resource_type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, resource_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MAP">MAP</SelectItem>
                  <SelectItem value="UI">UI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="resource_image">Image URL</Label>
              <Input
                id="resource_image"
                name="resource_image"
                value={formData.resource_image || ""}
                onChange={handleInputChange}
                placeholder="Enter image URL"
              />
            </div>

            <div className="grid w-full gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                placeholder="Enter scene description"
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {formMode === "create" ? "Creating..." : "Saving..."}
                  </>
                ) : formMode === "create" ? (
                  "Create Scene"
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
