import { Handle, Position } from "@xyflow/react";
import { FileText } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { useState } from "react";

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

  const getStatusColor = () => {
    switch (data.status) {
      case "completed":
        return "border-green-500 bg-green-50/80";
      case "pending":
        return "border-yellow-500 bg-yellow-50/80";
      case "disabled":
        return "border-gray-300 bg-gray-50/80";
      default:
        return "border-blue-500 bg-blue-50/80";
    }
  };

  return (
    <div className="relative">
      {gradientEnabled && (
        <>
          <div
            className="absolute -inset-4 rounded-xl opacity-20 blur-lg"
            style={{
              background:
                "linear-gradient(90deg, #10b981, #06b6d4, #8b5cf6, #10b981)",
              backgroundSize: "300% 100%",
              animation: "gradient-slide 6s linear infinite",
              transform: "translate(6px, 6px)",
              zIndex: -1,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @keyframes gradient-slide {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
            `,
            }}
          />
        </>
      )}

      <div
        className={`relative w-[280px] rounded-lg border p-4 shadow-md ${getStatusColor()} backdrop-blur-sm`}
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

        <div className="space-y-2 text-xs">
          {data.data.subjectLines ? (
            <div>
              <div className="mb-1 font-medium">Subject Lines:</div>
              <div className="space-y-1">
                <div>A: {data.data.subjectLines.A}</div>
                <div>B: {data.data.subjectLines.B}</div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">Content not generated yet</div>
          )}
          {data.data.body && (
            <div>
              <span className="font-medium">Body:</span>
              <p className="mt-1 line-clamp-4 text-gray-600">
                {data.data.body}
              </p>
            </div>
          )}
        </div>

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
