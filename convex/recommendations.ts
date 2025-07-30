import { v } from "convex/values";
import {
  internalAction,
  internalMutation,
  internalQuery,
} from "./_generated/server";
import { internal } from "./_generated/api";

// Generate time-based recommendations for a user
// export const generateRecommendations = internalAction({
//   args: {
//     userId: v.string(),
//     category: v.string(),
//   },
//   returns: v.null(),
//   handler: async (ctx, args) => {
//     // Get all sent campaigns for this user and category
//     const campaigns = await ctx.runQuery(
//       internal.recommendations.getUserCampaigns,
//       {
//         userId: args.userId,
//         category: args.category,
//       },
//     );

//     if (campaigns.length === 0) {
//       console.log(
//         `No campaigns found for user ${args.userId} in category ${args.category}`,
//       );
//       return null;
//     }

//     // Initialize time slot scores (7 days x 24 hours = 168 slots)
//     const timeScores: Array<{
//       dayOfWeek: string;
//       hour: number;
//       score: number;
//     }> = [];
//     const dayNames = [
//       "Sunday",
//       "Monday",
//       "Tuesday",
//       "Wednesday",
//       "Thursday",
//       "Friday",
//       "Saturday",
//     ];

//     for (let day = 0; day < 7; day++) {
//       for (let hour = 0; hour < 24; hour++) {
//         timeScores.push({
//           dayOfWeek: dayNames[day],
//           hour,
//           score: 0,
//         });
//       }
//     }

//     // Calculate scores based on campaign performance
//     for (const campaign of campaigns) {
//       if (!campaign.sendTimeA || !campaign.sendTimeB) continue;

//       // Get analytics for this campaign
//       const analytics = await ctx.runQuery(
//         internal.recommendations.getCampaignPerformance,
//         {
//           campaignId: campaign._id,
//         },
//       );

//       // Process both variants
//       const variants = [
//         { time: campaign.sendTimeA, performance: analytics.variantA },
//         { time: campaign.sendTimeB, performance: analytics.variantB },
//       ];

//       for (const variant of variants) {
//         const sendDate = new Date(variant.time);
//         const dayOfWeek = sendDate.getDay();
//         const hour = sendDate.getHours();

//         // Find the matching time slot
//         const timeSlot = timeScores.find(
//           (ts) => ts.dayOfWeek === dayNames[dayOfWeek] && ts.hour === hour,
//         );

//         if (timeSlot) {
//           // Weight the score based on open rate and click rate
//           const performanceScore =
//             variant.performance.openRate * 0.7 +
//             variant.performance.clickRate * 0.3;
//           timeSlot.score += performanceScore;
//         }
//       }
//     }

//     // Normalize scores (average across all campaigns that used each time slot)
//     const campaignCount = campaigns.length * 2; // Each campaign has 2 variants
//     timeScores.forEach((slot) => {
//       slot.score = slot.score / campaignCount;
//     });

//     // Sort by score and keep top performing slots
//     timeScores.sort((a, b) => b.score - a.score);

//     // Store recommendations
//     await ctx.runMutation(internal.recommendations.storeRecommendations, {
//       userId: args.userId,
//       category: args.category,
//       timeScores: timeScores.slice(0, 50), // Keep top 50 time slots
//     });

//     return null;
//   },
// });

// Internal query to get user campaigns for analysis
// export const getUserCampaigns = internalQuery({
//   args: {
//     userId: v.string(),
//     category: v.string(),
//   },
//   returns: v.array(
//     v.object({
//       _id: v.id("campaigns"),
//       sendTimeA: v.optional(v.number()),
//       sendTimeB: v.optional(v.number()),
//       status: v.union(
//         v.literal("draft"),
//         v.literal("scheduled"),
//         v.literal("sent"),
//       ),
//     }),
//   ),
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("campaigns")
//       .withIndex("by_user", (q) => q.eq("userId", args.userId))
//       .filter((q) =>
//         q.and(
//           q.eq(q.field("category"), args.category),
//           q.eq(q.field("status"), "sent"),
//         ),
//       )
//       .collect()
//       .then((campaigns) =>
//         campaigns.map((c) => ({
//           _id: c._id,
//           sendTimeA: c.sendTimeA,
//           sendTimeB: c.sendTimeB,
//           status: c.status,
//         })),
//       );
//   },
// });

// Internal query to get campaign performance
export const getCampaignPerformance = internalQuery({
  args: {
    campaignId: v.id("campaigns"),
  },
  returns: v.object({
    variantA: v.object({
      openRate: v.number(),
      clickRate: v.number(),
    }),
    variantB: v.object({
      openRate: v.number(),
      clickRate: v.number(),
    }),
  }),
  handler: async (ctx, args) => {
    // Get events for this campaign
    const events = await ctx.db
      .query("events")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .collect();

    const calculateVariantPerformance = (variant: "A" | "B") => {
      const variantEvents = events.filter((e) => e.variant === variant);
      const delivered = variantEvents.filter(
        (e) => e.type === "delivered",
      ).length;
      const opened = variantEvents.filter((e) => e.type === "opened").length;
      const clicked = variantEvents.filter((e) => e.type === "clicked").length;

      return {
        openRate: delivered > 0 ? (opened / delivered) * 100 : 0,
        clickRate: delivered > 0 ? (clicked / delivered) * 100 : 0,
      };
    };

    return {
      variantA: calculateVariantPerformance("A"),
      variantB: calculateVariantPerformance("B"),
    };
  },
});

// Internal mutation to store recommendations
export const storeRecommendations = internalMutation({
  args: {
    userId: v.string(),
    category: v.string(),
    timeScores: v.array(
      v.object({
        dayOfWeek: v.string(),
        hour: v.number(),
        score: v.number(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    // Check if recommendations already exist
    const existing = await ctx.db
      .query("recommendations")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.category),
      )
      .first();

    if (existing) {
      // Update existing recommendations
      await ctx.db.patch(existing._id, {
        timeScores: args.timeScores,
      });
    } else {
      // Create new recommendations
      await ctx.db.insert("recommendations", {
        userId: args.userId,
        category: args.category,
        timeScores: args.timeScores,
      });
    }

    return null;
  },
});

// // Get recommendations for a user and category
// export const getRecommendations = query({
//   args: {
//     category: v.string(),
//     limit: v.optional(v.number()),
//   },
//   returns: v.array(
//     v.object({
//       dayOfWeek: v.string(),
//       hour: v.number(),
//       score: v.number(),
//     }),
//   ),
//   handler: async (ctx, args) => {
//     const userId = await ctx.auth.getUserIdentity();
//     if (!userId) {
//       throw new Error("User must be authenticated");
//     }

//     const recommendations = await ctx.db
//       .query("recommendations")
//       .withIndex("by_user_and_category", (q) =>
//         q.eq("userId", userId).eq("category", args.category),
//       )
//       .first();

//     if (!recommendations) {
//       // Return default recommendations if none exist
//       return [
//         { dayOfWeek: "Tuesday", hour: 10, score: 0.85 },
//         { dayOfWeek: "Wednesday", hour: 14, score: 0.82 },
//         { dayOfWeek: "Thursday", hour: 9, score: 0.78 },
//         { dayOfWeek: "Tuesday", hour: 15, score: 0.75 },
//         { dayOfWeek: "Wednesday", hour: 11, score: 0.72 },
//       ];
//     }

//     const limit = args.limit || 10;
//     return recommendations.timeScores
//       .sort((a, b) => b.score - a.score)
//       .slice(0, limit);
//   },
// });

// Trigger recommendation generation for all users (can be called via cron)
export const generateAllRecommendations = internalAction({
  args: {},
  returns: v.null(),
  handler: async (ctx, args) => {
    // Get all unique user-category combinations
    const campaigns = await ctx.runQuery(
      internal.recommendations.getAllUserCategories,
    );

    const userCategories = new Map<string, Set<string>>();

    campaigns.forEach((campaign: { userId: string; category: string }) => {
      if (!userCategories.has(campaign.userId)) {
        userCategories.set(campaign.userId, new Set());
      }
      userCategories.get(campaign.userId)!.add(campaign.category);
    });

    // Generate recommendations for each user-category combination
    // for (const [userId, categories] of userCategories) {
    //   for (const category of categories) {
    //     try {
    //       await ctx.runAction(
    //         internal.recommendations.generateRecommendations,
    //         {
    //           userId,
    //           category,
    //         },
    //       );
    //       console.log(
    //         `Generated recommendations for user ${userId}, category ${category}`,
    //       );
    //     } catch (error) {
    //       console.error(
    //         `Failed to generate recommendations for user ${userId}, category ${category}:`,
    //         error,
    //       );
    //     }
    //   }
    // }

    return null;
  },
});

// Internal query to get all user-category combinations
export const getAllUserCategories = internalQuery({
  args: {},
  returns: v.array(
    v.object({
      userId: v.string(),
      category: v.string(),
    }),
  ),
  handler: async (ctx) => {
    const campaigns = await ctx.db
      .query("campaigns")
      .filter((q) => q.eq(q.field("status"), "sent"))
      .collect();

    // Get unique user-category combinations
    const combinations = new Map<string, Set<string>>();
    campaigns.forEach((campaign) => {
      if (!combinations.has(campaign.userId)) {
        combinations.set(campaign.userId, new Set());
      }
      combinations.get(campaign.userId)!.add(campaign.category);
    });

    const result: Array<{ userId: string; category: string }> = [];
    for (const [userId, categories] of combinations) {
      for (const category of categories) {
        result.push({ userId, category });
      }
    }

    return result;
  },
});
