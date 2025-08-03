import { Handle, Position } from "@xyflow/react";
import { Mail } from "lucide-react";
import { CampaignNodeData } from "@/lib/connection-rules";

interface CampaignNodeProps {
  data: CampaignNodeData;
}

export const CampaignNode = ({ data }: CampaignNodeProps) => {
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
        style={{
          background: "var(--color-highlight-txt)",
          height: "10px",
          width: "10px",
          border: "1px solid var(--color-black)",
        }}
      />
    </div>
  );
};
