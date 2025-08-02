"use client";
import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  MarkerType,
  type Node,
  Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import AddNewCampaignNode, {
  BaseNodeData,
} from "@/components/nodes/AddNewCampaignNode";

const nodeTypes = {
  baseNode: AddNewCampaignNode,
};

const initialNodes: Node[] = [
  {
    id: "n1",
    position: { x: 50, y: 50 },
    data: {
      label: "Create a new campaign",
      emailType: "newsletter" as const,
    } as BaseNodeData,
    deletable: false,
    type: "baseNode",
  },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function App() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <ReactFlow
      nodes={nodes}
      nodeTypes={nodeTypes}
      edges={edges.map((edge: Edge) => {
        const sourceNode = nodes.find((n: Node) => n.id === edge.source);
        const isTranscriptionEdge = sourceNode?.type === "transcription";

        return {
          ...edge,
          animated: true,
          style: {
            stroke: isTranscriptionEdge
              ? "var(--color-convex-yellow)"
              : "var(--color-convex-purple)",
            strokeWidth: isTranscriptionEdge ? 3 : 1.5,
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
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
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
      <MiniMap nodeStrokeWidth={3} />
      <Background
        variant={BackgroundVariant.Dots}
        gap={10}
        size={1}
        color="#94a3b8"
        style={{ opacity: 0.4 }}
      />
    </ReactFlow>
  );
}
