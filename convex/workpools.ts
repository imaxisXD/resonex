import { Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { mutation } from "./_generated/server";

const workpool = new Workpool(components.llmCallWorkpool, {
  maxParallelism: 20,
});

export const emailMutation = mutation({
  args: {
    campaignId: v.id("campaigns"),
    body: v.string(),
    subjectLine: v.string(),
    sendTime: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error("User not found");
    }
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new Error("Campaign not found");
    }

    const email = await ctx.db.insert("emails", {
      campaignId: campaign._id,
      body: "Generating email...",
      subjectLine: "Generating email...",
      status: "generating",
    });

    await workpool.enqueueAction(
      ctx,
      internal.llmCall.generateEmailLLM,
      {
        prompt: `Generate an email for the campaign ${campaign.campaignName}`,
      },
      {
        onComplete: internal.emails.emailOnComplete,
        context: { emailId: email },
      },
    );

    return email;
  },
});
