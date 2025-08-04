import { type Node, type Edge, type Connection } from "@xyflow/react";
import { toast } from "sonner";
import { Doc } from "@/convex/_generated/dataModel";

interface ConnectionRule {
  sourceType: string;
  targetType: string;
  sourceHandle?: string;
  targetHandle?: string;
  maxConnections?: number;
  allowMultiple?: boolean;
  customValidator?: (
    source: Node,
    target: Node,
    sourceHandle?: string,
    targetHandle?: string,
    existingEdges?: Edge[],
  ) => {
    isValid: boolean;
    message?: string;
  };
}

interface NodeConnectionLimits {
  [nodeType: string]: {
    maxIncoming?: number;
    maxOutgoing?: number;
    maxConnectionsPerHandle?: number;
  };
}

export interface CampaignNodeData extends Record<string, unknown> {
  label: string;
  type: "campaign" | "content" | "schedule" | "analytics";
  data: Doc<"campaigns">;
  status?:
    | "completed"
    | "pending"
    | "disabled"
    | "created"
    | "scheduled"
    | "running";
}

export const CONNECTION_RULES: ConnectionRule[] = [
  {
    sourceType: "campaignNode",
    targetType: "abTestNode",
    maxConnections: 1,
    customValidator: (source) => {
      const sourceData = source.data as CampaignNodeData;
      if (sourceData?.type === "campaign") {
        return { isValid: true };
      }
      return {
        isValid: false,
        message: "Only campaign nodes can connect to A/B Test nodes",
      };
    },
  },
  {
    sourceType: "abTestNode",
    targetType: "contentGenerationNode",
    sourceHandle: "target-output",
    allowMultiple: true,
  },
  {
    sourceType: "contentGenerationNode",
    targetType: "scheduleNode",
    maxConnections: 1,
  },
  {
    sourceType: "scheduleNode",
    targetType: "analyticsNode",
    maxConnections: 1,
  },
  {
    sourceType: "scheduleNode",
    targetType: "recipientsEmailNode",
    maxConnections: 1,
  },
  {
    sourceType: "*",
    targetType: "*",
    customValidator: () => ({
      isValid: false,
      message: "This connection is not allowed by the current workflow rules",
    }),
  },
];

export const NODE_CONNECTION_LIMITS: NodeConnectionLimits = {
  campaignNode: {
    maxOutgoing: 1,
    maxIncoming: 0,
  },
  scheduleNode: {
    maxIncoming: 2,
    maxOutgoing: 1,
  },
  analyticsNode: {
    maxIncoming: 1,
    maxOutgoing: 0,
  },
  abTestNode: {
    maxIncoming: 1,
    maxOutgoing: 10,
    maxConnectionsPerHandle: 10,
  },
  contentGenerationNode: {
    maxOutgoing: 1,
  },
};

export class ConnectionRulesEngine {
  private rules: ConnectionRule[];
  private nodeLimits: NodeConnectionLimits;
  private lastToastTime: number = 0;
  private toastCooldown: number = 2000;

  constructor(rules: ConnectionRule[], nodeLimits: NodeConnectionLimits) {
    this.rules = rules;
    this.nodeLimits = nodeLimits;
  }

  private showDebouncedToast(message: string) {
    const now = Date.now();
    if (now - this.lastToastTime > this.toastCooldown) {
      toast.error(message);
      this.lastToastTime = now;
    }
  }

  private validateABTestConnection(
    sourceNode: Node,
    targetNode: Node,
    sourceHandle: string | undefined,
    existingEdges: Edge[],
  ): { isValid: boolean; message?: string } {
    // Check how many connections already exist from this ABTestNode
    const existingConnections = existingEdges.filter(
      (edge) =>
        edge.source === sourceNode.id && edge.sourceHandle === sourceHandle,
    ).length;

    // Get the configured output count from the node's data
    const nodeData = sourceNode.data as { outputEdges?: number };
    const configuredOutputs = nodeData?.outputEdges || 2;

    if (existingConnections >= configuredOutputs) {
      return {
        isValid: false,
        message: `A/B Test node is configured for ${configuredOutputs} variants. Already has ${existingConnections} connections.`,
      };
    }

    return { isValid: true };
  }

  private getNodeType(node: Node): string {
    if (node.type) return node.type;
    const nodeData = node.data as Record<string, unknown>;
    const nodeType = nodeData?.type;
    return typeof nodeType === "string" ? nodeType : "unknown";
  }

  private checkConnectionLimits(
    connection: Connection | Edge,
    nodes: Node[],
    existingEdges: Edge[],
  ): { isValid: boolean; message?: string } {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      return { isValid: false, message: "Source or target node not found" };
    }

    const sourceType = this.getNodeType(sourceNode);
    const targetType = this.getNodeType(targetNode);

    const sourceLimits = this.nodeLimits[sourceType];
    const targetLimits = this.nodeLimits[targetType];

    if (sourceLimits?.maxOutgoing) {
      const outgoingCount = existingEdges.filter(
        (edge) => edge.source === connection.source,
      ).length;
      if (outgoingCount >= sourceLimits.maxOutgoing) {
        return {
          isValid: false,
          message: `${sourceType} can have maximum ${sourceLimits.maxOutgoing} outgoing connections`,
        };
      }
    }

    if (targetLimits?.maxIncoming) {
      const incomingCount = existingEdges.filter(
        (edge) => edge.target === connection.target,
      ).length;
      if (incomingCount >= targetLimits.maxIncoming) {
        return {
          isValid: false,
          message: `${targetType} can have maximum ${targetLimits.maxIncoming} incoming connections`,
        };
      }
    }

    if (
      sourceLimits?.maxConnectionsPerHandle &&
      "sourceHandle" in connection &&
      connection.sourceHandle
    ) {
      const handleConnections = existingEdges.filter(
        (edge) =>
          edge.source === connection.source &&
          (edge as Edge & { sourceHandle?: string }).sourceHandle ===
            connection.sourceHandle,
      ).length;

      if (handleConnections >= sourceLimits.maxConnectionsPerHandle) {
        return {
          isValid: false,
          message: `Each handle can have maximum ${sourceLimits.maxConnectionsPerHandle} connections`,
        };
      }
    }

    return { isValid: true };
  }

  validateConnection(
    connection: Connection | Edge,
    nodes: Node[],
    existingEdges: Edge[],
  ): boolean {
    const sourceNode = nodes.find((n) => n.id === connection.source);
    const targetNode = nodes.find((n) => n.id === connection.target);

    if (!sourceNode || !targetNode) {
      this.showDebouncedToast(
        "Invalid connection: source or target node not found",
      );
      return false;
    }

    const sourceType = this.getNodeType(sourceNode);
    const targetType = this.getNodeType(targetNode);
    const sourceHandle =
      "sourceHandle" in connection
        ? (connection.sourceHandle ?? undefined)
        : undefined;
    const targetHandle =
      "targetHandle" in connection
        ? (connection.targetHandle ?? undefined)
        : undefined;

    const limitsCheck = this.checkConnectionLimits(
      connection,
      nodes,
      existingEdges,
    );
    if (!limitsCheck.isValid) {
      this.showDebouncedToast(
        limitsCheck.message || "Connection limit exceeded",
      );
      return false;
    }

    // Special validation for AB test connections
    if (sourceType === "abTestNode" && targetType === "contentGenerationNode") {
      const abTestValidation = this.validateABTestConnection(
        sourceNode,
        targetNode,
        sourceHandle,
        existingEdges,
      );
      if (!abTestValidation.isValid) {
        this.showDebouncedToast(
          abTestValidation.message || "AB Test connection limit exceeded",
        );
        return false;
      }
    }

    const applicableRules = this.rules
      .filter((rule) => {
        const sourceMatches =
          rule.sourceType === "*" || rule.sourceType === sourceType;
        const targetMatches =
          rule.targetType === "*" || rule.targetType === targetType;
        const sourceHandleMatches =
          !rule.sourceHandle || rule.sourceHandle === sourceHandle;
        const targetHandleMatches =
          !rule.targetHandle || rule.targetHandle === targetHandle;

        return (
          sourceMatches &&
          targetMatches &&
          sourceHandleMatches &&
          targetHandleMatches
        );
      })
      .sort((a, b) => {
        const aSpecificity =
          (a.sourceType === "*" ? 0 : 1) + (a.targetType === "*" ? 0 : 1);
        const bSpecificity =
          (b.sourceType === "*" ? 0 : 1) + (b.targetType === "*" ? 0 : 1);
        return bSpecificity - aSpecificity;
      });

    for (const rule of applicableRules) {
      if (rule.maxConnections) {
        const ruleConnections = existingEdges.filter((edge) => {
          const edgeSourceHandle = (edge as Edge & { sourceHandle?: string })
            .sourceHandle;
          const edgeTargetHandle = (edge as Edge & { targetHandle?: string })
            .targetHandle;

          return (
            edge.source === connection.source &&
            (!rule.sourceHandle || rule.sourceHandle === edgeSourceHandle) &&
            (!rule.targetHandle || rule.targetHandle === edgeTargetHandle)
          );
        }).length;

        if (ruleConnections >= rule.maxConnections) {
          this.showDebouncedToast(
            `Maximum ${rule.maxConnections} connections allowed for this connection type`,
          );
          return false;
        }
      }

      if (rule.customValidator) {
        const validation = rule.customValidator(
          sourceNode,
          targetNode,
          sourceHandle,
          targetHandle,
          existingEdges,
        );
        if (!validation.isValid) {
          this.showDebouncedToast(
            validation.message || "Connection not allowed",
          );
          return false;
        }
        return true;
      }

      if (rule.sourceType !== "*" || rule.targetType !== "*") {
        return true;
      }
    }

    const wildcardRule = applicableRules.find(
      (rule) => rule.sourceType === "*" && rule.targetType === "*",
    );
    if (wildcardRule?.customValidator) {
      const validation = wildcardRule.customValidator(
        sourceNode,
        targetNode,
        sourceHandle,
        targetHandle,
        existingEdges,
      );
      if (!validation.isValid) {
        this.showDebouncedToast(validation.message || "Connection not allowed");
        return false;
      }
    }

    return false;
  }

  validateAllNodesStatus(
    nodes: Node[],
    edges: Edge[],
  ): {
    allReady: boolean;
    nodeStatuses: Array<{
      nodeId: string;
      nodeType: string;
      status: "ready" | "pending" | "error";
      message?: string;
      issues?: string[];
    }>;
    abTestValidation: Array<{
      nodeId: string;
      outputEdges: number;
      connectedNodes: number;
      isValid: boolean;
      message?: string;
    }>;
  } {
    const nodeStatuses = nodes.map((node) => {
      const nodeType = this.getNodeType(node);
      return this.validateSingleNodeStatus(node, edges, nodes, nodeType);
    });

    const abTestValidation = nodes
      .filter((node) => this.getNodeType(node) === "abTestNode")
      .map((node) => this.validateABTestNodeConnections(node, edges, nodes));

    const allReady =
      nodeStatuses.every((status) => status.status === "ready") &&
      abTestValidation.every((validation) => validation.isValid);

    return {
      allReady,
      nodeStatuses,
      abTestValidation,
    };
  }

  private validateSingleNodeStatus(
    node: Node,
    edges: Edge[],
    nodes: Node[],
    nodeType: string,
  ): {
    nodeId: string;
    nodeType: string;
    status: "ready" | "pending" | "error";
    message?: string;
    issues?: string[];
  } {
    const nodeData = node.data as Record<string, unknown>;
    const issues: string[] = [];
    let status: "ready" | "pending" | "error" = "pending";
    let message = "";

    switch (nodeType) {
      case "campaignNode":
        const campaignData = nodeData;
        if (campaignData.status === "created") {
          status = "ready";
          message = "Campaign node is ready";
        } else {
          if (!campaignData.campaignName)
            issues.push("Campaign name is required");
          if (!campaignData.prompt) issues.push("Campaign prompt is required");
          message = "Campaign node needs configuration";
        }
        break;

      case "abTestNode":
        const abTestData = nodeData as { outputEdges?: number };
        const outputEdges = abTestData.outputEdges || 2;
        const connections = edges.filter(
          (edge) => edge.source === node.id,
        ).length;

        if (connections === outputEdges) {
          status = "ready";
          message = `A/B Test node has all ${outputEdges} connections`;
        } else if (connections < outputEdges) {
          issues.push(`Missing ${outputEdges - connections} connection(s)`);
          message = `A/B Test node needs ${outputEdges - connections} more connection(s)`;
        } else {
          status = "error";
          issues.push(`Too many connections: ${connections}/${outputEdges}`);
          message = `A/B Test node has excess connections`;
        }
        break;

      case "contentGenerationNode":
        const contentData = nodeData as {
          selectedTemplate?: unknown;
          data?: { _id?: string };
        };
        const incomingEdges = edges.filter((edge) => edge.target === node.id);
        const hasABTestConnection = incomingEdges.some((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          return sourceNode && this.getNodeType(sourceNode) === "abTestNode";
        });

        if (contentData.selectedTemplate && hasABTestConnection) {
          status = "ready";
          message = "Content generation node is ready";
        } else {
          if (!contentData.selectedTemplate)
            issues.push("Template not selected");
          if (!hasABTestConnection)
            issues.push("Not connected to A/B Test node");
          message = "Content generation node needs configuration";
        }
        break;

      case "recipientsEmailNode":
        const emailData = nodeData as { emails?: Array<{ email: string }> };
        const emailCount = emailData.emails?.length || 0;

        if (emailCount >= 2) {
          status = "ready";
          message = `Recipients node has ${emailCount} email(s)`;
        } else {
          issues.push(`Need at least 2 emails (currently ${emailCount})`);
          message = "Recipients node needs more emails";
        }
        break;

      case "scheduleNode":
        const scheduleData = nodeData as {
          selectedDate?: Date | string;
          selectedTime?: string;
        };

        if (scheduleData.selectedDate && scheduleData.selectedTime) {
          status = "ready";
          message = "Schedule node is configured";
        } else {
          if (!scheduleData.selectedDate) issues.push("Date not selected");
          if (!scheduleData.selectedTime) issues.push("Time not selected");
          message = "Schedule node needs date and time";
        }
        break;

      default:
        status = "ready";
        message = `Unknown node type: ${nodeType}`;
        break;
    }

    return {
      nodeId: node.id,
      nodeType,
      status,
      message,
      issues: issues.length > 0 ? issues : undefined,
    };
  }

  private validateABTestNodeConnections(
    node: Node,
    edges: Edge[],
    nodes: Node[],
  ): {
    nodeId: string;
    outputEdges: number;
    connectedNodes: number;
    isValid: boolean;
    message?: string;
  } {
    const nodeData = node.data as { outputEdges?: number };
    const outputEdges = nodeData.outputEdges || 2;

    const connectedContentNodes = edges.filter((edge) => {
      if (edge.source !== node.id) return false;

      const targetNode = nodes.find((n) => n.id === edge.target);
      return (
        targetNode && this.getNodeType(targetNode) === "contentGenerationNode"
      );
    }).length;

    const isValid = connectedContentNodes === outputEdges;
    let message = "";

    if (isValid) {
      message = `A/B Test node properly connected to ${outputEdges} content generation nodes`;
    } else if (connectedContentNodes < outputEdges) {
      message = `A/B Test node needs ${outputEdges - connectedContentNodes} more content generation node connection(s)`;
    } else {
      message = `A/B Test node has too many connections: ${connectedContentNodes}/${outputEdges}`;
    }

    return {
      nodeId: node.id,
      outputEdges,
      connectedNodes: connectedContentNodes,
      isValid,
      message,
    };
  }
}
