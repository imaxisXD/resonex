"use client";
import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  type Node,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id, Doc } from "@/convex/_generated/dataModel";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, FileText, Mail, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Handle, Position } from "@xyflow/react";

interface CampaignNodeData extends Record<string, unknown> {
  label: string;
  type: "campaign" | "content" | "schedule" | "analytics";
  data: Doc<"campaigns">;
  status?: "completed" | "pending" | "disabled";
}

const CampaignNode = ({ data }: { data: CampaignNodeData }) => {
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
        return "border-green-500 bg-green-50";
      case "pending":
        return "border-yellow-500 bg-yellow-50";
      case "disabled":
        return "border-gray-300 bg-gray-50";
      default:
        return "border-blue-500 bg-blue-50";
    }
  };

  return (
    <div
      className={`w-[280px] rounded-lg border-2 p-4 shadow-md ${getStatusColor()}`}
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
        {data.type === "campaign" && (
          <>
            <div>
              <span className="font-medium">Name:</span>{" "}
              {data.data.campaignName}
            </div>
            <div>
              <span className="font-medium">Category:</span>{" "}
              {data.data.category}
            </div>
            <div>
              <span className="font-medium">Prompt:</span>
              <p className="mt-1 line-clamp-3 text-gray-600">
                {data.data.prompt}
              </p>
            </div>
          </>
        )}

        {data.type === "content" && (
          <>
            {data.data.subjectLines ? (
              <div>
                <div className="mb-1 font-medium">Subject Lines:</div>
                <div className="space-y-1">
                  <div>A: {data.data.subjectLines.A}</div>
                  <div>B: {data.data.subjectLines.B}</div>
                </div>
              </div>
            ) : (
              <div className="text-gray-500">Content not generated yet</div>
            )}
            {data.data.body && (
              <div>
                <span className="font-medium">Body:</span>
                <p className="mt-1 line-clamp-4 text-gray-600">
                  {data.data.body}
                </p>
              </div>
            )}
          </>
        )}

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

      <Handle
        type="source"
        position={Position.Right}
        className="h-3 w-3 border-2 border-white bg-blue-500"
        style={{ right: -6 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="h-3 w-3 border-2 border-white bg-blue-500"
        style={{ left: -6 }}
      />
    </div>
  );
};

const nodeTypes = {
  campaignNode: CampaignNode,
};

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as Id<"campaigns">;

  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });

  const { nodes, edges } = useMemo(() => {
    if (!campaign) {
      return { nodes: [], edges: [] };
    }

    const campaignNodes: Node[] = [
      {
        id: "campaign",
        position: { x: 50, y: 50 },
        data: {
          label: "Campaign Details",
          type: "campaign",
          data: campaign,
          status: "completed",
        } as CampaignNodeData,
        type: "campaignNode",
      },
      {
        id: "content",
        position: { x: 400, y: 50 },
        data: {
          label: "Content Generation",
          type: "content",
          data: campaign,
          status:
            campaign.body || campaign.subjectLines ? "completed" : "pending",
        } as CampaignNodeData,
        type: "campaignNode",
      },
      {
        id: "schedule",
        position: { x: 750, y: 50 },
        data: {
          label: "Scheduling",
          type: "schedule",
          data: campaign,
          status:
            campaign.status === "scheduled" || campaign.status === "sent"
              ? "completed"
              : campaign.status === "draft"
                ? "pending"
                : "disabled",
        } as CampaignNodeData,
        type: "campaignNode",
      },
      {
        id: "analytics",
        position: { x: 1100, y: 50 },
        data: {
          label: "Analytics",
          type: "analytics",
          data: campaign,
          status: campaign.status === "sent" ? "completed" : "disabled",
        } as CampaignNodeData,
        type: "campaignNode",
      },
    ];

    const campaignEdges: Edge[] = [
      {
        id: "campaign-content",
        source: "campaign",
        target: "content",
        animated: true,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#3b82f6",
        },
      },
      {
        id: "content-schedule",
        source: "content",
        target: "schedule",
        animated: campaign.body || campaign.subjectLines ? true : false,
        style: {
          stroke:
            campaign.body || campaign.subjectLines ? "#3b82f6" : "#d1d5db",
          strokeWidth: 2,
          strokeDasharray: campaign.body || campaign.subjectLines ? "0" : "5,5",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: campaign.body || campaign.subjectLines ? "#3b82f6" : "#d1d5db",
        },
      },
      {
        id: "schedule-analytics",
        source: "schedule",
        target: "analytics",
        animated: campaign.status === "sent",
        style: {
          stroke: campaign.status === "sent" ? "#3b82f6" : "#d1d5db",
          strokeWidth: 2,
          strokeDasharray: campaign.status === "sent" ? "0" : "5,5",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: campaign.status === "sent" ? "#3b82f6" : "#d1d5db",
        },
      },
    ];

    return { nodes: campaignNodes, edges: campaignEdges };
  }, [campaign]);

  const onNodesChange: OnNodesChange = useCallback(() => {}, []);

  const onEdgesChange: OnEdgesChange = useCallback(() => {}, []);

  if (campaign === undefined) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4">Loading campaign...</div>
        </div>
      </div>
    );
  }

  if (campaign === null) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-lg font-semibold">Campaign not found</div>
          <p className="mb-4 text-gray-600">
            The campaign you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Button onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full">
      {/* Header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
            className="bg-white/80 backdrop-blur-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="rounded-lg bg-white/80 px-4 py-2 backdrop-blur-sm">
            <h1 className="font-semibold">{campaign.campaignName}</h1>
            <p className="text-sm text-gray-600 capitalize">
              {campaign.category} • {campaign.status}
            </p>
          </div>
        </div>
      </div>

      {/* React Flow */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        fitViewOptions={{ padding: 0.2, minZoom: 0.5, maxZoom: 1.2 }}
        minZoom={0.3}
        maxZoom={2}
      >
        <Controls position="top-right" />
        <MiniMap
          nodeStrokeWidth={3}
          position="bottom-right"
          className="bg-white/80 backdrop-blur-sm"
        />
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          color="#e2e8f0"
          style={{ opacity: 0.5 }}
        />
      </ReactFlow>
    </div>
  );
}
