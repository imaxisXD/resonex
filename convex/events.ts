import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "./_generated/dataModel";

// Internal mutation to process email events from webhooks
export const processEmailEvent = internalMutation({
  args: {
    type: v.string(),
    data: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    try {
      const eventData = JSON.parse(args.data);

      // Extract relevant information from Resend webhook data
      const { email_id: emailId, to, subject, tags, created_at } = eventData;

      if (!emailId || !to) {
        console.error("Missing required email event data");
        return null;
      }

      // Extract campaign info from tags
      let campaignId: Id<"campaigns"> | null = null;
      let variant: "A" | "B" | null = null;

      if (tags) {
        const campaignTag = tags.find((tag: any) => tag.name === "campaign_id");
        const variantTag = tags.find((tag: any) => tag.name === "variant");

        if (campaignTag) campaignId = campaignTag.value;
        if (variantTag) variant = variantTag.value;
      }

      if (!campaignId || !variant) {
        console.log("Email event without campaign tracking, skipping");
        return null;
      }

      // Map Resend event types to our event types
      const eventTypeMap: Record<
        string,
        "delivered" | "opened" | "bounced" | "clicked"
      > = {
        "email.delivered": "delivered",
        "email.opened": "opened",
        "email.bounced": "bounced",
        "email.clicked": "clicked",
      };

      const mappedType = eventTypeMap[args.type];
      if (!mappedType) {
        console.log(`Unknown event type: ${args.type}`);
        return null;
      }

      // Check if event already exists to avoid duplicates
      const existingEvent = await ctx.db
        .query("events")
        .withIndex("by_email_id", (q) => q.eq("emailId", emailId))
        .filter((q) =>
          q.and(
            q.eq(q.field("type"), mappedType),
            q.eq(q.field("recipient"), to),
          ),
        )
        .first();

      if (existingEvent) {
        console.log("Event already processed, skipping duplicate");
        return null;
      }

      // Insert the event
      await ctx.db.insert("events", {
        emailId,
        campaignId,
        recipient: to,
        variant,
        type: mappedType,
        timestamp: Date.now(),
      });

      console.log(
        `Processed ${mappedType} event for campaign ${campaignId}, variant ${variant}`,
      );
      return null;
    } catch (error) {
      console.error("Error processing email event:", error);
      return null;
    }
  },
});

// Get events for a specific campaign
export const getCampaignEvents = query({
  args: {
    campaignId: v.id("campaigns"),
    type: v.optional(
      v.union(
        v.literal("delivered"),
        v.literal("opened"),
        v.literal("bounced"),
        v.literal("clicked"),
      ),
    ),
    variant: v.optional(v.union(v.literal("A"), v.literal("B"))),
  },
  returns: v.array(
    v.object({
      _id: v.id("events"),
      _creationTime: v.number(),
      emailId: v.string(),
      campaignId: v.id("campaigns"),
      recipient: v.string(),
      variant: v.union(v.literal("A"), v.literal("B")),
      type: v.union(
        v.literal("delivered"),
        v.literal("opened"),
        v.literal("bounced"),
        v.literal("clicked"),
      ),
      timestamp: v.number(),
    }),
  ),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Verify campaign access
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign || campaign.userId !== userId) {
      throw new Error("Campaign not found or access denied");
    }

    let query = ctx.db
      .query("events")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId));

    if (args.type && args.variant) {
      // Filter by both type and variant if provided
      const events = await query.collect();
      return events.filter(
        (e) => e.type === args.type && e.variant === args.variant,
      );
    } else if (args.type) {
      // Filter by type only
      const events = await query.collect();
      return events.filter((e) => e.type === args.type);
    } else if (args.variant) {
      // Filter by variant only
      return await ctx.db
        .query("events")
        .withIndex("by_campaign_and_variant", (q) =>
          q.eq("campaignId", args.campaignId).eq("variant", args.variant!),
        )
        .collect();
    }

    return await query.collect();
  },
});

// Get overall analytics for user's campaigns
export const getUserAnalytics = query({
  args: {
    timeframe: v.optional(
      v.union(v.literal("7d"), v.literal("30d"), v.literal("90d")),
    ),
  },
  returns: v.object({
    totalCampaigns: v.number(),
    totalRecipients: v.number(),
    averageOpenRate: v.number(),
    averageClickRate: v.number(),
    averageBounceRate: v.number(),
    abTestUplift: v.number(),
    recentActivity: v.array(
      v.object({
        campaignId: v.id("campaigns"),
        campaignTitle: v.string(),
        type: v.string(),
        timestamp: v.number(),
        details: v.string(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User must be authenticated");
    }

    // Get all user campaigns
    const campaigns = await ctx.db
      .query("campaigns")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Calculate timeframe cutoff
    const timeframeDays =
      args.timeframe === "7d" ? 7 : args.timeframe === "30d" ? 30 : 90;
    const cutoffTime = Date.now() - timeframeDays * 24 * 60 * 60 * 1000;

    // Filter campaigns by timeframe
    const recentCampaigns = campaigns.filter(
      (c) => c._creationTime >= cutoffTime,
    );

    // Get all events for recent campaigns
    const allEvents = await Promise.all(
      recentCampaigns.map((campaign) =>
        ctx.db
          .query("events")
          .withIndex("by_campaign", (q) => q.eq("campaignId", campaign._id))
          .collect(),
      ),
    );

    const flatEvents = allEvents.flat();

    // Calculate metrics
    const totalCampaigns = recentCampaigns.length;
    const totalRecipients = recentCampaigns.reduce(
      (sum, c) => sum + c.recipients.length,
      0,
    );

    const deliveredEvents = flatEvents.filter((e) => e.type === "delivered");
    const openedEvents = flatEvents.filter((e) => e.type === "opened");
    const clickedEvents = flatEvents.filter((e) => e.type === "clicked");
    const bouncedEvents = flatEvents.filter((e) => e.type === "bounced");

    const averageOpenRate =
      deliveredEvents.length > 0
        ? (openedEvents.length / deliveredEvents.length) * 100
        : 0;
    const averageClickRate =
      deliveredEvents.length > 0
        ? (clickedEvents.length / deliveredEvents.length) * 100
        : 0;
    const averageBounceRate =
      totalRecipients > 0 ? (bouncedEvents.length / totalRecipients) * 100 : 0;

    // Calculate A/B test uplift
    let abTestUplift = 0;
    const sentCampaigns = recentCampaigns.filter((c) => c.status === "sent");
    if (sentCampaigns.length > 0) {
      const uplifts = sentCampaigns.map((campaign) => {
        const campaignEvents = flatEvents.filter(
          (e) => e.campaignId === campaign._id,
        );
        const aEvents = campaignEvents.filter((e) => e.variant === "A");
        const bEvents = campaignEvents.filter((e) => e.variant === "B");

        const aDelivered = aEvents.filter((e) => e.type === "delivered").length;
        const aOpened = aEvents.filter((e) => e.type === "opened").length;
        const bDelivered = bEvents.filter((e) => e.type === "delivered").length;
        const bOpened = bEvents.filter((e) => e.type === "opened").length;

        const aOpenRate = aDelivered > 0 ? (aOpened / aDelivered) * 100 : 0;
        const bOpenRate = bDelivered > 0 ? (bOpened / bDelivered) * 100 : 0;

        return Math.abs(aOpenRate - bOpenRate);
      });

      abTestUplift =
        uplifts.length > 0
          ? uplifts.reduce((a, b) => a + b, 0) / uplifts.length
          : 0;
    }

    // Generate recent activity
    const recentActivity = recentCampaigns.slice(0, 5).map((campaign) => ({
      campaignId: campaign._id,
      campaignTitle:
        campaign.prompt.slice(0, 50) +
        (campaign.prompt.length > 50 ? "..." : ""),
      type:
        campaign.status === "sent"
          ? "campaign_sent"
          : campaign.status === "scheduled"
            ? "campaign_scheduled"
            : "campaign_created",
      timestamp: campaign._creationTime,
      details: `${campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)} - ${campaign.recipients.length} recipients`,
    }));

    return {
      totalCampaigns,
      totalRecipients,
      averageOpenRate,
      averageClickRate,
      averageBounceRate,
      abTestUplift,
      recentActivity,
    };
  },
});
