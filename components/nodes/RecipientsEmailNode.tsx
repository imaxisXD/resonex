"use client";
import { Handle, Position } from "@xyflow/react";
import { Plus, Users, AtSign } from "lucide-react";

import { memo, useState, useCallback, useEffect } from "react";
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

interface EmailData {
  email: string;
  name?: string;
}

interface RecipientsEmailNodeProps {
  data: { label: string; emails?: EmailData[] } & Record<string, unknown>;
  onEmailDataChange?: (emails: EmailData[]) => void;
}

export const RecipientsEmailNode = memo(function RecipientsEmailNode({
  data,
  onEmailDataChange,
}: RecipientsEmailNodeProps) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState<EmailData[]>(data.emails || []);
  const [singleEmail, setSingleEmail] = useState("");
  const [singleName, setSingleName] = useState("");

  useEffect(() => {
    if (data.emails) {
      setEmails(data.emails);
    }
  }, [data.emails]);

  const addSingleEmail = useCallback(() => {
    if (singleEmail.trim() && singleEmail.includes("@")) {
      const newEmail: EmailData = {
        email: singleEmail.trim(),
        name: singleName.trim() || undefined,
      };

      if (!emails.some((e) => e.email === newEmail.email)) {
        const updatedEmails = [...emails, newEmail];
        setEmails(updatedEmails);
        onEmailDataChange?.(updatedEmails);
        setSingleEmail("");
        setSingleName("");
      }
    }
  }, [singleEmail, singleName, emails, onEmailDataChange]);

  const nodeStatus = emails.length >= 2 ? "ready" : "pending";

  const clearAllEmails = useCallback(() => {
    setEmails([]);
    onEmailDataChange?.([]);
  }, [onEmailDataChange]);

  const EmailList = memo(function EmailList() {
    if (emails.length === 0) return null;

    return (
      <div className="mt-3 rounded-lg border bg-gray-50 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Users className="size-4" />
            {emails.length} recipient{emails.length !== 1 ? "s" : ""} added
          </div>
          <button
            onClick={clearAllEmails}
            className="text-xs text-gray-500 transition-colors hover:text-red-500"
          >
            Clear all
          </button>
        </div>
      </div>
    );
  });

  return (
    <div className="relative">
      <div className="w-[280px] rounded-lg border bg-white/90 p-4 shadow-md backdrop-blur-sm">
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
            Add email recipients for your campaign.
            <br />
            (Min 2 emails)
          </p>

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
            Add Emails
          </DialogTrigger>
          <DialogContent className="left-[47%] w-full !max-w-[30rem] bg-white">
            <DialogHeader>
              <DialogTitle>Add Recipient</DialogTitle>
              <DialogDescription>
                Add an email address to your recipient list.
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
      </div>
    </div>
  );
});
