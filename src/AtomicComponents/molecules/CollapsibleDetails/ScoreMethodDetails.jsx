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

export const ScoreMethodDetails = ({ scoredMethodId }) => {
  const [scoreMethod, setScoreMethod] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchScoreMethod = async () => {
    if (!isOpen || scoreMethod) return;

    setIsLoading(true);
    try {
      const response = await apiAuth.get(`scored-methods/${scoredMethodId}`);
      setScoreMethod(response.data.data);
    } catch (error) {
      console.error("Error fetching score method:", error);
      toast.error("Failed to load score method details");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !scoreMethod && scoredMethodId) {
      fetchScoreMethod();
    }
  }, [isOpen, scoredMethodId]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-sm text-gray-600 hover:text-gray-800">
        <span>Score Method Details</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-2">
        {isLoading ? (
          <div className="flex justify-center py-2">
            <LoadingIndicator size="small" />
          </div>
        ) : scoreMethod ? (
          <div className="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-md">
            <div className="text-gray-600">Lap Points:</div>
            <div className="text-right">{scoreMethod.lap}</div>
            <div className="text-gray-600">Assist Usage:</div>
            <div className="text-right">{scoreMethod.assistUsageCount}</div>
            <div className="text-gray-600">Collision:</div>
            <div className="text-right">{scoreMethod.collision}</div>
            <div className="text-gray-600">Race Time:</div>
            <div className="text-right">{scoreMethod.total_race_time}</div>
            <div className="text-gray-600">Off Track:</div>
            <div className="text-right">{scoreMethod.off_track}</div>
            <div className="text-gray-600">Average Speed:</div>
            <div className="text-right">{scoreMethod.average_speed}</div>
            <div className="text-gray-600">Distance:</div>
            <div className="text-right">{scoreMethod.total_distance}</div>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-2">
            No score method details available
          </p>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};