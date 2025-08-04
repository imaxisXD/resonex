import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { type Node, type Edge } from "@xyflow/react";
import {
  ConnectionRulesEngine,
  CONNECTION_RULES,
  NODE_CONNECTION_LIMITS,
} from "./connection-rules";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Check if a campaign workflow is ready to execute
 * This validates all nodes and specifically checks A/B test connections
 */
export function checkWorkflowReadiness(nodes: Node[], edges: Edge[]) {
  const engine = new ConnectionRulesEngine(
    CONNECTION_RULES,
    NODE_CONNECTION_LIMITS,
  );
  const validation = engine.validateAllNodesStatus(nodes, edges);

  return {
    isReady: validation.allReady,
    summary: {
      totalNodes: nodes.length,
      readyNodes: validation.nodeStatuses.filter((n) => n.status === "ready")
        .length,
      pendingNodes: validation.nodeStatuses.filter(
        (n) => n.status === "pending",
      ).length,
      errorNodes: validation.nodeStatuses.filter((n) => n.status === "error")
        .length,
      abTestNodes: validation.abTestValidation.length,
      validAbTestNodes: validation.abTestValidation.filter((ab) => ab.isValid)
        .length,
    },
    details: validation,
    issues: validation.nodeStatuses
      .filter((node) => node.issues && node.issues.length > 0)
      .map((node) => ({
        nodeId: node.nodeId,
        nodeType: node.nodeType,
        issues: node.issues || [],
      })),
    abTestIssues: validation.abTestValidation
      .filter((ab) => !ab.isValid)
      .map((ab) => ({
        nodeId: ab.nodeId,
        expectedConnections: ab.outputEdges,
        actualConnections: ab.connectedNodes,
        message: ab.message,
      })),
  };
}
