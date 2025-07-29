import { Handle, Position } from "@xyflow/react";
import { Calendar, FileText, Mail, BarChart3 } from "lucide-react";
import { CampaignNodeData } from "@/lib/connection-rules";

interface CampaignNodeProps {
  data: CampaignNodeData;
}

export const CampaignNode = ({ data }: CampaignNodeProps) => {
  const getIcon = () => {
    switch (data.type) {
      case "campaign":
        return <Mail className="size-5" />;
      case "content":
        return <FileText className="size-5" />;
      case "schedule":
        return <Calendar className="size-5" />;
      case "analytics":
        return <BarChart3 className="size-5" />;
      default:
        return <Mail className="size-5" />;
    }
  };

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

  if (data.type === "campaign") {
    return (
      <div className="w-[280px] rounded-lg border bg-white/90 shadow-md backdrop-blur-sm transition-all duration-200 ease-in-out">
        <div className="rounded-t-lg p-4">
          <div className="flex items-center gap-2 space-x-2">
            <div className="bg-highlight border-highlight-txt flex size-10 items-center justify-center rounded-md border">
              <Mail className="text-highlight-txt size-5" />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <h3 className="truncate text-sm font-medium">{data.label}</h3>
              <span className="text-muted-foreground flex items-center text-xs capitalize">
                <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full border border-green-600 bg-green-500 align-middle"></span>
                {data.status || "ready"}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-3">
          <div>
            <span className="mb-1.5 block text-xs font-medium text-gray-800">
              Campaign Name:
            </span>
            <div className="w-full rounded-sm bg-gray-50 px-2 py-1.5 text-xs text-gray-600">
              {data.data.campaignName}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-gray-800">
              Category:
            </span>
            <div className="w-full rounded-sm bg-gray-50 px-2 py-1.5 text-xs text-gray-600 capitalize">
              {data.data.category}
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-gray-800">
              Topic:
            </span>
            <div className="w-full rounded-sm bg-gray-50 px-2 py-1.5 text-xs text-gray-600">
              {data.data.prompt}
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3 w-3 border-2 border-white bg-blue-500"
          style={{ bottom: -6 }}
        />
      </div>
    );
  }

  return (
    <div
      className={`w-[280px] rounded-lg border p-4 shadow-md ${getStatusColor()} backdrop-blur-sm`}
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-sm font-semibold">{data.label}</h3>
          <p className="text-xs text-gray-600 capitalize">
            {data.status || "ready"}
          </p>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {data.type === "schedule" && (
          <>
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
          </>
        )}

        {data.type === "analytics" && (
          <>
            {data.data.status === "sent" ? (
              <div>
                <div className="font-medium">Campaign sent!</div>
                <div className="text-gray-600">Analytics will appear here</div>
              </div>
            ) : (
              <div className="text-gray-500">No analytics available yet</div>
            )}
          </>
        )}
      </div>

      {data.type === "schedule" && (
        <>
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
        </>
      )}

      {data.type === "analytics" && (
        <>
          <Handle
            type="target"
            position={Position.Left}
            className="h-3 w-3 border-2 border-white bg-blue-500"
            style={{ left: -6, top: "30%" }}
          />
          <Handle
            type="target"
            position={Position.Right}
            className="h-3 w-3 border-2 border-white bg-blue-500"
            style={{ right: -6, top: "30%" }}
          />
        </>
      )}
    </div>
  );
};
