import { Handle, Position } from "@xyflow/react";
import { BotMessageSquareIcon, FileText, Pencil } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useState, memo, useCallback, useMemo } from "react";
import ContentGenerationDrawer from "./ContentGenerationDrawer";
import { EmailTemplate } from "./types/email-template";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import { RainbowButton } from "./magicui/rainbow-button";
import { BorderBeam } from "./magicui/border-beam";

interface SelectedTemplateInfo {
  template: EmailTemplate;
  templateIndex: number;
  emailHTML: string;
}

interface ContentGenerationNodeData {
  label: string;
  data: Doc<"campaigns">;
  status?: "completed" | "pending" | "disabled";
}

interface ContentGenerationNodeProps {
  data: ContentGenerationNodeData;
}

const ContentGenerationNode = memo(
  function ContentGenerationNode({ data }: ContentGenerationNodeProps) {
    const [generating, setGenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] =
      useState<SelectedTemplateInfo | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const statusColor = useMemo(() => {
      switch (data.status) {
        case "completed":
          return "border-green-500 bg-green-50/80";
        case "pending":
          return "bg-white/90";
        case "disabled":
          return "border-gray-300 bg-gray-50/80";
        default:
          return "border-blue-500 bg-blue-50/80";
      }
    }, [data.status]);

    const nodeLabel = useMemo(() => data.label, [data.label]);
    const nodeStatus = useMemo(() => data.status || "ready", [data.status]);

    const handleTemplateSelect = useCallback(
      (templateInfo: SelectedTemplateInfo) => {
        setSelectedTemplate(templateInfo);
      },
      [],
    );

    const toggleGenerating = useCallback(() => {
      setGenerating((prev) => !prev);
    }, []);

    const openDrawer = useCallback(() => {
      setIsDrawerOpen(true);
    }, []);

    const handleDrawerOpenChange = useCallback((open: boolean) => {
      setIsDrawerOpen(open);
    }, []);

    const TemplatePlaceholder = useCallback(() => {
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
    }, []);

    const TemplateThumbnail = useCallback(
      ({ templateInfo }: { templateInfo: SelectedTemplateInfo }) => {
        return (
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="relative flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-200 bg-gray-100">
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

              <div className="absolute right-0 bottom-0 left-0 bg-blue-600/90 px-2 py-1 text-white">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Selected Template</span>
                  </div>
                  <span className="text-xs text-blue-100">
                    (Hover to change)
                  </span>
                </div>
              </div>

              <button
                onClick={openDrawer}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 opacity-0 transition-opacity duration-200 hover:opacity-100"
              >
                <span
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "h-8 text-xs",
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
        );
      },
      [openDrawer],
    );

    return (
      <div className="relative">
        {generating && (
          <div
            className="absolute -inset-4 -z-10 translate-x-1.5 translate-y-1.5 animate-[gradient-slide_6s_linear_infinite] rounded-xl opacity-50 blur-lg"
            style={{
              background:
                "linear-gradient(90deg, #60a5fa, #e879f9, #5eead4, #60a5fa)",
              backgroundSize: "300% 100%",
            }}
          />
        )}

        <div
          className={`relative w-[280px] rounded-lg border p-4 shadow-md ${statusColor} backdrop-blur-sm`}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-yellow-500 bg-yellow-50">
              <FileText className="size-5 text-amber-500" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{nodeLabel}</h3>
              <p className="text-muted-foreground text-xs capitalize">
                {nodeStatus}
              </p>
            </div>
            <button
              onClick={toggleGenerating}
              className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
              title="Toggle gradient effect"
            >
              {generating ? "✨" : "⚫"}
            </button>
          </div>

          <div className="mb-3 space-y-2 text-xs">
            {selectedTemplate ? (
              <TemplateThumbnail templateInfo={selectedTemplate} />
            ) : (
              <TemplatePlaceholder />
            )}
          </div>

          {selectedTemplate ? (
            <RainbowButton className="w-full">
              <BotMessageSquareIcon className="size-5" />
              Generate with AI
            </RainbowButton>
          ) : (
            <ContentGenerationDrawer
              campaign={data.data}
              onTemplateSelect={handleTemplateSelect}
              open={isDrawerOpen}
              onOpenChange={handleDrawerOpenChange}
            />
          )}

          {generating && (
            <>
              <BorderBeam
                duration={10}
                size={400}
                className="from-transparent via-red-500 to-transparent"
              />
              <BorderBeam
                duration={10}
                delay={3}
                size={400}
                className="from-transparent via-blue-500 to-transparent"
              />
            </>
          )}
          <Handle
            type="target"
            position={Position.Top}
            className="h-3 w-3 border-2 border-white bg-blue-500"
            style={{ top: -6 }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            className="h-3 w-3 border-2 border-white bg-blue-500"
            style={{ bottom: -6 }}
          />
        </div>
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.data.label === nextProps.data.label &&
      prevProps.data.status === nextProps.data.status &&
      prevProps.data.data._id === nextProps.data.data._id &&
      prevProps.data.data._creationTime === nextProps.data.data._creationTime
    );
  },
);

export default ContentGenerationNode;
