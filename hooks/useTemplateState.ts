import { useCallback } from "react";
import { useReactFlow, useNodesData } from "@xyflow/react";
import { EmailTemplate } from "@/components/types/email-template";

interface SelectedTemplateInfo {
  template: EmailTemplate;
  templateIndex: number;
  emailHTML: string;
}

/**
 * Hook for synchronized template state across all ContentGenerationNode instances
 * Uses React Flow's recommended updateNodeData pattern
 */
export function useSynchronizedTemplateState(nodeId: string) {
  const { updateNodeData, getNodes } = useReactFlow();
  const nodeData = useNodesData(nodeId);

  const selectedTemplate =
    (nodeData?.data?.selectedTemplate as SelectedTemplateInfo) || null;

  const setSelectedTemplate = useCallback(
    (templateInfo: SelectedTemplateInfo | null) => {
      const nodes = getNodes();
      const contentGenerationNodes = nodes.filter(
        (node) => node.type === "contentGenerationNode",
      );

      // Update all contentGenerationNode instances with the same template
      contentGenerationNodes.forEach((node) => {
        updateNodeData(node.id, { selectedTemplate: templateInfo });
      });
    },
    [nodeId, updateNodeData, getNodes],
  );

  return {
    selectedTemplate,
    setSelectedTemplate,
  };
}
