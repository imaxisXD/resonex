import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { vOnCompleteArgs } from "@convex-dev/workpool";
import { Resend, vEmailEvent, vEmailId } from "@convex-dev/resend";
import { components, internal } from "./_generated/api";

export const resend: Resend = new Resend(components.resend, {
  onEmailEvent: internal.abEmails.handleEmailEvent,
  testMode: false,
});

export const emailOnComplete = internalMutation({
  args: vOnCompleteArgs(v.object({ emailId: v.id("abEmails") })),
  handler: async (ctx, { context, result }) => {
    if (result.kind === "canceled" || result.kind === "failed") return;

    await ctx.db.patch(context.emailId, {
      status: "draft",
    });
  },
});

export const getEmailFromNodeId = query({
  args: {
    nodeId: v.string(),
    campaignId: v.id("campaigns"),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("User not found");
    }

    return await ctx.db
      .query("abEmails")
      .withIndex("by_campaign_node", (q) =>
        q.eq("campaignId", args.campaignId).eq("nodeId", args.nodeId),
      )
      .first();
  },
});

export const updateEmailContent = internalMutation({
  args: {
    emailId: v.id("abEmails"),
    body: v.string(),
    subjectLine: v.string(),
    ctaText: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.emailId, {
      body: args.body,
      subjectLine: args.subjectLine,
      ctaText: args.ctaText,
    });
  },
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(ctx, {
      from: "onboarding@resend.dev",
      to: "delivered@resend.dev",
      subject: "Hi there",
      html: "This is a test email",
    });
  },
});

export const sendEmail = internalMutation({
  args: {
    emailId: v.id("abEmails"),
    campaignId: v.id("campaigns"),
    recipients: v.array(
      v.object({
        email: v.string(),
        name: v.string(),
      }),
    ),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const email = await ctx.db.get(args.emailId);
    if (!email) {
      throw new ConvexError("Email not found");
    }
    const campaign = await ctx.db.get(args.campaignId);
    if (!campaign) {
      throw new ConvexError("Campaign not found");
    }

    if (args.recipients && args.recipients.length > 0) {
      for (const recipient of args.recipients) {
        const resendEmail = await resend.sendEmail(ctx, {
          from: "Resonex <marketing@campagin.resonex.cc>",
          to: recipient.email,
          subject: email.subjectLine,
          html: email.aiEmailString,
        });
        await ctx.db.patch(args.campaignId, {
          resendEmailIds: [...(campaign.resendEmailIds || []), resendEmail],
        });
      }
    }
    return null;
  },
});

// export const handleEmailEvent = resend.defineOnEmailEvent(async (ctx, args) => {
//   console.log("Got called back!", args.id, args.event);
//   // Probably do something with the event if you care about deliverability!
// });

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (ctx, args) => {
    console.log("Email event:", args.id, args.event);
    // Probably do something with the event if you care about deliverability!
  },
});

export const addAiEmailString = mutation({
  args: {
    emailId: v.id("abEmails"),
    aiEmailString: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("User not found");
    }

    const email = await ctx.db.get(args.emailId);
    if (!email) {
      throw new ConvexError("Email not found");
    }
    await ctx.db.patch(args.emailId, { aiEmailString: args.aiEmailString });
  },
});
