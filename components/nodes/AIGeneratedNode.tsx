import { memo, useEffect, useState } from "react";
import { NodeAppendix } from "../NodeAppendix";
import { Position } from "@xyflow/react";
import { BotIcon, Eye } from "lucide-react";
import { FunctionReturnType } from "convex/server";
import { api } from "@/convex/_generated/api";
import { Button } from "../ui/button";
import { generateEmailHTMLFromData } from "../utils/email-templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import EmailPreview from "../EmailPreview";

const AIGeneratedNode = memo(function AIGeneratedNode({
  emailData,
}: {
  emailData: FunctionReturnType<typeof api.emails.getEmailFromNodeId>;
}) {
  const [emailHtml, setEmailHtml] = useState("");

  useEffect(() => {
    if (!emailData) return;
    const fetchEmailHtml = async () => {
      const html = await generateEmailHTMLFromData(emailData);
      setEmailHtml(html);
    };
    fetchEmailHtml();
  }, [emailData]);

  return (
    <NodeAppendix
      position={Position.Bottom}
      className="w-[280px] rounded-lg border border-cyan-300 bg-white/80 p-4 shadow-md backdrop-blur-sm"
    >
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-cyan-500 bg-gradient-to-t from-cyan-100 to-cyan-50">
          <BotIcon className="size-5 text-cyan-500" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-medium">AI Generated Email</h3>
        </div>
      </div>

      <div className="mb-3 space-y-2 text-xs">
        <div className="relative z-30 flex h-32 w-full items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-gray-300/60 bg-gray-100">
          <iframe
            className="h-full w-full origin-center scale-[40%] transform bg-white"
            srcDoc={emailHtml}
            sandbox="allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
            loading="lazy"
            style={{
              border: "none",
              width: "200%",
              height: "200%",
              overflow: "hidden",
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none", // IE/Edge

              background: "white",
            }}
            title="AI Generated Email Preview"
            tabIndex={-1}
          />

          <div className="absolute right-0 bottom-0 left-0 bg-cyan-500/90 px-2 py-1 text-white">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                <span className="font-medium">
                  Click to below to view the email
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="h-9 w-full rounded-sm">
            <Eye className="size-5" />
            View Email
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[65vh] max-w-full bg-white">
          <DialogHeader>
            <DialogTitle>Preview Email</DialogTitle>
            <DialogDescription>
              Subject: {emailData?.subjectLine}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-hidden rounded border-2 border-dashed border-gray-300 bg-white">
            <EmailPreview
              html={emailHtml}
              templateName={emailData?.subjectLine || "Email"}
              className="h-[55vh] w-full"
            />
          </div>
        </DialogContent>
      </Dialog>
    </NodeAppendix>
  );
});

export default AIGeneratedNode;
