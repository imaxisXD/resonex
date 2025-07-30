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
import ABTestNode from "@/components/ABTestNode";
import ContentGenerationNode from "@/components/ContentGenerationNode";
import { NodesCMDK } from "@/components/NodesCMDK";
import { CampaignNode } from "@/components/CampaignNode";
import { ScheduleNode } from "@/components/ScheduleNode";
import { AnalyticsNode } from "@/components/AnalyticsNode";
import { CampaignNodeData } from "@/lib/connection-rules";
import { useConnectionRules } from "@/hooks/useConnectionRules";

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
          status: "created",
        } as CampaignNodeData,
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
        type: "scheduleNode",
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
      { id: "schedule-analytics", source: "schedule", target: "analytics" },
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
      setNodes(savedCanvas.nodes);
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
    }, 2000); // Save 2 seconds after last change

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
        };
      }

      if (newNode) {
        setNodes((nds) => [...nds, newNode]);
        // Save after adding new node
        setTimeout(() => handleSaveCanvas(), 100);
      }
    },
    [campaign, setNodes, handleSaveCanvas],
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

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
        // const sourceNode = nodes.find((n) => n.id === edge.source);

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
