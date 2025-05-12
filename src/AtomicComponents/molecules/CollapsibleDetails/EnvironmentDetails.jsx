import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import apiClient from "@/config/axios/axios";
import { toast } from "sonner";
import PropTypes from "prop-types";

export const EnvironmentDetails = ({ environmentId }) => {
  const [environment, setEnvironment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchEnvironment = async () => {
    if (!isOpen || environment) return;

    setIsLoading(true);
    try {
      const response = await apiClient.get(`environments/${environmentId}`);
      setEnvironment(response.data.data);
    } catch (error) {
      console.error("Error fetching environment:", error);
      toast.error("Failed to load environment details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !environment && environmentId) {
      fetchEnvironment();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, environmentId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm">
        <span>Environment Details</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingIndicator size="small" />
          </div>
        ) : environment &&
          environment.status.toString().toLowerCase() !== "inactive" ? (
          <div className="gap-2 grid grid-cols-2 bg-gray-50 p-3 rounded-md text-sm">
            <div className="text-gray-600">Name:</div>
            <div className="text-right">{environment.environment_name}</div>
            <div className="text-gray-600">Description:</div>
            <div className="text-right">{environment.description || "N/A"}</div>
            <div className="text-gray-600">Status:</div>
            <div className="text-right">{environment.status}</div>
          </div>
        ) : (
          <p className="py-2 text-gray-500 text-sm text-center">
            No environment details available
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

EnvironmentDetails.propTypes = {
  environmentId: PropTypes.string.isRequired,
};
