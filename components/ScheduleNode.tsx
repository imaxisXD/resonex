import { Handle, Position } from "@xyflow/react";
import { Calendar } from "lucide-react";
import { CampaignNodeData } from "@/lib/connection-rules";

interface ScheduleNodeProps {
  data: CampaignNodeData;
}

export const ScheduleNode = ({ data }: ScheduleNodeProps) => {
  const getStatusColor = () => {
    switch (data.status) {
      case "completed":
        return "border-green-500 bg-green-50/80";
      case "scheduled":
        return "border-blue-500 bg-blue-50/80";
      case "running":
        return "border-yellow-500 bg-yellow-50/80";
      case "created":
        return "border-green-500 bg-green-50/80";
      case "pending":
        return "border-yellow-500 bg-yellow-50/80";
      case "disabled":
        return "border-gray-300 bg-gray-50/80";
      default:
        return "border-blue-500 bg-blue-50/80";
    }
  };

  return (
    <div
      className={`w-[280px] rounded-lg border p-4 shadow-md ${getStatusColor()} backdrop-blur-sm`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          <Calendar className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-semibold">{data.label}</h3>
          <p className="text-xs text-gray-600 capitalize">
            {data.status || "ready"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {data.data.sendTimeA || data.data.sendTimeB ? (
          <div className="space-y-1">
            {data.data.sendTimeA && (
              <div>
                <span className="font-medium">Send Time A:</span>{" "}
                {new Date(data.data.sendTimeA).toLocaleString()}
              </div>
            )}
            {data.data.sendTimeB && (
              <div>
                <span className="font-medium">Send Time B:</span>{" "}
                {new Date(data.data.sendTimeB).toLocaleString()}
              </div>
            )}
          </div>
        ) : (
          <div className="text-gray-500">Not scheduled yet</div>
        )}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="h-3 w-3 border-2 border-white bg-blue-500"
        style={{ top: -6 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-3 w-3 border-2 border-white bg-blue-500"
        style={{ bottom: -6 }}
      />
    </div>
  );
};
