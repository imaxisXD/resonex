import { Handle, Position, useNodeConnections } from "@xyflow/react";
import {
  BotMessageSquareIcon,
  FileText,
  LoaderIcon,
  Pencil,
  RefreshCcw,
} from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, memo, useCallback, useMemo } from "react";
import ContentGenerationDrawer from "@/components/ContentGenerationDrawer";
import { EmailTemplate } from "@/components/types/email-template";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import { useSynchronizedTemplateState } from "@/hooks/useTemplateState";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AIGeneratedNode from "./AIGeneratedNode";

interface SelectedTemplateInfo {
  template: EmailTemplate;
  templateIndex: number;
  emailHTML: string;
}

interface ContentGenerationNodeData {
  label: string;
  data: Doc<"campaigns">;
}

interface ContentGenerationNodeProps {
  id: string;
  data: ContentGenerationNodeData;
}

const ContentGenerationNode = memo(function ContentGenerationNode({
  id,
  data,
}: ContentGenerationNodeProps) {
  const { selectedTemplate, setSelectedTemplate } =
    useSynchronizedTemplateState(id);
  const emailFromDb = useQuery(
    api.abEmails.getEmailFromNodeId,
    id && data?.data?._id ? { nodeId: id, campaignId: data.data._id } : "skip",
  );
  const generateEmail = useMutation(api.workpools.emailMutation);
  const nodeEdge = useNodeConnections({ handleType: "target" });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const nodeLabel = useMemo(() => data.label, [data.label]);
  const nodeStatus = useMemo(
    () =>
      selectedTemplate &&
      nodeEdge.length > 0 &&
      nodeEdge[0].source === "abTestNode"
        ? "ready"
        : "pending",
    [selectedTemplate, nodeEdge],
  );

  const handleTemplateSelect = useCallback(
    (templateInfo: SelectedTemplateInfo) => {
      setSelectedTemplate(templateInfo);
    },
    [id, setSelectedTemplate],
  );

  const startGenerating = useCallback(() => {
    if (
      !selectedTemplate ||
      nodeEdge.length <= 0 ||
      nodeEdge[0].source !== "abTestNode"
    ) {
      return;
    }
    generateEmail({
      templateId: selectedTemplate?.template.id,
      campaignId: data.data._id,
      nodeId: id,
    });
  }, [id, data.data._id, generateEmail, selectedTemplate]);

  const openDrawer = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
  }, []);

  const TemplatePlaceholder = memo(function TemplatePlaceholder() {
    return (
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-md border-2 border-dashed border-gray-300 bg-gradient-to-b from-white via-gray-100">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <FileText className="size-7" strokeWidth={1.5} />
            <div className="text-xs">No template selected</div>
          </div>
          <div className="absolute right-0 bottom-0 left-0 bg-gray-200/80 px-2 py-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-gray-500">
                Choose Template (Click below)
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  });
  const TemplateThumbnail = memo(function TemplateThumbnail({
    templateInfo,
    generating,
    openDrawer,
  }: {
    templateInfo: SelectedTemplateInfo;
    generating: boolean;
    openDrawer: () => void;
  }) {
    return (
      <div className="flex flex-col items-center space-y-3 text-center">
        <div className="relative">
          {generating && (
            <>
              <div className="holographic-bg pointer-events-none absolute inset-0 z-10 rounded-lg opacity-40" />
              <div className="shine-bg pointer-events-none absolute inset-0 z-20 rounded-lg" />
              <div className="pointer-events-none absolute inset-0 z-20">
                <div className="sparkle-1 absolute h-0.5 w-0.5 rounded-full bg-white" />
                <div className="sparkle-2 absolute h-0.5 w-0.5 rounded-full bg-white" />
                <div className="sparkle-3 absolute h-0.5 w-0.5 rounded-full bg-white" />
                <div className="sparkle-4 absolute h-0.5 w-0.5 rounded-full bg-white" />
              </div>
              <div className="border-glow-bg pointer-events-none absolute -inset-0.5 z-0 rounded-lg" />
            </>
          )}

          <div className="relative z-30 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-100">
            <div
              className="h-full w-full origin-center scale-50 transform bg-white"
              style={{
                fontSize: "14px",
                width: "200%",
                height: "200%",
                transform: "scale(0.9)",
              }}
              dangerouslySetInnerHTML={{
                __html: templateInfo.emailHTML,
              }}
            />

            <div
              className={cn(
                "absolute right-0 bottom-0 left-0 bg-purple-500/90 px-2 py-1 text-white",
                generating && "holographic-solid-bg",
              )}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {generating ? "Magic is happening..." : "Selected Template"}
                  </span>
                </div>
                {!generating && (
                  <span className="text-xs text-blue-100">
                    (Hover to change)
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={generating ? undefined : openDrawer}
              disabled={generating}
              className={cn(
                "absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 transition-opacity duration-200",
                generating
                  ? "cursor-not-allowed opacity-0"
                  : "opacity-0 hover:opacity-100",
              )}
            >
              <span
                className={cn(
                  buttonVariants({ variant: "default" }),
                  "h-8 text-xs",
                  generating && "cursor-not-allowed opacity-50",
                )}
              >
                <Pencil className="size-4" />
                Change Template
              </span>
              <span className="text-xs text-white">
                Click to choose a different template
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="relative">
      {emailFromDb?.status === "generating" && (
        <>
          <div className="gradient-slide-bg absolute -inset-4 -z-10 translate-x-1.5 translate-y-1.5 animate-[gradient-slide_6s_linear_infinite] rounded-xl opacity-50 blur-lg" />
          <div className="holographic-bg pointer-events-none absolute inset-0 z-10 rounded-lg opacity-70" />
          <div className="shine-bg pointer-events-none absolute inset-0 z-20 rounded-lg" />
          <div className="pointer-events-none absolute inset-0 z-20">
            <div className="sparkle-1 absolute h-1 w-1 rounded-full bg-white" />
            <div className="sparkle-2 absolute h-1 w-1 rounded-full bg-white" />
            <div className="sparkle-3 absolute h-1 w-1 rounded-full bg-white" />
            <div className="sparkle-4 absolute h-1 w-1 rounded-full bg-white" />
          </div>
          <div className="border-glow-bg pointer-events-none absolute -inset-0.5 z-0 rounded-lg" />
        </>
      )}

      {emailFromDb?.status === "draft" && (
        <AIGeneratedNode emailData={emailFromDb} />
      )}

      <div className="relative z-30 w-[280px] rounded-lg border bg-white/80 p-4 shadow-md backdrop-blur-sm">
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-purple-500 bg-gradient-to-t from-purple-50 to-white">
            <FileText className="size-5 text-purple-500" strokeWidth={1.5} />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium">{nodeLabel}</h3>
            <p className="text-muted-foreground text-xs capitalize">
              <span
                className={`mr-1 inline-block h-1.5 w-1.5 rounded-full border ${
                  nodeStatus === "ready"
                    ? "border-green-600 bg-green-500"
                    : "border-yellow-600 bg-yellow-400"
                } align-middle`}
              />
              {nodeStatus}
            </p>
          </div>
        </div>

        <div className="mb-3 space-y-2 text-xs">
          {selectedTemplate ? (
            <TemplateThumbnail
              templateInfo={selectedTemplate as SelectedTemplateInfo}
              generating={emailFromDb?.status === "generating"}
              openDrawer={openDrawer}
            />
          ) : (
            <TemplatePlaceholder />
          )}
        </div>

        {selectedTemplate ? (
          <RainbowButton
            className="w-full"
            onClick={startGenerating}
            disabled={
              nodeStatus === "pending" || emailFromDb?.status === "generating"
                ? true
                : false
            }
          >
            {emailFromDb?.status === "generating" ? (
              <LoaderIcon className="size-5 animate-spin" />
            ) : emailFromDb?.status === "draft" ? (
              <RefreshCcw className="size-5" />
            ) : (
              <BotMessageSquareIcon className="size-5" />
            )}
            {emailFromDb?.status === "generating"
              ? "Resonexing..."
              : emailFromDb?.status === "draft"
                ? "Regenerate"
                : "Generate with AI"}
          </RainbowButton>
        ) : null}

        <ContentGenerationDrawer
          campaign={data.data}
          onTemplateSelect={handleTemplateSelect}
          open={isDrawerOpen}
          onOpenChange={handleDrawerOpenChange}
          showTrigger={!selectedTemplate}
          initialTemplateIndex={selectedTemplate?.templateIndex || 0}
        />

        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: "#ffcc00",
            height: "10px",
            width: "10px",
            border: "1px solid var(--color-black)",
          }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: "var(--color-blue-500)",
            height: "10px",
            width: "10px",
            border: "1px solid var(--color-blue-700)",
          }}
        />
      </div>
    </div>
  );
});

export default ContentGenerationNode;
