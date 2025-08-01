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
      // onContentChange: (content: string) =>
      //   console.log("Content changed:", content),
      // onEmailTypeChange: (type: "newsletter" | "marketing") =>
      //   console.log("Type changed:", type),
    } as BaseNodeData,
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

  const addNewNode = () => {
    const newNode: Node = {
      id: `node-${Date.now()}`,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: {
        label: "New Campaign",
        content: "",
        emailType: "newsletter" as const,
        onContentChange: (content: string) =>
          console.log("Content changed:", content),
        onEmailTypeChange: (type: "newsletter" | "marketing") =>
          console.log("Type changed:", type),
      } as BaseNodeData,
      type: "baseNode",
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-4 left-4 z-10">
        <button
          onClick={addNewNode}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white shadow-lg transition-colors hover:bg-blue-600"
        >
          Add New Node
        </button>
      </div>
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
    </div>
  );
}
