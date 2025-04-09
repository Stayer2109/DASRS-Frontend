import { Button } from "@/AtomicComponents/atoms/shadcn/button";
import { Plus } from "lucide-react";

export const EnvironmentHeader = ({ onNewEnvironment, error }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Button onClick={onNewEnvironment} size="sm" className="gap-2">
          <Plus size={16} /> New Environment
        </Button>
        {error && <p className="text-destructive">{error}</p>}
      </div>
    </div>
  );
};