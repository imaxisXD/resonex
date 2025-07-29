"use client";
import { useMemo, useEffect, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  MarkerType,
  addEdge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import ABTestNode from "@/components/ABTestNode";
import ContentGenerationNode from "@/components/ContentGenerationNode";
import { NodesCMDK } from "@/components/NodesCMDK";
import { CampaignNode } from "@/components/CampaignNode";
import { CampaignNodeData } from "@/lib/connection-rules";
import { useConnectionRules } from "@/hooks/useConnectionRules";

interface ABTestNodeData {
  title: string;
  target: string;
  maxConnections?: number;
}

export default function CampaignPage() {
  const params = useParams();
  const campaignId = params.id as string;
  const campaign = useQuery(api.campaigns.getCampaign, { campaignId });

  const handleOutputEdgesChange = useCallback(
    (id: string) => (count: number) => {
      console.log(`Node ${id} output edges changed to ${count}`);
    },
    [],
  );

  const ABTestNodeWrapper = useCallback(
    ({ data, id }: { data: ABTestNodeData; id: string }) => {
      return (
        <ABTestNode
          title={data.title}
          target={data.target}
          onOutputEdgesChange={handleOutputEdgesChange(id)}
        />
      );
    },
    [handleOutputEdgesChange],
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

  useEffect(() => {
    if (campaign) {
      setNodes(initialNodes);
      setEdges(initialEdges);
    }
  }, [campaign, initialNodes, initialEdges, setNodes, setEdges]);

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
      } else if (nodeType.type === "abTestNode") {
        newNode = {
          id: newId,
          position,
          data: {
            title: nodeType.label,
            target: "target",
          },
          type: "abTestNode",
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

  const styledEdges = useMemo(
    () =>
      edges.map((edge) => {
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
      }),
    [edges, nodes],
  );

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
