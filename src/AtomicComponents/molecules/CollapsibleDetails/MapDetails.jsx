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

export const MapDetails = ({ resourceId }) => {
  const [mapResource, setMapResource] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMapResource = async () => {
    if (!isOpen || mapResource) return;

    setIsLoading(true);
    try {
      const response = await apiClient.get(`resources/${resourceId}`);
      setMapResource(response.data.data);
    } catch (error) {
      console.error("Error fetching map resource:", error);
      toast.error("Failed to load map details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !mapResource && resourceId) {
      fetchMapResource();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, resourceId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex justify-between items-center w-full text-gray-600 hover:text-gray-800 text-sm">
        <span>Map Details</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingIndicator size="small" />
          </div>
        ) : mapResource ? (
          <div className="gap-2 grid grid-cols-2 bg-gray-50 p-3 rounded-md text-sm">
            <div className="text-gray-600">Name:</div>
            <div className="text-right">{mapResource.resource_name}</div>
            <div className="text-gray-600">Type:</div>
            <div className="text-right">{mapResource.resource_type}</div>
            <div className="text-gray-600">Description:</div>
            <div className="text-right">{mapResource.description || "N/A"}</div>
          </div>
        ) : (
          <p className="py-2 text-gray-500 text-sm text-center">
            No map details available
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

MapDetails.propTypes = {
  resourceId: PropTypes.string.isRequired,
};
