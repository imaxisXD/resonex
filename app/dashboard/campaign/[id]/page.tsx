"use client";
import { useMemo, useEffect, useCallback, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  Position,
  Handle,
  addEdge,
  Connection,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Calendar, FileText, Mail, BarChart3 } from "lucide-react";
import ABTestNode from "@/components/ABTestNode";
import ContentGenerationNode from "@/components/ContentGenerationNode";
import { NodesCMDK } from "@/components/NodesCMDK";

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
              <span className="font-medium">Campaign Name:</span>{" "}
              {data.data.campaignName}
            </div>
            <div>
              <span className="font-medium">Category:</span>{" "}
              {data.data.category}
            </div>
            <div>
              <span className="font-medium">Topic:</span> {data.data.prompt}
            </div>
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

      {/* Simple handles based on node type */}
      {data.type === "campaign" && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="h-3 w-3 border-2 border-white bg-blue-500"
          style={{ bottom: -6 }}
        />
      )}

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

// Interface for LabeledNode data
interface LabeledNodeData {
  title: string;
  target: string;
  maxConnections?: number;
}

export default function CampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });

  // Store max connections for each labeled node
  const [nodeMaxConnections, setNodeMaxConnections] = useState<
    Record<string, number>
  >({});

  // Create wrapper inside component to access state
  const ABTestNodeWrapper = useCallback(
    ({ data, id }: { data: LabeledNodeData; id: string }) => {
      const handleOutputEdgesChange = (count: number) => {
        setNodeMaxConnections((prev) => ({
          ...prev,
          [id]: count,
        }));
      };

      return (
        <ABTestNode
          title={data.title}
          target={data.target}
          onOutputEdgesChange={handleOutputEdgesChange}
        />
      );
    },
    [setNodeMaxConnections],
  );

  const nodeTypes = useMemo(
    () => ({
      campaignNode: CampaignNode,
      abTestNode: ABTestNodeWrapper,
      contentGenerationNode: ContentGenerationNode,
    }),
    [ABTestNodeWrapper],
  );

  const initialNodes = useMemo(() => {
    if (!campaign) return [];

    return [
      {
        id: "campaign",
        position: { x: 200, y: -500 },
        data: {
          label: "Campaign Details",
          type: "campaign",
          data: campaign,
          status: "completed",
        } as CampaignNodeData,
        type: "campaignNode",
      },
      {
        id: "abTestNode",
        position: { x: 150, y: -250 },
        data: {
          title: "A/B Test",
          target: "target",
        },
        type: "abTestNode",
      },
      {
        id: "content",
        position: { x: 0, y: -50 },
        data: {
          label: "Content Generation",
          data: campaign,
          status:
            campaign.body || campaign.subjectLines ? "completed" : "pending",
        },
        type: "contentGenerationNode",
      },
      {
        id: "content-2",
        position: { x: 400, y: -50 },
        data: {
          label: "Content Generation",
          data: campaign,
          status:
            campaign.body || campaign.subjectLines ? "completed" : "pending",
        },
        type: "contentGenerationNode",
      },
      {
        id: "schedule",
        position: { x: 200, y: 200 },
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
        position: { x: 200, y: 400 },
        data: {
          label: "Analytics",
          type: "analytics",
          data: campaign,
          status: campaign.status === "sent" ? "completed" : "disabled",
        } as CampaignNodeData,
        type: "campaignNode",
      },
    ];
  }, [campaign]);

  const initialEdges = useMemo(() => {
    if (!campaign) return [];

    return [
      { id: "abTestNode-content-1", source: "abTestNode", target: "content" },
      { id: "abTestNode-content-2", source: "abTestNode", target: "content-2" },
      { id: "campaign-abTest", source: "campaign", target: "abTestNode" },
      { id: "content-schedule", source: "content", target: "schedule" },
      { id: "content-2-schedule", source: "content-2", target: "schedule" },
      { id: "schedule-analytics", source: "schedule", target: "analytics" },
    ];
  }, [campaign]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (campaign) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      // Initialize default max connections for labeled nodes
      setNodeMaxConnections((prev) => ({
        ...prev,
        labeledNode: 2, // Default to 2 A/B test variants
      }));
    }
  }, [campaign, initialNodes, initialEdges, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      console.log("🔗 Connection attempt:", params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      console.log("🔍 Validating connection:", connection);

      // Extract connection properties (works for both Connection and Edge types)
      const source = connection.source;
      const sourceHandle =
        "sourceHandle" in connection ? connection.sourceHandle : null;

      // Find the source node
      const sourceNode = nodes.find((n) => n.id === source);

      // If it's a labeledNode (A/B test node), check connection limits
      if (
        sourceNode?.type === "labeledNode" &&
        sourceHandle?.includes("-output")
      ) {
        // Get the max connections allowed for this node (default to 2)
        const maxConnections = nodeMaxConnections[source] || 2;

        // Count existing connections from this source handle
        const existingConnections = edges.filter((edge) => {
          const edgeWithHandle = edge as Edge & {
            sourceHandle?: string | null;
          };
          return (
            edge.source === source &&
            edgeWithHandle.sourceHandle === sourceHandle
          );
        });

        console.log(
          `🔢 Node ${source}: ${existingConnections.length}/${maxConnections} connections`,
        );

        if (existingConnections.length >= maxConnections) {
          console.log(
            `❌ Connection blocked - maximum ${maxConnections} connections reached`,
          );
          return false;
        }
      }

      console.log("✅ Connection allowed");
      return true;
    },
    [nodes, edges, nodeMaxConnections],
  );

  const onAddNode = useCallback(
    (
      nodeType: { id: string; label: string; type: string },
      position: { x: number; y: number },
    ) => {
      const newId = `${nodeType.id}-${Date.now()}`;

      let newNode;
      if (nodeType.type === "campaignNode") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
            type: nodeType.id,
            data: campaign || {},
            status: "pending",
          } as CampaignNodeData,
          type: "campaignNode",
        };
      } else if (nodeType.type === "contentGenerationNode") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
            data: campaign || {},
            status: "pending",
          },
          type: "contentGenerationNode",
        };
      } else if (nodeType.type === "labeledNode") {
        newNode = {
          id: newId,
          position,
          data: {
            title: nodeType.label,
            target: "target",
          },
          type: "labeledNode",
        };
      }

      if (newNode) {
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [campaign, setNodes],
  );

  const onClearAll = useCallback(() => {
    setNodes([]);
    setEdges([]);
  }, [setNodes, setEdges]);

  const onResetToDefault = useCallback(() => {
    if (campaign) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [campaign, initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center gap-4">
          <div className="rounded-lg border border-gray-200 bg-white/80 px-4 py-2 backdrop-blur-sm">
            <h1 className="font-semibold">
              {campaign?.campaignName || "Loading..."}
            </h1>
            <p className="text-sm text-gray-600 capitalize">
              {campaign?.category || "Unknown"} •{" "}
              {campaign?.status || "Loading"}
            </p>
          </div>
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 cursor-default rounded-4xl border bg-gradient-to-br from-black/80 to-black px-6 py-3 text-white drop-shadow-2xl backdrop-blur-md">
        <NodesCMDK
          onAddNode={onAddNode}
          onClearAll={onClearAll}
          onResetToDefault={onResetToDefault}
        />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges.map((edge: Edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const isTranscriptionEdge = sourceNode?.type === "transcription";

          return {
            ...edge,
            animated: true,
            style: {
              stroke: isTranscriptionEdge
                ? "var(--color-convex-yellow)"
                : "var(--color-convex-purple)",
              strokeWidth: isTranscriptionEdge ? 3 : 1.8,
              strokeOpacity: isTranscriptionEdge ? 0.7 : 0.5,
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isTranscriptionEdge
                ? "var(--color-convex-yellow)"
                : "var(--color-convex-purple)",
              width: 14,
              height: 14,
            },
          };
        })}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        isValidConnection={isValidConnection}
        fitView
        fitViewOptions={{
          padding: 0.2,
          minZoom: 0.2,
          maxZoom: 1.0,
          includeHiddenNodes: false,
        }}
        minZoom={0.6}
        maxZoom={1}
      >
        <Controls position="top-right" />
        <MiniMap nodeStrokeWidth={2} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={10}
          size={1}
          color="#94a3b8"
          style={{ opacity: 0.4 }}
        />
      </ReactFlow>
    </div>
  );
}
