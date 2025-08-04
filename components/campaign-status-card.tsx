"use client";
import { Button } from "@/components/ui/button";
import { memo, useMemo, useState } from "react";
import { CardSpotlight } from "./ui/card-spotlight";
import { type Node, type Edge } from "@xyflow/react";
import { checkWorkflowReadiness } from "@/lib/utils";
import { CheckCircleIcon, AlertCircleIcon, XCircleIcon } from "lucide-react";
import confetti from "canvas-confetti";

export default memo(function CampaignStatusCard({
  campaignStatus,
  nodes,
  edges = [],
}: {
  campaignStatus: "draft" | "scheduled" | "sent";
  nodes: Node[];
  edges: Edge[];
}) {
  const [isRunning, setIsRunning] = useState(false);
  console.log(isRunning);
  const workflowStatus = useMemo(() => {
    return checkWorkflowReadiness(nodes, edges);
  }, [nodes, edges]);

  const statusConfig = useMemo(() => {
    if (campaignStatus === "scheduled") {
      return {
        title: isRunning ? "Campaign is Running" : "Campaign is Running",
        subtitle: `Campaign ready to launch`,
        buttonText: isRunning ? "Running" : "Launch Campaign",
        buttonVariant: isRunning ? ("outline" as const) : ("default" as const),
        icon: CheckCircleIcon,
        iconColor: "text-green-600",
        bgColor: "rgba(34, 197, 94, 0.25)",
      };
    } else if (campaignStatus === "sent") {
      return {
        title: "Campaign Completed",
        subtitle: "Campaign has been sent",
        buttonText: "Campaign Sent",
        buttonVariant: "outline" as const,
        icon: CheckCircleIcon,
        iconColor: "text-green-600",
        bgColor: "rgba(34, 197, 94, 0.25)",
      };
    } else if (workflowStatus.isReady) {
      return {
        title: "Campaign is Ready",
        subtitle: `All ${workflowStatus.summary.totalNodes} nodes configured`,
        buttonText: "Run Campaign",
        buttonVariant: "default" as const,
        icon: CheckCircleIcon,
        iconColor: "text-green-600",
        bgColor: "rgba(34, 197, 94, 0.25)",
      };
    } else if (workflowStatus.summary.errorNodes > 0) {
      return {
        title: "Configuration Errors",
        subtitle: `${workflowStatus.summary.errorNodes} node(s) need attention`,
        buttonText: "Fix Issues",
        buttonVariant: "destructive" as const,
        icon: XCircleIcon,
        iconColor: "text-red-600",
        bgColor: "rgba(239, 68, 68, 0.25)",
      };
    } else {
      return {
        title: "Setup Incomplete",
        subtitle: `${workflowStatus.summary.pendingNodes} node(s) pending`,
        buttonText: "Continue Setup",
        buttonVariant: "outline" as const,
        icon: AlertCircleIcon,
        iconColor: "text-yellow-600",
        bgColor: "rgba(245, 158, 11, 0.25)",
      };
    }
  }, [workflowStatus, campaignStatus, isRunning]);

  const shouldShowCard =
    campaignStatus === "draft" ||
    campaignStatus === "scheduled" ||
    campaignStatus === "sent" ||
    workflowStatus.isReady;
  if (isRunning) {
    return null;
  }

  return (
    <CardSpotlight
      className={
        "absolute top-8 left-6 z-50 flex h-[120px] w-[250px] flex-col gap-2 rounded-lg border shadow-2xs backdrop-blur-sm " +
        (shouldShowCard ? "opacity-100" : "opacity-0")
      }
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
        linear-gradient(to right, ${statusConfig.bgColor} 1px, transparent 1px),
        linear-gradient(to bottom, ${statusConfig.bgColor} 1px, transparent 1px)
      `,
            backgroundSize: "20px 20px",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
            maskImage:
              "radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)",
          }}
        />
        <div className="relative z-10 flex w-full flex-col gap-4 p-6">
          <div className="flex flex-col items-center gap-2">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-neutral-700">
                {statusConfig.title}
              </h3>
              <p className="text-xs text-neutral-600">
                {statusConfig.subtitle}
              </p>
            </div>
          </div>

          <Button
            className="h-7 w-full rounded-sm text-xs"
            variant={"outline"}
            size="sm"
            onClick={() => {
              if (campaignStatus === "draft") {
                confetti({
                  particleCount: 100,
                  spread: 100,
                  origin: { y: 0.6 },
                });
                setIsRunning(true);
              }
            }}
            // disabled={campaignStatus === "sent" || isRunning}
          >
            {statusConfig.buttonText}
          </Button>
        </div>
      </div>
    </CardSpotlight>
  );
});
