import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/AtomicComponents/atoms/shadcn/collapsible";
import { LoadingIndicator } from "@/AtomicComponents/atoms/LoadingIndicator/LoadingIndicator";
import { apiAuth } from "@/config/axios/axios";
import { toast } from "sonner";

export const EnvironmentDetails = ({ environmentId }) => {
  const [environment, setEnvironment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchEnvironment = async () => {
    if (!isOpen || environment) return;

    setIsLoading(true);
    try {
      const response = await apiAuth.get(`environments/${environmentId}`);
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
  }, [isOpen, environmentId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800">
        <span>Environment Details</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingIndicator size="small" />
          </div>
        ) : environment ? (
          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-md">
            <div className="text-gray-600">Name:</div>
            <div className="text-right">{environment.environment_name}</div>
            <div className="text-gray-600">Description:</div>
            <div className="text-right">{environment.description || 'N/A'}</div>
            <div className="text-gray-600">Status:</div>
            <div className="text-right">{environment.status}</div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            No environment details available
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};