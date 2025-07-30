import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Save or update the React Flow canvas state for a campaign
export const saveCanvas = mutation({
  args: {
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
  },
  returns: v.id("reactFlowCanvas"),
  handler: async (ctx, args) => {
    // Check if canvas already exists for this campaign
    const existingCanvas = await ctx.db
      .query("reactFlowCanvas")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .unique();

    if (existingCanvas) {
      // Update existing canvas
      await ctx.db.patch(existingCanvas._id, {
        nodes: args.nodes,
        edges: args.edges,
      });
      return existingCanvas._id;
    } else {
      // Create new canvas
      return await ctx.db.insert("reactFlowCanvas", {
        campaignId: args.campaignId,
        nodes: args.nodes,
        edges: args.edges,
      });
    }
  },
});

// Load the React Flow canvas state for a campaign
export const loadCanvas = query({
  args: { campaignId: v.id("campaigns") },
  returns: v.union(
    v.object({
      _id: v.id("reactFlowCanvas"),
      _creationTime: v.number(),
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
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reactFlowCanvas")
      .withIndex("by_campaign", (q) => q.eq("campaignId", args.campaignId))
      .unique();
  },
});
