import { Workpool } from "@convex-dev/workpool";
import { v } from "convex/values";
import { components, internal } from "./_generated/api";
import { mutation } from "./_generated/server";
import { Id } from "./_generated/dataModel";

const workpool = new Workpool(components.llmCallWorkpool, {
  maxParallelism: 20,
});

export const emailMutation = mutation({
  args: {
    templateId: v.string(),
    campaignId: v.id("campaigns"),
    nodeId: v.string(),
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
    if (campaign.userId !== user.subject) {
      throw new Error("User does not have access to this campaign");
    }
    let emailId: Id<"emails">;
    const existingEmail = await ctx.db
      .query("emails")
      .withIndex("by_campaign_node", (q) =>
        q.eq("campaignId", args.campaignId).eq("nodeId", args.nodeId),
      )
      .first();

    if (existingEmail) {
      emailId = existingEmail._id;
      await ctx.db.patch(existingEmail?._id, {
        templateId: args.templateId,
        status: "generating",
      });
    } else {
      emailId = await ctx.db.insert("emails", {
        campaignId: campaign._id,
        body: "Generating email...",
        subjectLine: "Generating email...",
        status: "generating",
        templateId: args.templateId,
        nodeId: args.nodeId,
      });
    }

    const currentEmailIds = campaign.emailIds || [];
    if (!currentEmailIds.includes(emailId)) {
      await ctx.db.patch(campaign._id, {
        emailIds: [...currentEmailIds, emailId],
      });
    }

    await workpool.enqueueAction(
      ctx,
      internal.llmCall.generateEmailLLM,
      {
        prompt: campaign.prompt,
        userId: campaign.userId,
        emailId: emailId,
      },
      {
        onComplete: internal.emails.emailOnComplete,
        context: { emailId: emailId },
      },
    );
    return emailId;
  },
});
