import { v } from "convex/values";
import { action, internalMutation, internalQuery } from "./_generated/server";
import { vOnCompleteArgs, vOnCompleteValidator } from "@convex-dev/workpool";

// Internal query to get campaign for sending
export const getCampaignForSending = internalQuery({
  args: {
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.campaignId);
  },
});

// Internal mutation to update campaign with email IDs
export const updateCampaignEmailIds = internalMutation({
  args: {
    campaignId: v.id("campaigns"),
    variant: v.union(v.literal("A"), v.literal("B")),
    emailIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const currentEmailIds = campaign.resendEmailIds || { A: [], B: [] };
    currentEmailIds[args.variant] = args.emailIds;

    await ctx.db.patch(args.campaignId, {
      resendEmailIds: currentEmailIds,
    });

    return null;
  },
});

// Internal mutation to mark campaign as sent
export const markCampaignAsSent = internalMutation({
  args: {
    campaignId: v.id("campaigns"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await ctx.db.patch(args.campaignId, {
      status: "sent",
    });
    return null;
  },
});

// Bulk import recipients
export const importRecipients = action({
  args: {
    csvData: v.string(),
  },
  returns: v.object({
    success: v.boolean(),
    recipients: v.array(v.string()),
    errors: v.array(v.string()),
  }),
  handler: async (ctx, args) => {
    const recipients: string[] = [];
    const errors: string[] = [];

    // Simple CSV parsing for email addresses
    const lines = args.csvData.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Extract email from CSV line (assuming email is in first column or the only content)
      const email = line.split(",")[0].trim().replace(/"/g, "");

      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email)) {
        recipients.push(email);
      } else {
        errors.push(`Line ${i + 1}: Invalid email format - ${email}`);
      }
    }

    return {
      success: recipients.length > 0,
      recipients,
      errors,
    };
  },
});

export const emailOnComplete = internalMutation({
  args: vOnCompleteArgs(v.object({ emailId: v.id("emails") })),
  handler: async (ctx, { context, result }) => {
    if (result.kind === "canceled" || result.kind === "failed") return;

    await ctx.db.patch(context.emailId, {
      status: "draft",
    });
  },
});
