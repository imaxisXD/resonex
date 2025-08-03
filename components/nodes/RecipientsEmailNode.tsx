"use client";
import { Handle, Position } from "@xyflow/react";
import { Upload, Plus, Users, LoaderIcon, X, AtSign } from "lucide-react";
import { CampaignNodeData } from "@/lib/connection-rules";
import { memo, useState, useCallback, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

interface RecipientsEmailNodeProps {
  data: CampaignNodeData;
}

interface EmailData {
  email: string;
  name?: string;
}

export const RecipientsEmailNode = memo(
  function RecipientsEmailNode({}: RecipientsEmailNodeProps) {
    const [open, setOpen] = useState(false);
    const [emails, setEmails] = useState<EmailData[]>([]);
    const [singleEmail, setSingleEmail] = useState("");
    const [singleName, setSingleName] = useState("");
    const [isDragOver, setIsDragOver] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parseCSV = useCallback((text: string): EmailData[] => {
      const lines = text.split("\n");
      const headers =
        lines[0]
          ?.toLowerCase()
          .split(",")
          .map((h) => h.trim()) || [];
      const emailIndex = headers.findIndex((h) => h.includes("email"));
      const nameIndex = headers.findIndex((h) => h.includes("name"));

      if (emailIndex === -1) return [];

      const parsed: EmailData[] = [];
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line
          .split(",")
          .map((col) => col.trim().replace(/"/g, ""));
        const email = columns[emailIndex];
        const name = nameIndex !== -1 ? columns[nameIndex] : undefined;

        if (email && email.includes("@")) {
          parsed.push({ email, name });
        }
      }
      return parsed;
    }, []);

    const handleFileUpload = useCallback(
      async (file: File) => {
        if (!file.name.endsWith(".csv")) {
          alert("Please upload a CSV file");
          return;
        }

        setIsUploading(true);

        try {
          const text = await file.text();
          const parsedEmails = parseCSV(text);

          await new Promise((resolve) => setTimeout(resolve, 1000));

          setEmails((prev) => {
            const existingEmails = new Set(prev.map((e) => e.email));
            const newEmails = parsedEmails.filter(
              (e) => !existingEmails.has(e.email),
            );
            return [...prev, ...newEmails];
          });
        } catch (error) {
          console.error("Error parsing CSV:", error);
          alert("Error parsing CSV file");
        } finally {
          setIsUploading(false);
        }
      },
      [parseCSV],
    );

    const handleDrop = useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);

        const files = Array.from(e.dataTransfer.files);
        const csvFile = files.find((file) => file.name.endsWith(".csv"));

        if (csvFile) {
          handleFileUpload(csvFile);
        }
      },
      [handleFileUpload],
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    }, []);

    const handleFileSelect = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          handleFileUpload(file);
        }
      },
      [handleFileUpload],
    );

    const addSingleEmail = useCallback(() => {
      if (singleEmail.trim() && singleEmail.includes("@")) {
        const newEmail: EmailData = {
          email: singleEmail.trim(),
          name: singleName.trim() || undefined,
        };

        if (!emails.some((e) => e.email === newEmail.email)) {
          setEmails((prev) => [...prev, newEmail]);
          setSingleEmail("");
          setSingleName("");
        }
      }
    }, [singleEmail, singleName, emails]);

    const removeEmail = useCallback((emailToRemove: string) => {
      setEmails((prev) => prev.filter((e) => e.email !== emailToRemove));
    }, []);

    const triggerFileSelect = useCallback(() => {
      fileInputRef.current?.click();
    }, []);

    const nodeStatus = emails.length > 0 ? "ready" : "pending";

    const DropZone = memo(function DropZone() {
      return (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerFileSelect}
          className={cn(
            "relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed transition-all duration-200",
            isDragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gradient-to-b from-white via-gray-50",
            isUploading && "pointer-events-none",
          )}
        >
          {isUploading && (
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

          <div className="relative z-30 flex flex-col items-center gap-2 text-gray-500">
            {isUploading ? (
              <LoaderIcon className="size-7 animate-spin text-blue-500" />
            ) : (
              <Upload className="size-7" strokeWidth={1.5} />
            )}
            <div className="text-center text-xs">
              {isUploading ? (
                <span className="font-medium text-blue-600">
                  Uploading CSV...
                </span>
              ) : (
                <>
                  <div className="font-medium">Drop CSV file here</div>
                  <div className="text-gray-400">or click to browse</div>
                </>
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      );
    });

    const EmailList = memo(function EmailList() {
      if (emails.length === 0) return null;

      return (
        <div className="mt-3 max-h-32 overflow-y-auto rounded-lg border bg-gray-50 p-2">
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-600">
            <Users className="size-3" />
            {emails.length} recipient{emails.length !== 1 ? "s" : ""}
          </div>
          <div className="space-y-1">
            {emails.slice(0, 5).map((emailData, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-white px-2 py-1"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-medium">
                    {emailData.name || emailData.email}
                  </div>
                  {emailData.name && (
                    <div className="truncate text-xs text-gray-500">
                      {emailData.email}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => removeEmail(emailData.email)}
                  className="ml-2 flex-shrink-0 text-gray-400 hover:text-red-500"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {emails.length > 5 && (
              <div className="text-center text-xs text-gray-500">
                +{emails.length - 5} more...
              </div>
            )}
          </div>
        </div>
      );
    });

    return (
      <div className="relative">
        {isUploading && (
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

        <div className="relative z-30 w-[280px] rounded-lg border bg-white/90 p-4 shadow-md backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-green-500 bg-gradient-to-t from-green-50 to-white">
              <AtSign className="size-5 text-green-500" strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">Add Emails</h3>
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
            <p className="text-muted-foreground">
              Upload a CSV file with email addresses or add recipients manually.
            </p>

            <DropZone />
            <EmailList />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-9 w-full rounded-sm",
              )}
            >
              <Plus className="size-4" />
              Add Single Email
            </DialogTrigger>
            <DialogContent className="left-[47%] w-full !max-w-[30rem] bg-white">
              <DialogHeader>
                <DialogTitle>Add Single Recipient</DialogTitle>
                <DialogDescription>
                  Add a single email address to your recipient list.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium">Name (Optional)</label>
                  <Input
                    placeholder="John Doe"
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email Address *</label>
                  <Input
                    type="email"
                    placeholder="john@example.com"
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setOpen(false)}
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "flex-1",
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      addSingleEmail();
                      setOpen(false);
                    }}
                    disabled={!singleEmail.trim() || !singleEmail.includes("@")}
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "flex-1",
                    )}
                  >
                    Add Email
                  </button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Handle
            type="target"
            position={Position.Top}
            style={{
              background: "var(--color-green-500)",
              height: "10px",
              width: "10px",
              border: "1px solid var(--color-green-700)",
            }}
          />
          <Handle
            type="source"
            position={Position.Bottom}
            style={{
              background: "var(--color-green-500)",
              height: "10px",
              width: "10px",
              border: "1px solid var(--color-green-700)",
            }}
          />
        </div>
      </div>
    );
  },
);
