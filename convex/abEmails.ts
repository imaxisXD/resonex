import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";
import { vOnCompleteArgs } from "@convex-dev/workpool";
import { EmailId, Resend, vEmailEvent, vEmailId } from "@convex-dev/resend";
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
        await ctx.db.insert("abEmailResend", {
          campaignId: campaign._id,
          resendEmailId: resendEmail,
          emailId: email._id,
        });
      }
    }
    return null;
  },
});

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (ctx, args) => {
    const email = await ctx.db
      .query("abEmailResend")
      .withIndex("by_resend_email_id", (q) => q.eq("resendEmailId", args.id))
      .first();
    if (email) {
      await ctx.db.patch(email._id, {
        event: args.event.type,
        recipient: args.event.data.to[0],
        timestamp: args.event.created_at,
      });
      if (args.event.type === "email.sent") {
        await ctx.db.patch(email.campaignId, {
          status: "sent",
        });
      }
      if (args.event.type === "email.delivered") {
        await ctx.db.patch(email.campaignId, {
          status: "delivered",
        });
      }
    }
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

export const getEmailStatus = query({
  args: {
    campaignId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new ConvexError("User not found");
    }
    const campaignID = ctx.db.normalizeId("campaigns", args.campaignId);
    if (!campaignID) {
      throw new ConvexError("Campaign not found");
    }
    const campaign = await ctx.db.get(campaignID);
    if (!campaign) {
      throw new ConvexError("Campaign not found");
    }
    if (!campaign.resendEmailIds) {
      return null;
    }
    const emailAndStatuses = await Promise.all(
      campaign.resendEmailIds.map(async (emailId) => {
        console.log("Getting email data for", emailId);
        const emailData = await resend.get(ctx, emailId as EmailId);

        return {
          emailId: emailId,
          to: emailData?.to ?? "<Deleted>",
          subject: emailData?.subject ?? "<Deleted>",
          status: emailData?.status,
          errorMessage: emailData?.errorMessage,
          opened: emailData?.opened,
          complained: emailData?.complained,
        };
      }),
    );
    return emailAndStatuses;
  },
});
