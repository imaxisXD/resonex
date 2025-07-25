import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

// The schema is normally optional, but Convex Auth
// requires indexes defined on `authTables`.
// The schema provides more precise TypeScript types.
export default defineSchema({
  ...authTables,

  // Campaign data model
  campaigns: defineTable({
    campaignName: v.string(),
    userId: v.string(),
    prompt: v.string(),
    subjectLines: v.optional(
      v.object({
        A: v.string(),
        B: v.string(),
      }),
    ),
    body: v.optional(v.string()),
    recipients: v.optional(v.array(v.string())),
    sendTimeA: v.optional(v.number()),
    sendTimeB: v.optional(v.number()),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("sent"),
    ),
    category: v.union(v.literal("newsletter"), v.literal("marketing")),
    resendEmailIds: v.optional(
      v.object({
        A: v.array(v.string()),
        B: v.array(v.string()),
      }),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"]),

  // Email event tracking
  events: defineTable({
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
  })
    .index("by_campaign", ["campaignId"])
    .index("by_email_id", ["emailId"])
    .index("by_campaign_and_variant", ["campaignId", "variant"])
    .index("by_type", ["type"]),

  // Time-based recommendations
  recommendations: defineTable({
    userId: v.string(),
    category: v.string(),
    timeScores: v.array(
      v.object({
        dayOfWeek: v.string(),
        hour: v.number(),
        score: v.number(),
      }),
    ),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"]),

  // Legacy table - keeping for backward compatibility
  numbers: defineTable({
    value: v.number(),
  }),
});
