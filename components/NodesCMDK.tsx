"use client";

import * as React from "react";
import {
  Calendar,
  FileText,
  Mail,
  BarChart3,
  TestTube,
  Users,
  Trash2,
  RotateCcw,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useNodes } from "@xyflow/react";

interface NodeType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  type:
    | "campaignNode"
    | "scheduleNode"
    | "analyticsNode"
    | "abTestNode"
    | "contentGenerationNode"
    | "recipientsEmailNode";
  description: string;
}

const availableNodes: NodeType[] = [
  {
    id: "campaign",
    label: "Campaign Details",
    icon: Mail,
    type: "campaignNode",
    description: "Main campaign configuration and details",
  },
  {
    id: "content",
    label: "Content Generation",
    icon: FileText,
    type: "contentGenerationNode",
    description: "Generate email content and subject lines",
  },
  {
    id: "recipients",
    label: "Recipients",
    icon: Users,
    type: "recipientsEmailNode",
    description: "Upload CSV or add email recipients manually",
  },
  {
    id: "schedule",
    label: "Scheduling",
    icon: Calendar,
    type: "scheduleNode",
    description: "Schedule campaign delivery times",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    type: "analyticsNode",
    description: "Track campaign performance metrics",
  },
  {
    id: "abtest",
    label: "A/B Test",
    icon: TestTube,
    type: "abTestNode",
    description: "Split test configuration",
  },
];

interface NodesCMDKProps {
  onAddNode?: (nodeType: NodeType, position: { x: number; y: number }) => void;
  onClearAll?: () => void;
  onResetToDefault?: () => void;
}

export function NodesCMDK({
  onAddNode,
  onClearAll,
  onResetToDefault,
}: NodesCMDKProps) {
  const [open, setOpen] = React.useState(false);
  const currentNodes = useNodes();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "K" || e.key === "k") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNodeSelect = (nodeType: NodeType) => {
    if (onAddNode) {
      const position = {
        x: Math.random() * 400,
        y: Math.random() * 300 + 100,
      };
      onAddNode(nodeType, position);
    }
    setOpen(false);
  };

  const handleClearAll = () => {
    if (onClearAll) {
      onClearAll();
    }
    setOpen(false);
  };

  const handleResetToDefault = () => {
    if (onResetToDefault) {
      onResetToDefault();
    }
    setOpen(false);
  };

  return (
    <>
      <p className="text-sm text-white">
        Press{" "}
        <kbd className="bg-muted text-muted-foreground pointer-events-none mx-2 inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
          <span className="text-black">⌘ K</span>
        </kbd>{" "}
        to add nodes
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search for nodes to add..." />
        <CommandList>
          <CommandEmpty>No nodes found.</CommandEmpty>
          <CommandGroup heading="Available Nodes">
            {availableNodes
              .filter((node) => {
                // Only prevent duplicates for specific node types
                const restrictedTypes = [
                  "analyticsNode",
                  "scheduleNode",
                  "campaignNode",
                  "abTestNode",
                ];
                if (restrictedTypes.includes(node.type)) {
                  return !currentNodes.some((n) => n.type === node.type);
                }
                // Allow multiple instances of other node types
                return true;
              })
              .map((node) => {
                const IconComponent = node.icon;
                return (
                  <CommandItem
                    key={node.id}
                    onSelect={() => handleNodeSelect(node)}
                    className="cursor-pointer"
                  >
                    <IconComponent className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span className="font-medium">{node.label}</span>
                      <span className="text-muted-foreground text-xs">
                        {node.description}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem onSelect={() => handleResetToDefault()}>
              <RotateCcw className="mr-2 h-4 w-4" />
              <span>Reset to Default</span>
            </CommandItem>
            <CommandItem onSelect={() => handleClearAll()}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Clear All Nodes</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
