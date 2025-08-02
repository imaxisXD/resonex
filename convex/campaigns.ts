import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createCampaign = mutation({
  args: {
    campaignName: v.string(),
    prompt: v.string(),
    category: v.union(v.literal("newsletter"), v.literal("marketing")),
  },
  returns: v.id("campaigns"),
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const campaignId = await ctx.db.insert("campaigns", {
      userId: userId.subject,
      campaignName: args.campaignName,
      prompt: args.prompt,
      category: args.category,
      status: "draft",
    });

    return campaignId;
  },
});

export const getCampaigns = query({
  args: {},
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      return [];
    }
    return await ctx.db
      .query("campaigns")
      .withIndex("by_user", (q) => q.eq("userId", userId.subject))
      .order("desc")
      .collect();
  },
});

export const getCampaign = query({
  args: {
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      return null;
    }
    const campaignId = ctx.db.normalizeId("campaigns", args.campaignId);
    if (!campaignId) {
      return null;
    }
    const campaign = await ctx.db.get(campaignId);
    if (!campaign || campaign.userId !== userId.subject) {
      return null;
    }
    return campaign;
  },
});

// // Update campaign
// export const updateCampaign = mutation({
//   args: {
//     campaignId: v.id("campaigns"),
//     subjectLines: v.optional(
//       v.object({
//         A: v.string(),
//         B: v.string(),
//       }),
//     ),
//     body: v.optional(v.string()),
//     recipients: v.optional(v.array(v.string())),
//     sendTimeA: v.optional(v.number()),
//     sendTimeB: v.optional(v.number()),
//   },
//   returns: v.null(),
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new Error("User must be authenticated");
//     }

//     const campaign = await ctx.db.get(args.campaignId);
//     if (!campaign || campaign.userId !== userId) {
//       throw new Error("Campaign not found or access denied");
//     }

//     const updates: any = {};
//     if (args.subjectLines) updates.subjectLines = args.subjectLines;
//     if (args.body) updates.body = args.body;
//     if (args.recipients) updates.recipients = args.recipients;
//     if (args.sendTimeA) updates.sendTimeA = args.sendTimeA;
//     if (args.sendTimeB) updates.sendTimeB = args.sendTimeB;

//     await ctx.db.patch(args.campaignId, updates);
//     return null;
//   },
// });

// export const scheduleCampaign = mutation({
//   args: {
//     campaignId: v.id("campaigns"),
//     sendTimeA: v.number(),
//     sendTimeB: v.number(),
//   },
//   returns: v.null(),
//   handler: async (ctx, args) => {
//     const userId = await ctx.auth.getUserIdentity();
//     if (!userId) {
//       throw new Error("User must be authenticated");
//     }

//     const campaign = await ctx.db.get(args.campaignId);
//     if (!campaign || campaign.userId !== userId.subject) {
//       throw new Error("Campaign not found or access denied");
//     }

//     if (campaign.status !== "draft") {
//       throw new Error("Only draft campaigns can be scheduled");
//     }

//     await ctx.db.patch(args.campaignId, {
//       sendTimeA: args.sendTimeA,
//       sendTimeB: args.sendTimeB,
//       status: "scheduled",
//     });

//     // Schedule the actual email sends
//     // await ctx.scheduler.runAt(
//     //   args.sendTimeA,
//     //   internal.externalActions.sendCampaignBatch,
//     //   {
//     //     campaignId: args.campaignId,
//     //     variant: "A",
//     //   },
//     // );

//     // Schedule variant B 1 hour after variant A for A/B testing
//     // await ctx.scheduler.runAt(
//     //   args.sendTimeB,
//     //   internal.externalActions.sendCampaignBatch,
//     //   {
//     //     campaignId: args.campaignId,
//     //     variant: "B",
//     //   },
//     // );

//     return null;
//   },
// });

// // Get campaign analytics
// export const getCampaignAnalytics = query({
//   args: {
//     campaignId: v.id("campaigns"),
//   },
//   returns: v.object({
//     campaign: v.object({
//       _id: v.id("campaigns"),
//       _creationTime: v.number(),
//       userId: v.string(),
//       prompt: v.string(),
//       category: v.string(),
//       subjectLines: v.object({
//         A: v.string(),
//         B: v.string(),
//       }),
//       body: v.string(),
//       recipients: v.array(v.string()),
//       sendTimeA: v.optional(v.number()),
//       sendTimeB: v.optional(v.number()),
//       status: v.union(
//         v.literal("draft"),
//         v.literal("scheduled"),
//         v.literal("sent"),
//       ),
//       resendEmailIds: v.optional(
//         v.object({
//           A: v.array(v.string()),
//           B: v.array(v.string()),
//         }),
//       ),
//     }),
//     analytics: v.object({
//       variantA: v.object({
//         sent: v.number(),
//         delivered: v.number(),
//         opened: v.number(),
//         clicked: v.number(),
//         bounced: v.number(),
//         openRate: v.number(),
//         clickRate: v.number(),
//         bounceRate: v.number(),
//       }),
//       variantB: v.object({
//         sent: v.number(),
//         delivered: v.number(),
//         opened: v.number(),
//         clicked: v.number(),
//         bounced: v.number(),
//         openRate: v.number(),
//         clickRate: v.number(),
//         bounceRate: v.number(),
//       }),
//       winner: v.optional(v.union(v.literal("A"), v.literal("B"))),
//     }),
//   }),
//   handler: async (ctx, args) => {
//     const userId = await getAuthUserId(ctx);
//     if (!userId) {
//       throw new Error("User must be authenticated");
//     }

//     const campaign = await ctx.db.get(args.campaignId);
//     if (!campaign || campaign.userId !== userId) {
//       throw new Error("Campaign not found or access denied");
//     }

//     // Get events for this campaign
//     const events = await ctx.db
//       .query("events")
//       .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
//       .collect();

//     // Calculate analytics for both variants
//     const calculateVariantStats = (variant: "A" | "B") => {
//       const variantEvents = events.filter((e) => e.variant === variant);
//       const sent = campaign.recipients.length / 2; // Split recipients between A and B
//       const delivered = variantEvents.filter(
//         (e) => e.type === "delivered",
//       ).length;
//       const opened = variantEvents.filter((e) => e.type === "opened").length;
//       const clicked = variantEvents.filter((e) => e.type === "clicked").length;
//       const bounced = variantEvents.filter((e) => e.type === "bounced").length;

//       return {
//         sent,
//         delivered,
//         opened,
//         clicked,
//         bounced,
//         openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
//         clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0,
//         bounceRate: sent > 0 ? (bounced / sent) * 100 : 0,
//       };
//     };

//     const variantA = calculateVariantStats("A");
//     const variantB = calculateVariantStats("B");

//     // Determine winner based on open rate
//     let winner: "A" | "B" | undefined;
//     if (variantA.delivered > 0 && variantB.delivered > 0) {
//       winner = variantA.openRate > variantB.openRate ? "A" : "B";
//     }

//     return {
//       campaign,
//       analytics: {
//         variantA,
//         variantB,
//         winner,
//       },
//     };
//   },
// });

export const deleteEmailNode = mutation({
  args: {
    nodeId: v.string(),
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    const campaignId = ctx.db.normalizeId("campaigns", args.campaignId);
    if (!campaignId) {
      throw new Error("Campaign not found");
    }

    const campaign = await ctx.db.get(campaignId);
    if (!campaign || campaign.userId !== userId.subject) {
      throw new Error("Campaign not found or access denied");
    }

    const getEmail = await ctx.db
      .query("emails")
      .withIndex("by_campaign_node", (q) =>
        q.eq("campaignId", campaignId).eq("nodeId", args.nodeId),
      )
      .first();
    if (!getEmail) {
      console.log("Email not found, skipping deletion");
      return null;
    }
    await ctx.db.patch(campaignId, {
      emailIds: campaign.emailIds?.filter((id) => id !== getEmail._id) || [],
    });
    await ctx.db.delete(getEmail._id);
    return null;
  },
});
