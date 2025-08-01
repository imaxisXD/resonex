"use client";
import React, { memo, useState } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { MailPlus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";

export interface BaseNodeData extends Record<string, unknown> {
  label?: string;
  content?: string;
  campaignName?: string;
  emailType?: "newsletter" | "marketing";
  onContentChange?: (content: string) => void;
  onCampaignNameChange?: (name: string) => void;
  onEmailTypeChange?: (type: "newsletter" | "marketing") => void;
}

interface ValidationError {
  type: string;
  message: string;
}

const AddNewCampaignNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as BaseNodeData;
  const [content, setContent] = useState(nodeData.content || "");
  const [campaignName, setCampaignName] = useState(nodeData.campaignName || "");
  const [emailType, setEmailType] = useState<"newsletter" | "marketing">(
    nodeData.emailType || "newsletter",
  );
  const addNewCampaign = useMutation(api.campaigns.createCampaign);

  const router = useRouter();

  const validateCampaignName = (name: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    if (!name.trim()) {
      errors.push({ type: "required", message: "Campaign name is a must" });
      return errors;
    }

    if (name.trim().length < 3) {
      errors.push({
        type: "minLength",
        message: "Must be at least 3 characters",
      });
    }

    if (name.length > 50) {
      errors.push({
        type: "maxLength",
        message: "Must be 50 characters or less",
      });
    }

    if (name.trim() !== name) {
      errors.push({
        type: "whitespace",
        message: "Cannot start or end with spaces",
      });
    }

    if (/^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(name)) {
      errors.push({
        type: "specialCharacter",
        message: "Cannot start with special character or number",
      });
    }

    return errors;
  };

  const campaignNameErrors = validateCampaignName(campaignName);
  const isCampaignNameValid = campaignNameErrors.length === 0;

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    nodeData.onContentChange?.(newContent);
  };

  const handleCampaignNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setCampaignName(newName);
    nodeData.onCampaignNameChange?.(newName);
  };

  const handleEmailTypeChange = (value: string) => {
    const newType = value as "newsletter" | "marketing";
    setEmailType(newType);
    nodeData.onEmailTypeChange?.(newType);
  };

  const isReady = content.trim() && isCampaignNameValid;

  const handleAddCampaign = async () => {
    if (!isReady) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.promise(
      async () => {
        const campaignId = await addNewCampaign({
          campaignName,
          prompt: content,
          category: emailType,
        });
        return campaignId;
      },
      {
        loading: "Adding campaign...",
        success: (data) => {
          router.push(`/dashboard/campaign/${data.toString()}`);
          return "Campaign created successfully";
        },
        error: "Failed to add campaign",
      },
    );
  };

  return (
    <div
      className={`w-[300px] rounded-lg border bg-white/70 shadow-md backdrop-blur-sm ${selected ? "shadow-lg shadow-blue-200" : "shadow-gray-300"} hover: transition-all duration-200 ease-in-out`}
    >
      {/* Header */}
      <div className="rounded-t-lg p-2 text-gray-800">
        <div className="flex items-center gap-2 space-x-2">
          <div className="bg-highlight flex size-8 items-center justify-center rounded-full text-gray-600">
            <MailPlus className="text-highlight-txt size-4" />
          </div>
          <div className="flex flex-col items-start">
            <h3 className="truncate text-sm font-medium text-gray-800">
              {nodeData.label || "Email Campaign"}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 p-3">
        {/* Campaign Name Input */}
        <div>
          <Label
            htmlFor="campaign-name"
            className="mb-1.5 block text-xs font-medium text-gray-800"
          >
            Campaign name:
          </Label>
          <Input
            id="campaign-name"
            value={campaignName}
            onChange={handleCampaignNameChange}
            placeholder="(e.g. 'Q4 Product Launch')"
            className={`h-7 w-full rounded-sm py-0 text-xs text-gray-600 hover:border-blue-200 hover:bg-blue-100 ${!isCampaignNameValid && campaignName ? "border-red-300 bg-red-50" : ""}`}
          />
          {campaignNameErrors.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {campaignNameErrors.map((error, index) => (
                <p key={index} className="text-xs text-red-600">
                  • {error.message}
                </p>
              ))}
            </div>
          )}
        </div>

        <div>
          <Label
            htmlFor="email-campaign-type"
            className="mb-1.5 block text-xs font-medium text-gray-800"
          >
            Email campaign:
          </Label>
          <Select value={emailType} onValueChange={handleEmailTypeChange}>
            <SelectTrigger
              id="email-campaign-type"
              size="sm"
              className="h-7 w-full rounded-sm py-0 text-xs text-gray-600 hover:border-blue-200 hover:bg-blue-100"
            >
              <SelectValue placeholder="Select Email Campaign Type" />
            </SelectTrigger>
            <SelectContent align="center" className="text-xs">
              <SelectItem value="newsletter">Newsletter</SelectItem>
              <SelectItem value="marketing">Marketing Campaign</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Input */}
        <div>
          <label
            htmlFor="email-topic"
            className="mb-1.5 block text-xs font-medium text-gray-800"
          >
            Topic
          </label>
          <Textarea
            id="email-topic"
            value={content}
            onChange={handleContentChange}
            placeholder="Enter the topic of your email (e.g. 'Product Launch Announcement')"
            className="w-full resize-none rounded-sm border border-gray-300 px-2 py-1.5 text-xs text-gray-600"
            rows={3}
          />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div
              className={`h-2 w-2 rounded-full ${
                isReady ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <span className="text-xs text-gray-600">
              {isReady
                ? "Ready"
                : !isCampaignNameValid
                  ? "Fix campaign name"
                  : !content.trim()
                    ? "Needs content"
                    : "Incomplete"}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          className="w-full rounded-sm"
          disabled={!isReady}
          onClick={handleAddCampaign}
        >
          Add content
        </Button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="h-3 w-3 border-2 border-white bg-purple-500"
        style={{ right: -6 }}
      />
    </div>
  );
};

export default memo(AddNewCampaignNode);
