"use client";
import { useMemo, useEffect, useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  useReactFlow,
  type Connection,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import ABTestNode from "@/components/nodes/ABTestNode";
import ContentGenerationNode from "@/components/nodes/ContentGenerationNode";
import { NodesCMDK } from "@/components/NodesCMDK";
import { ScheduleNode } from "@/components/nodes/ScheduleNode";
import { AnalyticsNode } from "@/components/nodes/AnalyticsNode";
import { CampaignNodeData } from "@/lib/connection-rules";
import { useConnectionRules } from "@/hooks/useConnectionRules";
import { CampaignNode } from "@/components/nodes/CampaignNode";
import { RecipientsEmailNode } from "@/components/nodes/RecipientsEmailNode";

interface ABTestNodeData {
  title: string;
  target: string;
  maxConnections?: number;
  outputEdges?: number;
}

type ExtendedNodeProps = {
  measured?: {
    width: number;
    height: number;
  };

  hidden?: boolean;
  zIndex?: number;
};

type ExtendedEdgeProps = {
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
};

function CampaignPageContent() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });
  const deleteEmailNode = useMutation(api.campaigns.deleteEmailNode);

  const savedCanvas = useQuery(
    api.reactFlowCanvas.loadCanvas,
    campaign ? { campaignId: campaign?._id } : "skip",
  );
  const saveCanvas = useMutation(api.reactFlowCanvas.saveCanvas);

  const { updateNodeData } = useReactFlow();

  const handleOutputEdgesChange = useCallback(
    (id: string) => (count: number) => {
      updateNodeData(id, { outputEdges: count });
    },
    [updateNodeData],
  );

  const ABTestNodeWrapper = useCallback(
    ({ data, id }: { data: ABTestNodeData; id: string }) => {
      return (
        <ABTestNode
          title={data.title}
          target={data.target}
          data={data}
          onOutputEdgesChange={handleOutputEdgesChange(id)}
        />
      );
    },
    [handleOutputEdgesChange],
  );

  const nodeTypes = useMemo(
    () => ({
      campaignNode: CampaignNode,
      scheduleNode: ScheduleNode,
      analyticsNode: AnalyticsNode,
      abTestNode: ABTestNodeWrapper,
      contentGenerationNode: ContentGenerationNode,
      recipientsEmailNode: RecipientsEmailNode,
    }),
    [ABTestNodeWrapper],
  );

  const initialNodes = useMemo(() => {
    if (!campaign) return [];

    return [
      {
        id: "campaign",
        position: { x: 148, y: -600 },
        data: {
          label: "Campaign Details",
          type: "campaign",
          data: campaign,
          status: "created",
        } as CampaignNodeData,
        deletable: false,
        type: "campaignNode",
      },
      {
        id: "abTestNode",
        position: { x: 148, y: -280 },
        data: {
          title: "A/B Test",
          target: "target",
          outputEdges: 2,
        },
        type: "abTestNode",
        deletable: false,
      },
      {
        id: "content",
        position: { x: 0, y: -50 },
        data: {
          label: "Content Generation",
          data: campaign,
        },
        type: "contentGenerationNode",
      },
      {
        id: "content-2",
        position: { x: 400, y: -50 },
        data: {
          label: "Content Generation",
          data: campaign,
        },
        type: "contentGenerationNode",
      },
      {
        id: "schedule",
        position: { x: 200, y: 300 },
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
        type: "scheduleNode",
      },
      {
        id: "recipients",
        position: { x: 200, y: 500 },
        data: {
          label: "Recipients",
        } as CampaignNodeData,
        deletable: false,
        type: "recipientsEmailNode",
      },
      {
        id: "analytics",
        position: { x: 200, y: 550 },
        data: {
          label: "Analytics",
          type: "analytics",
          data: campaign,
          status: campaign.status === "sent" ? "completed" : "disabled",
        } as CampaignNodeData,
        type: "analyticsNode",
      },
    ];
  }, [campaign]);

  const initialEdges = useMemo(() => {
    if (!campaign) return [];

    return [
      {
        id: "abTestNode-content-1",
        source: "abTestNode",
        sourceHandle: "target-output",
        target: "content",
      },
      {
        id: "abTestNode-content-2",
        source: "abTestNode",
        sourceHandle: "target-output",
        target: "content-2",
      },
      { id: "campaign-abTest", source: "campaign", target: "abTestNode" },
      { id: "content-schedule", source: "content", target: "schedule" },
      { id: "content-2-schedule", source: "content-2", target: "schedule" },
      { id: "schedule-recipients", source: "schedule", target: "recipients" },
      // { id: "schedule-analytics", source: "schedule", target: "analytics" },
    ];
  }, [campaign]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { isValidConnection } = useConnectionRules(nodes, edges);

  const handleSaveCanvas = useCallback(async () => {
    if (campaignId && nodes.length > 0) {
      try {
        await saveCanvas({
          campaignId:
            campaignId as import("@/convex/_generated/dataModel").Id<"campaigns">,
          nodes: nodes.map((node) => {
            const extendedNode = node as Node & ExtendedNodeProps;
            return {
              id: node.id,
              type: node.type,
              position: node.position,
              data: node.data,
              measured: extendedNode.measured || { width: 200, height: 100 },
              hidden: extendedNode.hidden,
              zIndex: extendedNode.zIndex,
            };
          }),
          edges: edges.map((edge) => {
            const extendedProps = edge as Edge & ExtendedEdgeProps;
            return {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              sourceHandle: extendedProps.sourceHandle,
              targetHandle: extendedProps.targetHandle,
              type: extendedProps.type,
              label: extendedProps.label,
            };
          }),
        });
      } catch (error) {
        console.error("Failed to save canvas:", error);
      }
    }
  }, [campaignId, nodes, edges, saveCanvas]);

  useEffect(() => {
    if (savedCanvas?.nodes && savedCanvas?.edges) {
      const nodesWithDeletable = savedCanvas.nodes.map((node) => {
        if (
          node.id === "campaign" ||
          node.id === "abTestNode" ||
          node.id === "recipients"
        ) {
          return { ...node, deletable: false };
        }
        return node;
      });
      setNodes(nodesWithDeletable);
      setEdges(savedCanvas.edges);
    } else if (campaign && initialNodes.length > 0) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [savedCanvas, campaign, initialNodes, initialEdges, setNodes, setEdges]);

  useEffect(() => {
    if (nodes.length === 0) return;

    const timeoutId = setTimeout(() => {
      handleSaveCanvas();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [nodes, edges, handleSaveCanvas]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onAddNode = useCallback(
    (
      nodeType: { id: string; label: string; type: string },
      position: { x: number; y: number },
    ) => {
      const newId = `${nodeType.id}-${Date.now()}`;

      let newNode;
      if (nodeType.id === "campaign") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
            type: "campaign",
            data: campaign || {},
            status: "pending",
          } as CampaignNodeData,
          type: "campaignNode",
          deletable: false,
        };
      } else if (nodeType.id === "schedule") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
            type: "schedule",
            data: campaign || {},
            status: "pending",
          } as CampaignNodeData,
          type: "scheduleNode",
        };
      } else if (nodeType.id === "analytics") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
            type: "analytics",
            data: campaign || {},
            status: "pending",
          } as CampaignNodeData,
          type: "analyticsNode",
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
      } else if (nodeType.type === "abTestNode") {
        newNode = {
          id: newId,
          position,
          data: {
            title: nodeType.label,
            target: "target",
            outputEdges: 2,
          },
          type: "abTestNode",
          deletable: false,
        };
      } else if (nodeType.type === "recipientsEmailNode") {
        newNode = {
          id: newId,
          position,
          data: {
            label: nodeType.label,
          } as CampaignNodeData,
          type: "recipientsEmailNode",
          deletable: false,
        };
      }

      if (newNode) {
        setNodes((nds) => [...nds, newNode]);
      }
    },
    [campaign, setNodes],
  );

  const onClearAll = useCallback(async () => {
    setNodes([]);
    setEdges([]);
    setTimeout(() => handleSaveCanvas(), 100);
  }, [setNodes, setEdges, handleSaveCanvas]);

  const onResetToDefault = useCallback(async () => {
    if (campaign) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setTimeout(() => handleSaveCanvas(), 100);
    }
  }, [
    campaign,
    initialNodes,
    initialEdges,
    setNodes,
    setEdges,
    handleSaveCanvas,
  ]);

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      if (deleted.length > 0) {
        setNodes((prevNodes) =>
          prevNodes.filter((node) => !deleted.some((d) => d.id === node.id)),
        );
        setEdges((prevEdges) =>
          prevEdges.filter(
            (edge) =>
              !deleted.some(
                (d) => d.id === edge.source || d.id === edge.target,
              ),
          ),
        );
        handleSaveCanvas();
        deleted.forEach((node) => {
          if (node.type === "contentGenerationNode") {
            deleteEmailNode({ nodeId: node.id, campaignId });
          }
        });
      }
    },
    [setNodes, setEdges, deleteEmailNode, campaignId],
  );

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        return {
          ...edge,
          animated: true,
          style: {
            stroke: "var(--color-convex-purple)",
            strokeWidth: 1.8,
            strokeOpacity: 0.7,
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "var(--color-convex-purple)",
            width: 18,
            height: 18,
          },
        };
      }),
    [edges, nodes],
  );

  if (!campaign) return null;

  function nodeColor(node: Node) {
    switch (node.type) {
      case "campaignNode":
        return "var(--color-blue-400)";
      case "scheduleNode":
        return "var(--color-green-500)";
      case "analyticsNode":
        return "var(--color-pink-400)";
      case "abTestNode":
        return "var(--color-yellow-400)";
      case "contentGenerationNode":
        return "var(--color-purple-400)";
      case "recipientsEmailNode":
        return "var(--color-slate-400)";
      default:
        return "var(--color-emerald-400)";
    }
  }

  return (
    <div className="relative h-full">
      <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 cursor-default rounded-4xl border bg-gradient-to-br from-black/80 to-black px-6 py-3 text-white drop-shadow-2xl backdrop-blur-md">
        <NodesCMDK
          onAddNode={onAddNode}
          onClearAll={onClearAll}
          onResetToDefault={onResetToDefault}
        />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodesDelete={onNodesDelete}
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
        <MiniMap nodeColor={nodeColor} />
        <Background
          variant={BackgroundVariant.Dots}
          gap={10}
          size={1}
          color="#94a3b8"
          style={{ opacity: 0.5 }}
        />
      </ReactFlow>
    </div>
  );
}

export default function CampaignPage() {
  return (
    <ReactFlowProvider>
      <CampaignPageContent />
    </ReactFlowProvider>
  );
}
