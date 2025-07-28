import { Handle, Position } from "@xyflow/react";
import { FileText, Pencil } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";
import ContentGenerationDrawer from "./ContentGenerationDrawer";
import { EmailTemplate } from "./types/email-template";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";

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

export default function ContentGenerationNode({
  data,
}: ContentGenerationNodeProps) {
  const [gradientEnabled, setGradientEnabled] = useState(true);
  const [selectedTemplate, setSelectedTemplate] =
    useState<SelectedTemplateInfo | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const getStatusColor = () => {
    switch (data.status) {
      case "completed":
        return "border-green-500 bg-green-50/80";
      case "pending":
        return "border-yellow-500 bg-yellow-50";
      case "disabled":
        return "border-gray-300 bg-gray-50/80";
      default:
        return "border-blue-500 bg-blue-50/80";
    }
  };

  const handleTemplateSelect = (templateInfo: SelectedTemplateInfo) => {
    setSelectedTemplate(templateInfo);
  };

  const TemplateThumbnail = ({
    templateInfo,
  }: {
    templateInfo: SelectedTemplateInfo;
  }) => {
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

          {/* Bottom preview strip */}
          <div className="absolute right-0 bottom-0 left-0 bg-blue-600/90 px-2 py-1 text-white">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">Selected Template</span>
              </div>
              <span className="text-xs text-blue-100">(Hover to change)</span>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
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
  };

  return (
    <div className="relative">
      {gradientEnabled && (
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
        className={`relative w-[280px] rounded-lg border p-4 shadow-md ${getStatusColor()}`}
      >
        <div className="mb-3 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <FileText className="size-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold">{data.label}</h3>
            <p className="text-xs text-gray-600 capitalize">
              {data.status || "ready"}
            </p>
          </div>
          <button
            onClick={() => setGradientEnabled(!gradientEnabled)}
            className="rounded bg-gray-100 px-2 py-1 text-xs hover:bg-gray-200"
            title="Toggle gradient effect"
          >
            {gradientEnabled ? "✨" : "⚫"}
          </button>
        </div>

        <div className="mb-3 space-y-2 text-xs">
          {selectedTemplate ? (
            <TemplateThumbnail templateInfo={selectedTemplate} />
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="text-gray-500">
                Choose a template to generate email content.
              </div>
              {data.status === "pending" && (
                <ContentGenerationDrawer
                  campaign={data.data}
                  onTemplateSelect={handleTemplateSelect}
                  open={isDrawerOpen}
                  onOpenChange={setIsDrawerOpen}
                />
              )}
            </div>
          )}
        </div>

        {selectedTemplate && (
          <ContentGenerationDrawer
            campaign={data.data}
            onTemplateSelect={handleTemplateSelect}
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
          />
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
}
