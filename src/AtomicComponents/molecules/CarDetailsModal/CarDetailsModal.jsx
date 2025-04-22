import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/AtomicComponents/atoms/shadcn/dialog";

export const CarDetailsModal = ({ isOpen, onClose, carData }) => {
  if (!carData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Car Details: {carData.car_name}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Engine Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                Engine
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Minimum Engine RPM:</span>
                  <span className="text-right">{carData.minimum_engine_rpm}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Maximum Engine RPM:</span>
                  <span className="text-right">{carData.maximum_engine_rpm}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Maximum Torque:</span>
                  <span className="text-right">{carData.maximum_torque}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Shift Up RPM:</span>
                  <span className="text-right">{carData.shift_up_rpm}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Shift Down RPM:</span>
                  <span className="text-right">{carData.shift_down_rpm}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Final Drive Ratio:</span>
                  <span className="text-right">{carData.final_drive_ratio}</span>
                </div>
              </div>
            </div>

            {/* Handling Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                Handling
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Steering Helper Strength:</span>
                  <span className="text-right">{carData.steering_helper_strength}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Traction Helper Strength:</span>
                  <span className="text-right">{carData.traction_helper_strength}</span>
                </div>
              </div>
            </div>

            {/* Brake Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                Brake
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Max Brake Torque:</span>
                  <span className="text-right">{carData.max_brake_torque}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Anti Roll Force:</span>
                  <span className="text-right">{carData.anti_roll_force}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customize Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold bg-gray-nav text-white px-4 py-2 rounded-lg mb-4 shadow-sm">
                Customize
              </h3>
              <div className="space-y-2">
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Front Camper:</span>
                  <span className="text-right">{carData.front_camper}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Rear Camper:</span>
                  <span className="text-right">{carData.rear_camper}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Front SSR:</span>
                  <span className="text-right">{carData.front_ssr}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Rear SSR:</span>
                  <span className="text-right">{carData.rear_ssr}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Front Suspension:</span>
                  <span className="text-right">{carData.front_suspension}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Rear Suspension:</span>
                  <span className="text-right">{carData.rear_suspension}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Front SSD:</span>
                  <span className="text-right">{carData.front_ssd}</span>
                </div>
                <div className="grid grid-cols-2 py-2">
                  <span className="text-gray-600">Rear SSD:</span>
                  <span className="text-right">{carData.rear_ssd}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

