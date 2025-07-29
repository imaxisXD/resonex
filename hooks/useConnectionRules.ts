import { useMemo, useCallback } from "react";
import { type Node, type Edge, type Connection } from "@xyflow/react";
import {
  ConnectionRulesEngine,
  CONNECTION_RULES,
  NODE_CONNECTION_LIMITS,
} from "@/lib/connection-rules";

export const useConnectionRules = (nodes: Node[], edges: Edge[]) => {
  const connectionRulesEngine = useMemo(
    () => new ConnectionRulesEngine(CONNECTION_RULES, NODE_CONNECTION_LIMITS),
    [],
  );

  const isValidConnection = useCallback(
    (connection: Connection | Edge) => {
      return connectionRulesEngine.validateConnection(connection, nodes, edges);
    },
    [connectionRulesEngine, nodes, edges],
  );

  return { isValidConnection };
};
