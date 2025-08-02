import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  campaigns: defineTable({
    campaignName: v.string(),
    userId: v.string(),
    prompt: v.string(),
    recipients: v.optional(v.array(v.string())),
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
    emailIds: v.optional(v.array(v.id("abEmails"))),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_user_and_status", ["userId", "status"])
    .index("by_email_ids", ["emailIds"]),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
    email: v.string(),
    pictureUrl: v.optional(v.string()),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  abEmails: defineTable({
    campaignId: v.id("campaigns"),
    body: v.string(),
    subjectLine: v.string(),
    sendTime: v.optional(v.number()),
    ctaText: v.optional(v.string()),
    nodeId: v.string(),
    templateId: v.string(),
    resendEmailIds: v.optional(v.array(v.string())),
    status: v.union(
      v.literal("draft"),
      v.literal("scheduled"),
      v.literal("sent"),
      v.literal("generating"),
    ),
  })
    .index("by_node_id", ["nodeId"])
    .index("by_template_id", ["templateId"])
    .index("by_campaign", ["campaignId"])
    .index("by_campaign_node", ["campaignId", "nodeId"])
    .index("by_status", ["status"]),

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

  reactFlowCanvas: defineTable({
    campaignId: v.id("campaigns"),
    nodes: v.array(
      v.object({
        id: v.string(),
        type: v.string(),
        position: v.object({ x: v.number(), y: v.number() }),
        data: v.any(),
        measured: v.object({
          width: v.number(),
          height: v.number(),
        }),
        // Only store essential layout properties
        hidden: v.optional(v.boolean()),
        zIndex: v.optional(v.number()),
      }),
    ),
    edges: v.array(
      v.object({
        id: v.string(),
        source: v.string(),
        target: v.string(),
        sourceHandle: v.optional(v.string()),
        targetHandle: v.optional(v.string()),
        type: v.optional(v.string()),
        label: v.optional(v.string()),
      }),
    ),
  }).index("by_campaign", ["campaignId"]),
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
});
