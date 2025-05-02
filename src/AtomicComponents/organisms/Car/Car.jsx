import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus, Eye, Pencil } from "lucide-react";
import { useCarManagement } from "@/hooks/useCarManagement";
import { CarModal } from "@/AtomicComponents/molecules/CarModal/CarModal";
import { CarDetailsModal } from "@/AtomicComponents/molecules/CarDetailsModal/CarDetailsModal";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/AtomicComponents/atoms/shadcn/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/AtomicComponents/atoms/shadcn/table";
import { Switch } from "@/AtomicComponents/atoms/shadcn/switch";

export const Car = () => {
  const {
    tableData,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    formMode,
    setFormMode,
    formData,
    setFormData,
    handleFormSubmit,
    handleStatusToggle,
    handleEdit,
    handleDelete,
    isDetailsModalOpen,
    setIsDetailsModalOpen,
    selectedCar,
    handleViewDetails,
  } = useCarManagement();

  const handleCreate = () => {
    setFormMode("create");
    setFormData({
      car_name: "",
      maximum_torque: 4500,
      minimum_engine_rpm: 700,
      maximum_engine_rpm: 7000,
      shift_up_rpm: 5500,
      shift_down_rpm: 2750,
      final_drive_ratio: 1,
      anti_roll_force: 100,
      steering_helper_strength: 1,
      traction_helper_strength: 1,
      front_camper: -10,
      rear_camper: -10,
      front_ssr: 10000,
      rear_ssr: 10000,
      front_suspension: 0.1,
      rear_suspension: 0.1,
      front_ssd: 1000,
      rear_ssd: 1000,
      max_brake_torque: 2500,
      is_enabled: true,
    });
    setIsModalOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Cars Management</CardTitle>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Car
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Created Date</TableHead>
              <TableHead>Last Modified Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((car) => (
                <TableRow key={car.car_id}>
                  <TableCell>{car.car_name}</TableCell>
                  <TableCell>{car.created_date}</TableCell>
                  <TableCell>{car.last_modified_date}</TableCell>
                  <TableCell>
                    <Switch checked={car.is_enabled} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewDetails(car.car_id)}
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(car.car_id)}
                        className="h-8 w-8"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <CarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formMode={formMode}
          formData={formData}
          onSubmit={handleFormSubmit}
        />

        <CarDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          carData={selectedCar}
        />
      </CardContent>
    </Card>
  );
};
