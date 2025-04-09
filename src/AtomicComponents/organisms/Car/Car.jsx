import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus } from "lucide-react";
import { useCarManagement } from "@/hooks/useCarManagement";
import { CarModal } from "@/AtomicComponents/molecules/CarModal/CarModal";
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
    error,
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
  } = useCarManagement();

  const handleCreate = () => {
    setFormMode("create");
    setFormData({
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
    setIsModalOpen(true);
  };

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" /> Add Car
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Max Torque</TableHead>
              <TableHead>Min Engine RPM</TableHead>
              <TableHead>Max Engine RPM</TableHead>
              <TableHead>Shift Up RPM</TableHead>
              <TableHead>Shift Down RPM</TableHead>
              <TableHead>Final Drive Ratio</TableHead>
              <TableHead>Anti Roll Force</TableHead>
              <TableHead>Steering Helper</TableHead>
              <TableHead>Traction Helper</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={12} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : (
              tableData.map((car) => (
                <TableRow key={car.car_id}>
                  <TableCell>{car.car_name}</TableCell>
                  <TableCell>{car.maximum_torque}</TableCell>
                  <TableCell>{car.minimum_engine_rpm}</TableCell>
                  <TableCell>{car.maximum_engine_rpm}</TableCell>
                  <TableCell>{car.shift_up_rpm}</TableCell>
                  <TableCell>{car.shift_down_rpm}</TableCell>
                  <TableCell>{car.final_drive_ratio}</TableCell>
                  <TableCell>{car.anti_roll_force}</TableCell>
                  <TableCell>{car.steering_helper_strength}</TableCell>
                  <TableCell>{car.traction_helper_strength}</TableCell>
                  <TableCell>
                    <Switch
                      checked={car.is_enabled}
                      onCheckedChange={() =>
                        handleStatusToggle(car.car_id, car.is_enabled)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(car.car_id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(car.car_id)}
                      >
                        Delete
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
      </CardContent>
    </Card>
  );
};
